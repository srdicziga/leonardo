import React, { useEffect, useRef } from 'react';

interface OliveBranchScrollBgProps {
  heroRef: React.RefObject<HTMLElement | null>;
}

/**
 * Dual-Margin Cascading Istrian Olive Canopies (Asymmetric Left & Right) — GPU-Composited Edition:
 * - Preserves the exact asymmetric botanical canopy artwork (tapered wood limbs, lanceolate leaves,
 *   petioles, midribs, and Istrian olives) across 3 depth layers ('back', 'mid', 'front') per side.
 * - Pre-rasterizes each depth layer ONCE onto a crisp offscreen-baked <canvas> with its horizontal
 *   atmospheric fade pre-applied to the alpha channel — eliminating ~7,000 SVG DOM nodes, runtime
 *   CSS mask-image compositing, and 60fps JS/SVG layout thrashing.
 * - Gentle multi-depth Mediterranean breeze runs purely on the GPU compositor via CSS transforms
 *   and pauses automatically when off-screen or when the browser tab is hidden.
 */

type Pt = [number, number];
type LeafTone = 'shadow' | 'olive' | 'sunlit' | 'silver';
type CanopyDepth = 'back' | 'mid' | 'front';

interface CanopyLeaf {
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  bend: number;
  tone: LeafTone;
}

interface CanopyOlive {
  x: number;
  y: number;
  stemDx: number;
  stemDy: number;
  tilt: number;
  dark: boolean;
}

interface CanopyTwig {
  pts: [Pt, Pt, Pt, Pt];
  strokeWidth: number;
  strokeColor: string;
  leaves: CanopyLeaf[];
  olives: CanopyOlive[];
}

interface WindBoughCluster {
  id: string;
  layer: CanopyDepth;
  woodPaths: Array<{ leftPts: Pt[]; rightPts: Pt[]; color: string }>;
  twigs: CanopyTwig[];
  clusterOpacity: number;
}

const VIEW_W = 540;
const VIEW_H = 900;

/** Deterministic PRNG for organic, non-repetitive botanical placement */
function createRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** Evaluates a cubic Bezier spline [p0, p1, p2, p3] at parameter t ∈ [0..1] */
function sampleCubic(
  p0: Pt,
  p1: Pt,
  p2: Pt,
  p3: Pt,
  t: number
): { x: number; y: number; angle: number } {
  const u = 1 - t;
  const uu = u * u;
  const tt = t * t;

  const x = uu * u * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + tt * t * p3[0];
  const y = uu * u * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + tt * t * p3[1];

  const dx =
    3 * uu * (p1[0] - p0[0]) +
    6 * u * t * (p2[0] - p1[0]) +
    3 * tt * (p3[0] - p2[0]);
  const dy =
    3 * uu * (p1[1] - p0[1]) +
    6 * u * t * (p2[1] - p1[1]) +
    3 * tt * (p3[1] - p2[1]);

  return { x, y, angle: Math.atan2(dy, dx) };
}

/** Builds tapered woody branch polygon points along a cubic Bezier spline */
function buildTaperedCubicBranchPts(
  pts: [Pt, Pt, Pt, Pt],
  rStart: number,
  rEnd: number
): { leftPts: Pt[]; rightPts: Pt[] } {
  const [p0, p1, p2, p3] = pts;
  const steps = 14;
  const leftPts: Pt[] = [];
  const rightPts: Pt[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    const uu = u * u;
    const tt = t * t;

    const x = uu * u * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + tt * t * p3[0];
    const y = uu * u * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + tt * t * p3[1];
    const dx =
      3 * uu * (p1[0] - p0[0]) +
      6 * u * t * (p2[0] - p1[0]) +
      3 * tt * (p3[0] - p2[0]);
    const dy =
      3 * uu * (p1[1] - p0[1]) +
      6 * u * t * (p2[1] - p1[1]) +
      3 * tt * (p3[1] - p2[1]);

    const mag = Math.hypot(dx, dy) || 1;
    const nx = -dy / mag;
    const ny = dx / mag;
    const r = rStart + (rEnd - rStart) * Math.pow(t, 0.85);
    leftPts.push([x + nx * r, y + ny * r]);
    rightPts.push([x - nx * r, y - ny * r]);
  }

  return { leftPts, rightPts };
}

