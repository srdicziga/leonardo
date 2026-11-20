import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AIRBNB_LISTING_ID = '561522208362347922';
const DEFAULT_AIRBNB_API_KEY = 'd306zoyjsyarp7ifhu67rjxn52tv0t20';
const PDP_CALENDAR_HASH = '8f08e03c7bd16fcad3c92a3592c19a8b559a0d0855a84028d1163d4733ed9ade';
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export interface AirbnbDayStatus {
  available: boolean;
  availableForCheckin: boolean;
  availableForCheckout: boolean;
  minNights: number;
}

interface CachedCalendar {
  timestamp: number;
  syncedAt: string;
  days: Record<string, AirbnbDayStatus>;
}

let cachedCalendar: CachedCalendar | null = null;
let cachedApiKey = DEFAULT_AIRBNB_API_KEY;
const CACHE_TTL_MS = 60 * 1000; // 1 minute live cache

async function resolveAirbnbApiKey(): Promise<string> {
  try {
    const res = await fetch(`https://www.airbnb.si/rooms/${AIRBNB_LISTING_ID}`, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    const html = await res.text();
    const match = html.match(/"api_config":\{[^}]*"key":"([^"]+)"/);
    if (match && match[1]) {
      cachedApiKey = match[1];
    }
  } catch {
    // Fallback to known key
  }
  return cachedApiKey;
}

async function fetchAirbnbWindow(
  year: number,
  month: number,
  count: number,
  apiKey: string
): Promise<Record<string, AirbnbDayStatus>> {
  const variables = JSON.stringify({
    request: {
      count,
      listingId: AIRBNB_LISTING_ID,
      month,
      year,
    },
  });
  const extensions = JSON.stringify({
    persistedQuery: {
      version: 1,
      sha256Hash: PDP_CALENDAR_HASH,
    },
  });

  const url = `https://www.airbnb.si/api/v3/PdpAvailabilityCalendar?operationName=PdpAvailabilityCalendar&locale=sl&currency=EUR&variables=${encodeURIComponent(
    variables
  )}&extensions=${encodeURIComponent(extensions)}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'X-Airbnb-API-Key': apiKey,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    return {};
  }

  const json = (await res.json()) as {
    data?: {
      merlin?: {
        pdpAvailabilityCalendar?: {
          calendarMonths?: Array<{
            year: number;
            month: number;
            days?: Array<{
              calendarDate: string;
              available?: boolean;
              availableForCheckin?: boolean;
              availableForCheckout?: boolean;
              minNights?: number;
            }>;
          }>;
        };
      };
    };
  };

  const months = json?.data?.merlin?.pdpAvailabilityCalendar?.calendarMonths || [];
  const result: Record<string, AirbnbDayStatus> = {};

  for (const m of months) {
    for (const d of m.days || []) {
      if (d.calendarDate) {
        result[d.calendarDate] = {
          available: Boolean(d.available),
          availableForCheckin: Boolean(d.availableForCheckin),
          availableForCheckout: Boolean(d.availableForCheckout),
          minNights: d.minNights || 1,
        };
      }
    }
  }

  return result;
}

async function fetchLiveAirbnbCalendar(forceRefresh = false): Promise<CachedCalendar> {
  if (!forceRefresh && cachedCalendar && Date.now() - cachedCalendar.timestamp < CACHE_TTL_MS) {
    return cachedCalendar;
  }

  const now = new Date();
  const startYear = now.getFullYear();
  const startMonth = now.getMonth() + 1;

  const windows = [0, 12, 24].map((offset) => {
    const d = new Date(startYear, startMonth - 1 + offset, 1);
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });

  let days: Record<string, AirbnbDayStatus> = {};

  const results = await Promise.all(
    windows.map(({ year, month }) => fetchAirbnbWindow(year, month, 12, cachedApiKey))
  );

  for (const chunk of results) {
    Object.assign(days, chunk);
  }

  // If empty, refresh the API key from the room page and retry once
  if (Object.keys(days).length === 0) {
    const freshKey = await resolveAirbnbApiKey();
    const retryResults = await Promise.all(
      windows.map(({ year, month }) => fetchAirbnbWindow(year, month, 12, freshKey))
    );
    days = {};
    for (const chunk of retryResults) {
      Object.assign(days, chunk);
    }
  }

  if (Object.keys(days).length > 0) {
    cachedCalendar = {
      timestamp: Date.now(),
      syncedAt: new Date().toISOString(),
      days,
    };
    return cachedCalendar;
  }

  if (cachedCalendar) {
    return cachedCalendar;
  }

  return {
    timestamp: Date.now(),
    syncedAt: new Date().toISOString(),
    days: {},
  };
}

function resolveServerPort(): number {
  const portFlagIdx = process.argv.indexOf('--port');
  if (portFlagIdx !== -1 && process.argv[portFlagIdx + 1]) {
    const cliPort = Number(process.argv[portFlagIdx + 1]);
    if (Number.isFinite(cliPort) && cliPort > 0) return cliPort;
  }

  const envPort = Number(process.env.PORT);
  const nginxPort = Number(process.env.NGINX_PORT);
  if (Number.isFinite(envPort) && envPort > 0 && envPort !== nginxPort) {
    return envPort;
  }

  const defaultAppPort = Number(process.env.DEFAULT_APP_PORT);
  if (Number.isFinite(defaultAppPort) && defaultAppPort > 0) {
    return defaultAppPort;
  }

  return 3000;
}

async function startServer() {
  const app = express();
  const PORT = resolveServerPort();
  const isProd = process.env.NODE_ENV === 'production';

  app.get('/healthz', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.get('/api/airbnb-calendar', async (req, res) => {
    try {
      const forceRefresh = req.query.refresh === '1' || req.query.refresh === 'true';
      const data = await fetchLiveAirbnbCalendar(forceRefresh);
      res.setHeader('Cache-Control', 'no-store');
      res.json({
        ok: Object.keys(data.days).length > 0,
        listingId: AIRBNB_LISTING_ID,
        source: 'airbnb.si',
        syncedAt: data.syncedAt,
        totalDays: Object.keys(data.days).length,
        days: data.days,
      });
    } catch (err) {
      console.error('Error syncing Airbnb calendar:', err);
      res.status(500).json({ error: 'Failed to sync Airbnb calendar' });
    }
  });

  if (!isProd) {
    const disableHmr = process.env.DISABLE_HMR === 'true';
    const vitePromise = createViteServer({
      server: {
        middlewareMode: true,
        hmr: !disableHmr,
        ...(disableHmr ? { ws: false as const } : {}),
      },
      appType: 'spa',
    });

    app.use(async (req, res, next) => {
      try {
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    // Pre-warm the Airbnb calendar cache on startup
    fetchLiveAirbnbCalendar().catch(() => {});
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
