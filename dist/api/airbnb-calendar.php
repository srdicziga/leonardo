<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

const AIRBNB_LISTING_ID = '561522208362347922';
const DEFAULT_AIRBNB_API_KEY = 'd306zoyjsyarp7ifhu67rjxn52tv0t20';
const PDP_CALENDAR_HASH = '8f08e03c7bd16fcad3c92a3592c19a8b559a0d0855a84028d1163d4733ed9ade';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const CACHE_TTL_SECONDS = 60;

$cacheFile = rtrim(sys_get_temp_dir(), '/\\') . '/leonardo_airbnb_calendar_' . AIRBNB_LISTING_ID . '.json';
$keyCacheFile = rtrim(sys_get_temp_dir(), '/\\') . '/leonardo_airbnb_apikey.txt';
$forceRefresh = isset($_GET['refresh']) && ($_GET['refresh'] === '1' || $_GET['refresh'] === 'true');

function httpGet(string $url, array $headers = []): ?string {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT => 12,
            CURLOPT_CONNECTTIMEOUT => 6,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($body !== false && $status >= 200 && $status < 300) {
            return $body;
        }
        return null;
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 12,
            'header' => implode("\r\n", $headers),
        ],
    ]);
    $body = @file_get_contents($url, false, $context);
    return $body === false ? null : $body;
}

function resolveAirbnbApiKey(string $keyCacheFile): string {
    $html = httpGet('https://www.airbnb.si/rooms/' . AIRBNB_LISTING_ID, [
        'User-Agent: ' . USER_AGENT,
        'Accept: text/html,application/xhtml+xml',
    ]);
    if ($html !== null && preg_match('/"api_config":\{[^}]*"key":"([^"]+)"/', $html, $matches)) {
        @file_put_contents($keyCacheFile, $matches[1]);
        return $matches[1];
    }
    if (is_file($keyCacheFile)) {
        $saved = trim((string) @file_get_contents($keyCacheFile));
        if ($saved !== '') {
            return $saved;
        }
    }
    return DEFAULT_AIRBNB_API_KEY;
}

function fetchAirbnbWindow(int $year, int $month, int $count, string $apiKey): array {
    $variables = json_encode([
        'request' => [
            'count' => $count,
            'listingId' => AIRBNB_LISTING_ID,
            'month' => $month,
            'year' => $year,
        ],
    ], JSON_UNESCAPED_SLASHES);

    $extensions = json_encode([
        'persistedQuery' => [
            'version' => 1,
            'sha256Hash' => PDP_CALENDAR_HASH,
        ],
    ], JSON_UNESCAPED_SLASHES);

    $url = 'https://www.airbnb.si/api/v3/PdpAvailabilityCalendar?operationName=PdpAvailabilityCalendar&locale=sl&currency=EUR'
        . '&variables=' . rawurlencode((string) $variables)
        . '&extensions=' . rawurlencode((string) $extensions);

    $raw = httpGet($url, [
        'User-Agent: ' . USER_AGENT,
        'X-Airbnb-API-Key: ' . $apiKey,
        'Accept: application/json',
    ]);

    if ($raw === null) {
        return [];
    }

    $json = json_decode($raw, true);
    $months = $json['data']['merlin']['pdpAvailabilityCalendar']['calendarMonths'] ?? [];
    if (!is_array($months)) {
        return [];
    }

    $result = [];
    foreach ($months as $m) {
        foreach ($m['days'] ?? [] as $d) {
            if (!empty($d['calendarDate'])) {
                $result[(string) $d['calendarDate']] = [
                    'available' => (bool) ($d['available'] ?? false),
                    'availableForCheckin' => (bool) ($d['availableForCheckin'] ?? false),
                    'availableForCheckout' => (bool) ($d['availableForCheckout'] ?? false),
                    'minNights' => (int) ($d['minNights'] ?? 1),
                ];
            }
        }
    }

    return $result;
}

$cachedPayload = null;
if (is_file($cacheFile)) {
    $decoded = json_decode((string) @file_get_contents($cacheFile), true);
    if (is_array($decoded) && isset($decoded['timestamp'], $decoded['days'])) {
        $cachedPayload = $decoded;
        if (!$forceRefresh && (time() - (int) $decoded['timestamp']) < CACHE_TTL_SECONDS) {
            echo json_encode([
                'ok' => count($decoded['days']) > 0,
                'listingId' => AIRBNB_LISTING_ID,
                'source' => 'airbnb.si',
                'syncedAt' => $decoded['syncedAt'],
                'totalDays' => count($decoded['days']),
                'days' => $decoded['days'],
            ]);
            exit;
        }
    }
}

$apiKey = DEFAULT_AIRBNB_API_KEY;
if (is_file($keyCacheFile)) {
    $savedKey = trim((string) @file_get_contents($keyCacheFile));
    if ($savedKey !== '') {
        $apiKey = $savedKey;
    }
}

$now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
$startYear = (int) $now->format('Y');
$startMonth = (int) $now->format('n');

$windows = [];
foreach ([0, 12, 24] as $offset) {
    $d = DateTimeImmutable::createFromFormat('!Y-n-j', sprintf('%d-%d-1', $startYear, $startMonth))
        ->modify('+' . $offset . ' months');
    $windows[] = [
        'year' => (int) $d->format('Y'),
        'month' => (int) $d->format('n'),
    ];
}

$days = [];
foreach ($windows as $win) {
    $chunk = fetchAirbnbWindow($win['year'], $win['month'], 12, $apiKey);
    foreach ($chunk as $date => $info) {
        $days[$date] = $info;
    }
}

if (count($days) === 0) {
    $freshKey = resolveAirbnbApiKey($keyCacheFile);
    foreach ($windows as $win) {
        $chunk = fetchAirbnbWindow($win['year'], $win['month'], 12, $freshKey);
        foreach ($chunk as $date => $info) {
            $days[$date] = $info;
        }
    }
}

if (count($days) > 0) {
    $syncedAt = gmdate('c');
    @file_put_contents($cacheFile, json_encode([
        'timestamp' => time(),
        'syncedAt' => $syncedAt,
        'days' => $days,
    ]));

    echo json_encode([
        'ok' => true,
        'listingId' => AIRBNB_LISTING_ID,
        'source' => 'airbnb.si',
        'syncedAt' => $syncedAt,
        'totalDays' => count($days),
        'days' => $days,
    ]);
    exit;
}

if ($cachedPayload !== null && count($cachedPayload['days']) > 0) {
    echo json_encode([
        'ok' => true,
        'listingId' => AIRBNB_LISTING_ID,
        'source' => 'airbnb.si',
        'syncedAt' => $cachedPayload['syncedAt'],
        'totalDays' => count($cachedPayload['days']),
        'days' => $cachedPayload['days'],
    ]);
    exit;
}

echo json_encode([
    'ok' => false,
    'listingId' => AIRBNB_LISTING_ID,
    'source' => 'airbnb.si',
    'syncedAt' => gmdate('c'),
    'totalDays' => 0,
    'days' => new stdClass(),
]);