/** Populates a cubic Bezier shoot with rich, direction-aware Olea europaea leaves and optional olive clusters */
function populateCubicTwig(opts: {
  pts: [Pt, Pt, Pt, Pt];
  nodes: number;
  leafScale: number;
  layer: CanopyDepth;
  seed: number;
  withOlives?: boolean;
  strokeWidth?: number;
}): CanopyTwig {
  const { pts, nodes, leafScale, layer, seed, withOlives = false, strokeWidth } = opts;
  const [p0, p1, p2, p3] = pts;
  const rand = createRng(seed);
  const leaves: CanopyLeaf[] = [];
  const olives: CanopyOlive[] = [];
  const DEG = Math.PI / 180;

  for (let i = 0; i < nodes; i++) {
    const t = 0.08 + (i / Math.max(1, nodes - 1)) * 0.87;
    const pt = sampleCubic(p0, p1, p2, p3, t);
    const sizeTaper = 1 - t * 0.22;

    const angles = [
      pt.angle - (30 + rand() * 28) * DEG,
      pt.angle + (30 + rand() * 28) * DEG,
      ...(rand() > 0.42 ? [pt.angle + (rand() - 0.5) * 52 * DEG] : []),
    ];

    angles.forEach((ang, aIdx) => {
      const length = (23 + rand() * 15) * leafScale * sizeTaper;
      const width = (5.4 + rand() * 2.8) * leafScale * sizeTaper;
      const bend = (rand() - 0.5) * length * 0.18;

      let tone: LeafTone;
      const roll = rand();
      if (layer === 'back') {
        tone = roll < 0.6 ? 'shadow' : roll < 0.85 ? 'olive' : 'silver';
      } else if (layer === 'mid') {
        tone = roll < 0.25 ? 'shadow' : roll < 0.58 ? 'olive' : roll < 0.85 ? 'silver' : 'sunlit';
      } else {
        tone = roll < 0.12 ? 'shadow' : roll < 0.44 ? 'olive' : roll < 0.72 ? 'sunlit' : 'silver';
      }

      leaves.push({
        x: pt.x + (rand() - 0.5) * 2.0,
        y: pt.y + (rand() - 0.5) * 2.0,
        angle: ang + (aIdx === 2 ? (rand() - 0.5) * 20 * DEG : 0),
        length,
        width,
        bend,
        tone,
      });
    });

    if (withOlives && i % 3 === 1 && rand() > 0.34) {
      olives.push({
        x: pt.x,
        y: pt.y,
        stemDx: (rand() - 0.5) * 7,
        stemDy: 9 + rand() * 5.5,
        tilt: (rand() - 0.5) * 24 * DEG,
        dark: rand() > 0.64,
      });
    }
  }

  const tip = sampleCubic(p0, p1, p2, p3, 1);
  leaves.push({
    x: tip.x,
    y: tip.y,
    angle: tip.angle + (rand() - 0.5) * 10 * DEG,
    length: 24 * leafScale,
    width: 5.8 * leafScale,
    bend: (rand() - 0.5) * 2.5,
    tone: layer === 'back' ? 'olive' : 'sunlit',
  });

  return {
    pts,
    strokeWidth: strokeWidth ?? (layer === 'back' ? 1.85 : layer === 'mid' ? 1.4 : 1.1),
    strokeColor: layer === 'back' ? '#3C4430' : layer === 'mid' ? '#50523E' : '#63684E',
    leaves,
    olives,
  };
}

function createCornerCanopyClusters(): WindBoughCluster[] {
  const clusters: WindBoughCluster[] = [];

  const backDefs: Array<{
    id: string;
    limbs: Array<[Pt, Pt, Pt, Pt]>;
    twigs: Array<{ pts: [Pt, Pt, Pt, Pt]; nodes: number }>;
    seed: number;
  }> = [
    {
      id: 'back-corner-crown',
      limbs: [
        [[18, -24], [32, 36], [88, 72], [176, 86]],
        [[92, -24], [116, 28], [164, 56], [238, 64]],
        [[-22, 28], [44, 48], [112, 92], [168, 152]],
      ],
      twigs: [
        { pts: [[-14, -10], [42, 12], [108, 18], [186, 12]], nodes: 8 },
        { pts: [[48, -22], [72, 24], [118, 42], [192, 48]], nodes: 8 },
        { pts: [[134, -22], [162, 14], [218, 32], [296, 22]], nodes: 9 },
        { pts: [[8, 42], [68, 74], [114, 118], [148, 178]], nodes: 7 },
        { pts: [[-18, 86], [54, 108], [126, 124], [198, 116]], nodes: 8 },
      ],
      seed: 101,
    },
    {
      id: 'back-upper-wall',
      limbs: [
        [[-24, 245], [52, 218], [128, 228], [194, 262]],
        [[-22, 285], [48, 318], [118, 344], [176, 382]],
      ],
      twigs: [
        { pts: [[-10, 172], [58, 162], [124, 184], [184, 224]], nodes: 8 },
        { pts: [[16, 232], [84, 206], [148, 208], [212, 236]], nodes: 8 },
        { pts: [[12, 274], [86, 292], [142, 326], [192, 368]], nodes: 7 },
        { pts: [[-14, 336], [56, 342], [118, 332], [186, 308]], nodes: 7 },
      ],
      seed: 202,
    },
    {
      id: 'back-mid-wall',
      limbs: [
        [[-24, 468], [46, 444], [112, 458], [168, 496]],
        [[-22, 512], [44, 548], [102, 578], [148, 618]],
      ],
      twigs: [
        { pts: [[-10, 412], [52, 404], [112, 422], [166, 456]], nodes: 7 },
        { pts: [[12, 462], [74, 452], [134, 474], [182, 514]], nodes: 7 },
        { pts: [[-12, 526], [54, 544], [104, 576], [142, 622]], nodes: 7 },
      ],
      seed: 303,
    },
    {
      id: 'back-lower-wall',
      limbs: [[[-22, 695], [38, 672], [94, 684], [138, 720]]],
      twigs: [
        { pts: [[-10, 646], [46, 636], [96, 654], [138, 688]], nodes: 6 },
        { pts: [[8, 692], [62, 698], [108, 722], [142, 762]], nodes: 6 },
        { pts: [[-14, 746], [36, 764], [78, 796], [108, 842]], nodes: 6 },
      ],
      seed: 404,
    },
  ];

  backDefs.forEach((bd) => {
    clusters.push({
      id: bd.id,
      layer: 'back',
      woodPaths: bd.limbs.map((pts) => ({
        ...buildTaperedCubicBranchPts(pts, 4.0, 1.35),
        color: '#3C422F',
      })),
      twigs: bd.twigs.map((tw, tIdx) =>
        populateCubicTwig({
          pts: tw.pts,
          nodes: tw.nodes,
          leafScale: 1.0,
          layer: 'back',
          seed: bd.seed + tIdx * 17,
        })
      ),
      clusterOpacity: 0.9,
    });
  });

  const midDefs: Array<{
    id: string;
    limbs: Array<[Pt, Pt, Pt, Pt]>;
    twigs: Array<{ pts: [Pt, Pt, Pt, Pt]; nodes: number; leafScale?: number }>;
    seed: number;
  }> = [
    {
      id: 'mid-top-drape',
      limbs: [[[168, -20], [186, 28], [228, 64], [294, 78]]],
      twigs: [
        { pts: [[176, 8], [186, 62], [202, 114], [228, 162]], nodes: 7 },
        { pts: [[204, 42], [244, 24], [292, 22], [352, 34]], nodes: 8 },
        { pts: [[228, 62], [278, 72], [326, 98], [364, 134]], nodes: 7 },
        { pts: [[182, 26], [148, 52], [116, 64], [86, 62]], nodes: 5, leafScale: 0.88 },
      ],
      seed: 511,
    },
    {
      id: 'mid-corner-diag',
      limbs: [[[-16, 56], [48, 38], [114, 52], [178, 92]]],
      twigs: [
        { pts: [[18, 46], [62, 12], [112, -2], [164, 4]], nodes: 6, leafScale: 0.9 },
        { pts: [[64, 44], [126, 48], [188, 76], [244, 122]], nodes: 8 },
        { pts: [[44, 46], [76, 98], [94, 152], [102, 208]], nodes: 7 },
      ],
      seed: 547,
    },
    {
      id: 'mid-upper-split',
      limbs: [[[-18, 204], [64, 178], [156, 174], [246, 198]]],
      twigs: [
        { pts: [[34, 188], [98, 144], [168, 118], [242, 108]], nodes: 8 },
        { pts: [[112, 172], [178, 182], [238, 212], [286, 256]], nodes: 8 },
        { pts: [[76, 178], [106, 224], [122, 268], [128, 308]], nodes: 6, leafScale: 0.9 },
        { pts: [[148, 176], [134, 146], [112, 124], [86, 114]], nodes: 4, leafScale: 0.84 },
      ],
      seed: 612,
    },
    {
      id: 'mid-center-sweep',
      limbs: [[[-18, 354], [64, 338], [152, 358], [232, 342]]],
      twigs: [
        { pts: [[40, 344], [102, 304], [168, 286], [236, 284]], nodes: 8 },
        { pts: [[98, 346], [164, 356], [228, 384], [282, 424]], nodes: 8 },
        { pts: [[56, 346], [88, 396], [104, 444], [112, 488]], nodes: 6, leafScale: 0.9 },
      ],
      seed: 713,
    },
    {
      id: 'mid-lower-arch',
      limbs: [[[-18, 514], [58, 496], [134, 512], [202, 548]]],
      twigs: [
        { pts: [[34, 502], [92, 464], [154, 446], [218, 444]], nodes: 7 },
        { pts: [[84, 504], [142, 526], [192, 566], [228, 616]], nodes: 7 },
        { pts: [[48, 506], [72, 558], [84, 604], [86, 646]], nodes: 5, leafScale: 0.88 },
      ],
      seed: 814,
    },
    {
      id: 'mid-bottom-cascade',
      limbs: [[[-16, 686], [48, 672], [108, 692], [158, 728]]],
      twigs: [
        { pts: [[26, 678], [76, 646], [128, 632], [182, 634]], nodes: 6 },
        { pts: [[68, 682], [116, 706], [154, 744], [178, 788]], nodes: 6 },
        { pts: [[28, 684], [48, 738], [58, 788], [60, 834]], nodes: 5, leafScale: 0.86 },
      ],
      seed: 915,
    },
  ];

  midDefs.forEach((md) => {
    clusters.push({
      id: md.id,
      layer: 'mid',
      woodPaths: md.limbs.map((pts) => ({
        ...buildTaperedCubicBranchPts(pts, 3.1, 1.0),
        color: '#4F4C3A',
      })),
      twigs: md.twigs.map((tw, tIdx) =>
        populateCubicTwig({
          pts: tw.pts,
          nodes: tw.nodes,
          leafScale: tw.leafScale ?? 0.94,
          layer: 'mid',
          seed: md.seed + tIdx * 23,
          withOlives: true,
        })
      ),
      clusterOpacity: 0.97,
    });
  });

  const frontDefs: Array<{
    id: string;
    twigs: Array<{ pts: [Pt, Pt, Pt, Pt]; nodes: number; leafScale: number }>;
    seed: number;
  }> = [
    {
      id: 'front-long-corner',
      twigs: [
        { pts: [[255, -14], [312, 22], [388, 32], [472, 16]], nodes: 10, leafScale: 0.92 },
        { pts: [[292, 12], [344, 46], [392, 88], [428, 138]], nodes: 7, leafScale: 0.88 },
        { pts: [[268, 2], [252, 48], [256, 94], [274, 134]], nodes: 5, leafScale: 0.84 },
      ],
      seed: 1111,
    },
    {
      id: 'front-long-upper',
      twigs: [
        { pts: [[164, 118], [268, 146], [382, 124], [492, 86]], nodes: 11, leafScale: 0.94 },
        { pts: [[282, 138], [344, 168], [398, 206], [434, 252]], nodes: 7, leafScale: 0.86 },
        { pts: [[224, 136], [242, 102], [268, 78], [296, 66]], nodes: 4, leafScale: 0.82 },
      ],
      seed: 1212,
    },
    {
      id: 'front-mid-reach',
      twigs: [
        { pts: [[152, 266], [248, 242], [354, 268], [452, 306]], nodes: 10, leafScale: 0.9 },
        { pts: [[262, 250], [324, 224], [386, 208], [438, 208]], nodes: 6, leafScale: 0.86 },
        { pts: [[202, 254], [218, 298], [224, 342], [218, 384]], nodes: 5, leafScale: 0.82 },
      ],
      seed: 1313,
    },
    {
      id: 'front-mid-upward',
      twigs: [
        { pts: [[138, 434], [218, 444], [308, 412], [392, 368]], nodes: 9, leafScale: 0.88 },
        { pts: [[228, 434], [286, 456], [336, 488], [372, 526]], nodes: 6, leafScale: 0.84 },
      ],
      seed: 1414,
    },
    {
      id: 'front-lower-weep',
      twigs: [
        { pts: [[108, 594], [182, 578], [254, 592], [318, 622]], nodes: 7, leafScale: 0.86 },
        { pts: [[164, 584], [204, 548], [246, 522], [286, 512]], nodes: 5, leafScale: 0.82 },
        { pts: [[136, 588], [156, 636], [164, 686], [158, 734]], nodes: 5, leafScale: 0.8 },
      ],
      seed: 1515,
    },
    {
      id: 'front-bottom-tuft',
      twigs: [
        { pts: [[66, 756], [122, 744], [176, 758], [224, 788]], nodes: 5, leafScale: 0.82 },
        { pts: [[104, 748], [134, 718], [168, 698], [202, 692]], nodes: 4, leafScale: 0.78 },
      ],
      seed: 1616,
    },
  ];

  frontDefs.forEach((fd) => {
    clusters.push({
      id: fd.id,
      layer: 'front',
      woodPaths: [],
      twigs: fd.twigs.map((tw, tIdx) =>
        populateCubicTwig({
          pts: tw.pts,
          nodes: tw.nodes,
          leafScale: tw.leafScale,
          layer: 'front',
          seed: fd.seed + tIdx * 29,
          withOlives: true,
        })
      ),
      clusterOpacity: 1,
    });
  });

  return clusters;
}

function createRightCornerCanopyClusters(): WindBoughCluster[] {
  const clusters: WindBoughCluster[] = [];

  const backDefs: Array<{
    id: string;
    limbs: Array<[Pt, Pt, Pt, Pt]>;
    twigs: Array<{ pts: [Pt, Pt, Pt, Pt]; nodes: number }>;
    seed: number;
  }> = [
    {
      id: 'r-back-corner-crown',
      limbs: [
        [[518, -22], [496, 38], [434, 68], [346, 78]],
        [[432, -24], [408, 22], [358, 46], [284, 52]],
        [[562, 42], [494, 64], [428, 108], [374, 168]],
      ],
      twigs: [
        { pts: [[554, -8], [496, 16], [426, 22], [348, 14]], nodes: 8 },
        { pts: [[482, -20], [454, 28], [404, 48], [326, 48]], nodes: 8 },
        { pts: [[386, -22], [352, 12], [296, 26], [224, 16]], nodes: 8 },
        { pts: [[528, 56], [468, 86], [424, 134], [394, 194]], nodes: 7 },
        { pts: [[558, 104], [486, 126], [412, 138], [342, 128]], nodes: 8 },
      ],
      seed: 2101,
    },
    {
      id: 'r-back-upper-wall',
      limbs: [
        [[564, 212], [488, 186], [414, 198], [348, 232]],
        [[562, 268], [492, 304], [422, 328], [362, 366]],
      ],
      twigs: [
        { pts: [[550, 148], [482, 142], [418, 166], [358, 206]], nodes: 7 },
        { pts: [[524, 204], [456, 178], [392, 184], [332, 214]], nodes: 8 },
        { pts: [[528, 254], [454, 274], [398, 308], [352, 352]], nodes: 7 },
        { pts: [[554, 318], [482, 326], [420, 314], [352, 290]], nodes: 7 },
      ],
      seed: 2202,
    },
    {
      id: 'r-back-mid-wall',
      limbs: [
        [[564, 434], [492, 408], [422, 424], [364, 464]],
        [[562, 488], [496, 524], [438, 558], [392, 598]],
      ],
      twigs: [
        { pts: [[550, 378], [486, 372], [426, 392], [372, 428]], nodes: 7 },
        { pts: [[528, 432], [464, 424], [404, 446], [356, 486]], nodes: 7 },
        { pts: [[552, 496], [486, 514], [434, 548], [396, 596]], nodes: 7 },
      ],
      seed: 2303,
    },
    {
      id: 'r-back-lower-wall',
      limbs: [[[562, 658], [498, 636], [442, 650], [396, 688]]],
      twigs: [
        { pts: [[550, 612], [494, 602], [444, 622], [400, 658]], nodes: 6 },
        { pts: [[532, 658], [478, 666], [432, 692], [398, 732]], nodes: 6 },
        { pts: [[554, 718], [504, 736], [462, 768], [432, 814]], nodes: 6 },
      ],
      seed: 2404,
    },
  ];

  backDefs.forEach((bd) => {
    clusters.push({
      id: bd.id,
      layer: 'back',
      woodPaths: bd.limbs.map((pts) => ({
        ...buildTaperedCubicBranchPts(pts, 4.0, 1.35),
        color: '#3C422F',
      })),
      twigs: bd.twigs.map((tw, tIdx) =>
        populateCubicTwig({
          pts: tw.pts,
          nodes: tw.nodes,
          leafScale: 0.98,
          layer: 'back',
          seed: bd.seed + tIdx * 19,
        })
      ),
      clusterOpacity: 0.9,
    });
  });

  const midDefs: Array<{
    id: string;
    limbs: Array<[Pt, Pt, Pt, Pt]>;
    twigs: Array<{ pts: [Pt, Pt, Pt, Pt]; nodes: number; leafScale?: number }>;
    seed: number;
  }> = [
    {
      id: 'r-mid-top-drape',
      limbs: [[[362, -20], [342, 26], [298, 58], [228, 72]]],
      twigs: [
        { pts: [[354, 8], [344, 58], [326, 108], [296, 152]], nodes: 7 },
        { pts: [[322, 40], [280, 22], [230, 18], [168, 28]], nodes: 8 },
        { pts: [[296, 58], [244, 68], [198, 94], [162, 130]], nodes: 7 },
        { pts: [[346, 24], [382, 48], [416, 62], [446, 58]], nodes: 5, leafScale: 0.86 },
      ],
      seed: 2511,
    },
    {
      id: 'r-mid-corner-diag',
      limbs: [[[556, 72], [492, 54], [424, 72], [358, 114]]],
      twigs: [
        { pts: [[522, 62], [478, 26], [426, 10], [372, 14]], nodes: 6, leafScale: 0.9 },
        { pts: [[474, 62], [410, 66], [346, 94], [288, 138]], nodes: 8 },
        { pts: [[496, 64], [464, 118], [448, 174], [440, 232]], nodes: 7 },
      ],
      seed: 2547,
    },
    {
      id: 'r-mid-upper-split',
      limbs: [[[558, 252], [476, 226], [384, 224], [294, 248]]],
      twigs: [
        { pts: [[506, 236], [442, 192], [372, 166], [298, 158]], nodes: 8 },
        { pts: [[428, 222], [362, 234], [302, 264], [254, 308]], nodes: 8 },
        { pts: [[464, 228], [434, 274], [418, 318], [412, 358]], nodes: 6, leafScale: 0.9 },
        { pts: [[392, 226], [406, 194], [428, 172], [454, 162]], nodes: 4, leafScale: 0.84 },
      ],
      seed: 2612,
    },
    {
      id: 'r-mid-center-sweep',
      limbs: [[[558, 402], [476, 386], [388, 406], [308, 388]]],
      twigs: [
        { pts: [[500, 392], [438, 352], [372, 334], [304, 332]], nodes: 8 },
        { pts: [[442, 394], [376, 406], [312, 434], [258, 474]], nodes: 8 },
        { pts: [[484, 394], [452, 444], [436, 492], [428, 536]], nodes: 6, leafScale: 0.88 },
      ],
      seed: 2713,
    },
    {
      id: 'r-mid-lower-arch',
      limbs: [[[558, 558], [482, 540], [406, 556], [338, 592]]],
      twigs: [
        { pts: [[506, 546], [448, 508], [386, 490], [322, 488]], nodes: 7 },
        { pts: [[456, 548], [398, 570], [348, 610], [312, 660]], nodes: 7 },
        { pts: [[492, 550], [468, 602], [456, 648], [454, 690]], nodes: 5, leafScale: 0.88 },
      ],
      seed: 2814,
    },
    {
      id: 'r-mid-bottom-cascade',
      limbs: [[[556, 722], [492, 708], [432, 728], [382, 764]]],
      twigs: [
        { pts: [[514, 714], [464, 682], [412, 668], [358, 670]], nodes: 6 },
        { pts: [[472, 718], [424, 742], [386, 780], [362, 824]], nodes: 6 },
        { pts: [[512, 720], [492, 774], [482, 824], [480, 868]], nodes: 5, leafScale: 0.84 },
      ],
      seed: 2915,
    },
  ];

  midDefs.forEach((md) => {
    clusters.push({
      id: md.id,
      layer: 'mid',
      woodPaths: md.limbs.map((pts) => ({
        ...buildTaperedCubicBranchPts(pts, 3.1, 1.0),
        color: '#4F4C3A',
      })),
      twigs: md.twigs.map((tw, tIdx) =>
        populateCubicTwig({
          pts: tw.pts,
          nodes: tw.nodes,
          leafScale: tw.leafScale ?? 0.93,
          layer: 'mid',
          seed: md.seed + tIdx * 23,
          withOlives: true,
        })
      ),
      clusterOpacity: 0.97,
    });
  });

  const frontDefs: Array<{
    id: string;
    twigs: Array<{ pts: [Pt, Pt, Pt, Pt]; nodes: number; leafScale: number }>;
    seed: number;
  }> = [
    {
      id: 'r-front-corner-tuft',
      twigs: [
        { pts: [[298, -14], [244, 24], [174, 36], [102, 22]], nodes: 9, leafScale: 0.9 },
        { pts: [[258, 14], [208, 48], [162, 90], [128, 138]], nodes: 6, leafScale: 0.85 },
        { pts: [[282, 4], [296, 48], [292, 92], [274, 130]], nodes: 5, leafScale: 0.82 },
      ],
      seed: 3111,
    },
    {
      id: 'r-front-upper-reach',
      twigs: [
        { pts: [[378, 148], [282, 174], [174, 154], [76, 118]], nodes: 10, leafScale: 0.92 },
        { pts: [[268, 166], [206, 198], [154, 236], [118, 282]], nodes: 7, leafScale: 0.86 },
        { pts: [[322, 162], [306, 128], [282, 102], [254, 88]], nodes: 4, leafScale: 0.8 },
      ],
      seed: 3212,
    },
    {
      id: 'r-front-mid-sweep',
      twigs: [
        { pts: [[392, 312], [292, 288], [172, 316], [56, 356]], nodes: 11, leafScale: 0.93 },
        { pts: [[284, 298], [220, 272], [158, 256], [104, 258]], nodes: 7, leafScale: 0.86 },
        { pts: [[342, 302], [326, 348], [318, 394], [324, 438]], nodes: 5, leafScale: 0.82 },
      ],
      seed: 3313,
    },
    {
      id: 'r-front-lower-arch',
      twigs: [
        { pts: [[406, 482], [328, 492], [238, 458], [154, 414]], nodes: 9, leafScale: 0.88 },
        { pts: [[318, 482], [260, 504], [210, 536], [174, 576]], nodes: 6, leafScale: 0.84 },
      ],
      seed: 3414,
    },
    {
      id: 'r-front-lower-weep',
      twigs: [
        { pts: [[436, 636], [358, 620], [280, 634], [208, 668]], nodes: 8, leafScale: 0.87 },
        { pts: [[378, 626], [336, 590], [292, 566], [248, 558]], nodes: 5, leafScale: 0.82 },
        { pts: [[406, 630], [386, 682], [376, 734], [382, 784]], nodes: 6, leafScale: 0.82 },
      ],
      seed: 3515,
    },
    {
      id: 'r-front-bottom-tuft',
      twigs: [
        { pts: [[478, 788], [422, 774], [368, 788], [322, 818]], nodes: 5, leafScale: 0.8 },
        { pts: [[440, 778], [410, 748], [376, 728], [344, 722]], nodes: 4, leafScale: 0.78 },
      ],
      seed: 3616,
    },
  ];

  frontDefs.forEach((fd) => {
    clusters.push({
      id: fd.id,
      layer: 'front',
      woodPaths: [],
      twigs: fd.twigs.map((tw, tIdx) =>
        populateCubicTwig({
          pts: tw.pts,
          nodes: tw.nodes,
          leafScale: tw.leafScale,
          layer: 'front',
          seed: fd.seed + tIdx * 29,
          withOlives: true,
        })
      ),
      clusterOpacity: 1,
    });
  });

  return clusters;
}

const LEAF_TONE_ORDER: LeafTone[] = ['shadow', 'silver', 'olive', 'sunlit'];

const LEAF_STYLES: Record<
  LeafTone,
  {
    petiole: string;
    stops: Array<[number, string]>;
    midrib?: { color: string; width: number; alpha: number };
  }
> = {
  shadow: {
    petiole: '#3F4732',
    stops: [
      [0, '#2D3B23'],
      [1, '#3F5031'],
    ],
  },
  silver: {
    petiole: '#636C54',
    stops: [
      [0, '#8A997E'],
      [0.58, '#A2B097'],
      [1, '#B8C4AE'],
    ],
    midrib: { color: '#7C8C6F', width: 0.65, alpha: 0.65 },
  },
  olive: {
    petiole: '#525B3E',
    stops: [
      [0, '#485B36'],
      [0.6, '#586D41'],
      [1, '#697F4E'],
    ],
    midrib: { color: '#98AA83', width: 0.65, alpha: 0.7 },
  },
  sunlit: {
    petiole: '#667349',
    stops: [
      [0, '#697D44'],
      [0.55, '#7E9252'],
      [1, '#94A765'],
    ],
    midrib: { color: '#C4D3A4', width: 0.7, alpha: 0.75 },
  },
};

function drawCanopyLayerToCanvas(
  canvas: HTMLCanvasElement,
  clusters: WindBoughCluster[],
  side: 'left' | 'right',
  isCompactViewport: boolean
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, isCompactViewport ? 1.25 : 1.5);
  const scale = isCompactViewport ? 0.65 * dpr : dpr;
  const pixelW = Math.round(VIEW_W * scale);
  const pixelH = Math.round(VIEW_H * scale);

  if (canvas.width !== pixelW || canvas.height !== pixelH) {
    canvas.width = pixelW;
    canvas.height = pixelH;
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, pixelW, pixelH);
  ctx.scale(scale, scale);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const cluster of clusters) {
    ctx.save();
    ctx.globalAlpha = cluster.clusterOpacity;

    // 1. Tapered wood branches
    for (const wp of cluster.woodPaths) {
      ctx.beginPath();
      wp.leftPts.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt[0], pt[1]);
        else ctx.lineTo(pt[0], pt[1]);
      });
      for (let i = wp.rightPts.length - 1; i >= 0; i--) {
        ctx.lineTo(wp.rightPts[i][0], wp.rightPts[i][1]);
      }
      ctx.closePath();
      ctx.fillStyle = wp.color;
      ctx.fill();
    }

    // 2. Twigs, leaves by tone depth, and olives
    for (const twig of cluster.twigs) {
      const [p0, p1, p2, p3] = twig.pts;
      ctx.beginPath();
      ctx.moveTo(p0[0], p0[1]);
      ctx.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
      ctx.strokeStyle = twig.strokeColor;
      ctx.lineWidth = twig.strokeWidth;
      ctx.stroke();

      for (const tone of LEAF_TONE_ORDER) {
        const style = LEAF_STYLES[tone];
        for (const leaf of twig.leaves) {
          if (leaf.tone !== tone) continue;

          const petiole = Math.max(2.0, leaf.length * 0.1);
          const bladeLen = leaf.length - petiole;
          const hw = leaf.width * 0.5;
          const c1x = petiole + bladeLen * 0.26;
          const c2x = petiole + bladeLen * 0.72;

          ctx.save();
          ctx.translate(leaf.x, leaf.y);
          ctx.rotate(leaf.angle);

          // Petiole
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(petiole + 0.8, 0);
          ctx.strokeStyle = style.petiole;
          ctx.lineWidth = 0.9;
          ctx.stroke();

          // Lanceolate leaf blade
          const grad = ctx.createLinearGradient(petiole, -hw, leaf.length, hw);
          for (const [offset, color] of style.stops) {
            grad.addColorStop(offset, color);
          }

          ctx.beginPath();
          ctx.moveTo(petiole, 0);
          ctx.bezierCurveTo(
            c1x,
            -hw * 0.92 + leaf.bend * 0.24,
            c2x,
            -hw * 0.68 + leaf.bend * 0.76,
            leaf.length,
            leaf.bend
          );
          ctx.bezierCurveTo(
            c2x,
            hw * 0.68 + leaf.bend * 0.76,
            c1x,
            hw * 0.92 + leaf.bend * 0.24,
            petiole,
            0
          );
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();

          // Delicate midrib
          if (style.midrib) {
            ctx.beginPath();
            ctx.moveTo(petiole, 0);
            ctx.quadraticCurveTo(
              petiole + bladeLen * 0.48,
              leaf.bend * 0.42,
              petiole + bladeLen * 0.85,
              leaf.bend * 0.82
            );
            ctx.strokeStyle = style.midrib.color;
            ctx.lineWidth = style.midrib.width;
            ctx.globalAlpha = cluster.clusterOpacity * style.midrib.alpha;
            ctx.stroke();
            ctx.globalAlpha = cluster.clusterOpacity;
          }

          ctx.restore();
        }
      }

      // Olives tucked in foliage
      for (const ov of twig.olives) {
        ctx.beginPath();
        ctx.moveTo(ov.x, ov.y);
        ctx.lineTo(ov.x + ov.stemDx, ov.y + ov.stemDy * 0.7);
        ctx.strokeStyle = '#5A6345';
        ctx.lineWidth = 0.95;
        ctx.stroke();

        ctx.save();
        ctx.translate(ov.x + ov.stemDx, ov.y + ov.stemDy);
        ctx.rotate(ov.tilt);
        const rGrad = ctx.createRadialGradient(-1.1, -1.7, 0.4, 0, 0, 5.8);
        if (ov.dark) {
          rGrad.addColorStop(0, '#726958');
          rGrad.addColorStop(0.58, '#4B4438');
          rGrad.addColorStop(1, '#2F2B23');
        } else {
          rGrad.addColorStop(0, '#9AB060');
          rGrad.addColorStop(0.58, '#6D833F');
          rGrad.addColorStop(1, '#4A5B2A');
        }
        ctx.beginPath();
        ctx.ellipse(0, 0, 3.8, 5.7, 0, 0, Math.PI * 2);
        ctx.fillStyle = rGrad;
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  // Bake horizontal atmospheric fade mask directly into canvas alpha (eliminates runtime CSS mask-image compositing)
  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';
  const maskGrad =
    side === 'left'
      ? ctx.createLinearGradient(0, 0, VIEW_W, 0)
      : ctx.createLinearGradient(VIEW_W, 0, 0, 0);

  if (isCompactViewport) {
    maskGrad.addColorStop(0, 'rgba(0,0,0,1)');
    maskGrad.addColorStop(0.55, 'rgba(0,0,0,1)');
    maskGrad.addColorStop(0.82, 'rgba(0,0,0,0.4)');
    maskGrad.addColorStop(1, 'rgba(0,0,0,0)');
  } else {
    maskGrad.addColorStop(0, 'rgba(0,0,0,1)');
    maskGrad.addColorStop(0.84, 'rgba(0,0,0,1)');
    maskGrad.addColorStop(0.94, 'rgba(0,0,0,0.65)');
    maskGrad.addColorStop(1, 'rgba(0,0,0,0)');
  }
  ctx.fillStyle = maskGrad;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.restore();
}

let cachedLeftClusters: WindBoughCluster[] | null = null;
let cachedRightClusters: WindBoughCluster[] | null = null;

function getCanopyClusters() {
  if (!cachedLeftClusters) cachedLeftClusters = createCornerCanopyClusters();
  if (!cachedRightClusters) cachedRightClusters = createRightCornerCanopyClusters();
  return { left: cachedLeftClusters, right: cachedRightClusters };
}

export const OliveBranchScrollBg: React.FC<OliveBranchScrollBgProps> = ({ heroRef: _heroRef }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftBackRef = useRef<HTMLCanvasElement | null>(null);
  const leftMidRef = useRef<HTMLCanvasElement | null>(null);
  const leftFrontRef = useRef<HTMLCanvasElement | null>(null);
  const rightBackRef = useRef<HTMLCanvasElement | null>(null);
  const rightMidRef = useRef<HTMLCanvasElement | null>(null);
  const rightFrontRef = useRef<HTMLCanvasElement | null>(null);

  // Paint all 6 static botanical depth layers ONCE after initial paint (0ms impact on Hero LCP)
  useEffect(() => {
    let lastCompact = window.innerWidth < 768;
    let paintHandle: number | null = null;

    const paintAll = () => {
      const { left, right } = getCanopyClusters();
      const compact = window.innerWidth < 768;
      lastCompact = compact;

      const targets: Array<[HTMLCanvasElement | null, WindBoughCluster[], 'left' | 'right', CanopyDepth]> = [
        [leftBackRef.current, left, 'left', 'back'],
        [leftMidRef.current, left, 'left', 'mid'],
        [leftFrontRef.current, left, 'left', 'front'],
        [rightBackRef.current, right, 'right', 'back'],
        [rightMidRef.current, right, 'right', 'mid'],
        [rightFrontRef.current, right, 'right', 'front'],
      ];

      for (const [canvas, source, side, depth] of targets) {
        if (!canvas) continue;
        drawCanopyLayerToCanvas(
          canvas,
          source.filter((c) => c.layer === depth),
          side,
          compact
        );
      }
    };

    // Defer by 1 frame so critical above-the-fold Hero paints immediately
    paintHandle = window.requestAnimationFrame(paintAll);

    const handleResize = () => {
      const compactNow = window.innerWidth < 768;
      if (compactNow !== lastCompact) {
        if (paintHandle !== null) window.cancelAnimationFrame(paintHandle);
        paintHandle = window.requestAnimationFrame(paintAll);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      if (paintHandle !== null) window.cancelAnimationFrame(paintHandle);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Automatically pause GPU animations when canopy wrapper is off-screen or browser tab is hidden
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isIntersecting = false;

    const syncPlayState = () => {
      const shouldRun = isIntersecting && document.visibilityState === 'visible';
      container.classList.toggle('canopy-paused', !shouldRun);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        syncPlayState();
      },
      { rootMargin: '120px 0px' }
    );

    observer.observe(container);
    document.addEventListener('visibilitychange', syncPlayState);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayState);
    };
  }, []);

  const leftWrapperClass =
    'absolute left-0 top-0 h-[420px] sm:h-[580px] md:h-full w-[138px] sm:w-[235px] md:w-[420px] lg:w-[485px] xl:w-[545px] 2xl:w-[585px] opacity-[0.34] sm:opacity-[0.54] md:opacity-[0.80] lg:opacity-[0.90] xl:opacity-[0.96]';

  const rightWrapperClass =
    'absolute right-0 top-0 h-[420px] sm:h-[580px] md:h-full w-[132px] sm:w-[225px] md:w-[408px] lg:w-[475px] xl:w-[532px] 2xl:w-[572px] opacity-[0.32] sm:opacity-[0.52] md:opacity-[0.78] lg:opacity-[0.88] xl:opacity-[0.95]';

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] canopy-paused"
    >
      {/* Anchored flush beneath the sticky header so both canopies fill the upper corners */}
      <div className="sticky top-[60px] sm:top-[68px] lg:top-[76px] h-[calc(100vh-60px)] sm:h-[calc(100vh-68px)] lg:h-[calc(100vh-76px)] w-full overflow-hidden">
        {/* Left asymmetric canopy — 3 GPU-composited depth layers */}
        <div className={leftWrapperClass}>
          <canvas
            ref={leftBackRef}
            className="absolute inset-0 w-full h-full object-cover object-left-top canopy-layer-back-left"
          />
          <canvas
            ref={leftMidRef}
            className="absolute inset-0 w-full h-full object-cover object-left-top canopy-layer-mid-left"
          />
          <canvas
            ref={leftFrontRef}
            className="absolute inset-0 w-full h-full object-cover object-left-top canopy-layer-front-left"
          />
        </div>

        {/* Right asymmetric canopy — 3 GPU-composited depth layers */}
        <div className={rightWrapperClass}>
          <canvas
            ref={rightBackRef}
            className="absolute inset-0 w-full h-full object-cover object-right-top canopy-layer-back-right"
          />
          <canvas
            ref={rightMidRef}
            className="absolute inset-0 w-full h-full object-cover object-right-top canopy-layer-mid-right"
          />
          <canvas
            ref={rightFrontRef}
            className="absolute inset-0 w-full h-full object-cover object-right-top canopy-layer-front-right"
          />
        </div>
      </div>
    </div>
  );
};
