import React, { useEffect, useMemo, useRef } from 'react';

interface OliveBranchScrollBgProps {
  heroRef: React.RefObject<HTMLElement | null>;
}

/**
 * Dual-Margin Cascading Istrian Olive Canopies (Asymmetric Left & Right) with Wind Physics:
 * - Anchored seamlessly out of both top-left and top-right corners right beneath the sticky header,
 *   graduating from dense shadowed interior volume into varied short, medium, and long sweeping shoots.
 * - Deliberately non-symmetrical: the right canopy uses independent Bezier branch trajectories,
 *   staggered vertical rhythms, unique PRNG seeds, and phase-lagged wind frequencies so the two sides
 *   read as natural neighboring olive trees in the same Istrian grove rather than a mirrored reflection.
 * - Soft horizontal atmospheric masks fade cleanly toward the page center, staying at z-[5] behind modules.
 */

type Pt = [number, number];
type LeafTone = 'shadow' | 'olive' | 'sunlit' | 'silver';

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
  pathD: string;
  strokeWidth: number;
  strokeColor: string;
  leaves: CanopyLeaf[];
  olives: CanopyOlive[];
}

interface WindBoughCluster {
  id: string;
  layer: 'back' | 'mid' | 'front';
  pivotX: number;
  pivotY: number;
  swayAmp: number;
  windFreq: number;
  phase: number;
  scrollSensitivity: number;
  woodPaths: Array<{ d: string; color: string }>;
  twigs: CanopyTwig[];
  clusterOpacity: number;
}

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

  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

/** Builds a smooth tapered woody branch silhouette along a cubic Bezier spline */
function buildTaperedCubicBranch(
  pts: [Pt, Pt, Pt, Pt],
  rStart: number,
  rEnd: number
): string {
  const [p0, p1, p2, p3] = pts;
  const steps = 16;
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

  const fwd = leftPts
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt[0].toFixed(1)},${pt[1].toFixed(1)}`)
    .join(' ');
  const bwd = [...rightPts]
    .reverse()
    .map((pt) => `L ${pt[0].toFixed(1)},${pt[1].toFixed(1)}`)
    .join(' ');

  return `${fwd} ${bwd} Z`;
}

/** Narrow, sharp-graceful lanceolate olive leaf with subtle petiole */
function buildSlenderOliveLeafD(
  length: number,
  width: number,
  bend: number
): { bladeD: string; midribD: string; petioleD: string } {
  const petiole = Math.max(2.0, length * 0.1);
  const bladeLen = length - petiole;
  const hw = width * 0.5;
  const c1x = petiole + bladeLen * 0.26;
  const c2x = petiole + bladeLen * 0.72;

  const bladeD = [
    `M ${petiole.toFixed(1)},0`,
    `C ${c1x.toFixed(1)},${(-hw * 0.92 + bend * 0.24).toFixed(1)} ${c2x.toFixed(1)},${(-hw * 0.68 + bend * 0.76).toFixed(1)} ${length.toFixed(1)},${bend.toFixed(1)}`,
    `C ${c2x.toFixed(1)},${(hw * 0.68 + bend * 0.76).toFixed(1)} ${c1x.toFixed(1)},${(hw * 0.92 + bend * 0.24).toFixed(1)} ${petiole.toFixed(1)},0 Z`,
  ].join(' ');

  const midribD = `M ${petiole.toFixed(1)},0 Q ${(petiole + bladeLen * 0.48).toFixed(1)},${(bend * 0.42).toFixed(1)} ${(petiole + bladeLen * 0.85).toFixed(1)},${(bend * 0.82).toFixed(1)}`;
  const petioleD = `M 0,0 L ${(petiole + 0.8).toFixed(1)},0`;
  return { bladeD, midribD, petioleD };
}

/** Populates a cubic Bezier shoot with rich, direction-aware Olea europaea leaves and optional olive clusters */
function populateCubicTwig(opts: {
  pts: [Pt, Pt, Pt, Pt];
  nodes: number;
  leafScale: number;
  layer: 'back' | 'mid' | 'front';
  seed: number;
  withOlives?: boolean;
  strokeWidth?: number;
}): CanopyTwig {
  const { pts, nodes, leafScale, layer, seed, withOlives = false, strokeWidth } = opts;
  const [p0, p1, p2, p3] = pts;
  const rand = createRng(seed);
  const leaves: CanopyLeaf[] = [];
  const olives: CanopyOlive[] = [];

  for (let i = 0; i < nodes; i++) {
    const t = 0.08 + (i / Math.max(1, nodes - 1)) * 0.87;
    const pt = sampleCubic(p0, p1, p2, p3, t);
    const sizeTaper = 1 - t * 0.22;

    const angles = [
      pt.angle - (30 + rand() * 28),
      pt.angle + (30 + rand() * 28),
      ...(rand() > 0.42 ? [pt.angle + (rand() - 0.5) * 52] : []),
    ];

    angles.forEach((ang, aIdx) => {
      // Natural mix including foreshortened & narrow spear-like olive leaves
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
        angle: ang + (aIdx === 2 ? (rand() - 0.5) * 20 : 0),
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
        tilt: (rand() - 0.5) * 24,
        dark: rand() > 0.64,
      });
    }
  }

  // Apical shoot tip leaf
  const tip = sampleCubic(p0, p1, p2, p3, 1);
  leaves.push({
    x: tip.x,
    y: tip.y,
    angle: tip.angle + (rand() - 0.5) * 10,
    length: 24 * leafScale,
    width: 5.8 * leafScale,
    bend: (rand() - 0.5) * 2.5,
    tone: layer === 'back' ? 'olive' : 'sunlit',
  });

  const pathD = `M ${p0[0].toFixed(1)},${p0[1].toFixed(1)} C ${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)} ${p3[0].toFixed(1)},${p3[1].toFixed(1)}`;

  return {
    pathD,
    strokeWidth: strokeWidth ?? (layer === 'back' ? 1.85 : layer === 'mid' ? 1.4 : 1.1),
    strokeColor: layer === 'back' ? '#3C4430' : layer === 'mid' ? '#50523E' : '#63684E',
    leaves,
    olives,
  };
}

/**
 * Generates a corner-hugging + far-reaching multi-directional canopy composition:
 * - Top-left corner thoroughly filled via top-edge draping branches + left-edge climbing branches.
 * - Varied shoot lengths (short dense interior tufts -> medium fanning sprigs -> long 380–480px arching limbs).
 * - Varied directions (weeping down, climbing upward, S-curving diagonally, tucking back inward).
 */
function createCornerCanopyClusters(): WindBoughCluster[] {
  const clusters: WindBoughCluster[] = [];

  // ---------------------------------------------------------------------------
  // 1. BACK DENSE CORNER & MARGIN VOLUME (Fills top-left corner & inner depth)
  // ---------------------------------------------------------------------------
  const backDefs: Array<{
    id: string;
    pivot: Pt;
    limbs: Array<[Pt, Pt, Pt, Pt]>;
    twigs: Array<{ pts: [Pt, Pt, Pt, Pt]; nodes: number }>;
    seed: number;
    phase: number;
  }> = [
    {
      id: 'back-corner-crown',
      pivot: [36, -20],
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
      phase: 0.3,
    },
    {
      id: 'back-upper-wall',
      pivot: [-24, 245],
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
      phase: 1.5,
    },
    {
      id: 'back-mid-wall',
      pivot: [-24, 468],
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
      phase: 2.7,
    },
    {
      id: 'back-lower-wall',
      pivot: [-22, 695],
      limbs: [
        [[-22, 695], [38, 672], [94, 684], [138, 720]],
      ],
      twigs: [
        { pts: [[-10, 646], [46, 636], [96, 654], [138, 688]], nodes: 6 },
        { pts: [[8, 692], [62, 698], [108, 722], [142, 762]], nodes: 6 },
        { pts: [[-14, 746], [36, 764], [78, 796], [108, 842]], nodes: 6 },
      ],
      seed: 404,
      phase: 3.9,
    },
  ];

  backDefs.forEach((bd, idx) => {
    clusters.push({
      id: bd.id,
      layer: 'back',
      pivotX: bd.pivot[0],
      pivotY: bd.pivot[1],
      swayAmp: 0.72,
      windFreq: 0.66 + idx * 0.06,
      phase: bd.phase,
      scrollSensitivity: 0.25,
      woodPaths: bd.limbs.map((pts) => ({
        d: buildTaperedCubicBranch(pts, 4.0, 1.35),
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

  // ---------------------------------------------------------------------------
  // 2. MID-CANOPY MULTI-DIRECTIONAL BOUGHS (Draping corner, arching up, weeping down, curling back)
  // ---------------------------------------------------------------------------
  const midDefs: Array<{
    id: string;
    pivot: Pt;
    limbs: Array<[Pt, Pt, Pt, Pt]>;
    twigs: Array<{ pts: [Pt, Pt, Pt, Pt]; nodes: number; leafScale?: number }>;
    seed: number;
    phase: number;
    freq: number;
  }> = [
    // Top-border draping corner bough (hangs naturally straight down & right from header edge)
    {
      id: 'mid-top-drape',
      pivot: [168, -20],
      limbs: [[[168, -20], [186, 28], [228, 64], [294, 78]]],
      twigs: [
        { pts: [[176, 8], [186, 62], [202, 114], [228, 162]], nodes: 7 },
        { pts: [[204, 42], [244, 24], [292, 22], [352, 34]], nodes: 8 },
        { pts: [[228, 62], [278, 72], [326, 98], [364, 134]], nodes: 7 },
        // Short inward-tucking counter twig for wild realism
        { pts: [[182, 26], [148, 52], [116, 64], [86, 62]], nodes: 5, leafScale: 0.88 },
      ],
      seed: 511,
      phase: 0.7,
      freq: 0.94,
    },
    // Top-left deep corner cluster bridging corner diagonally
    {
      id: 'mid-corner-diag',
      pivot: [-16, 56],
      limbs: [[[-16, 56], [48, 38], [114, 52], [178, 92]]],
      twigs: [
        { pts: [[18, 46], [62, 12], [112, -2], [164, 4]], nodes: 6, leafScale: 0.9 },
        { pts: [[64, 44], [126, 48], [188, 76], [244, 122]], nodes: 8 },
        { pts: [[44, 46], [76, 98], [94, 152], [102, 208]], nodes: 7 },
      ],
      seed: 547,
      phase: 1.2,
      freq: 0.88,
    },
    // Upper-mid ascending + drooping split bough
    {
      id: 'mid-upper-split',
      pivot: [-18, 204],
      limbs: [[[-18, 204], [64, 178], [156, 174], [246, 198]]],
      twigs: [
        { pts: [[34, 188], [98, 144], [168, 118], [242, 108]], nodes: 8 },
        { pts: [[112, 172], [178, 182], [238, 212], [286, 256]], nodes: 8 },
        { pts: [[76, 178], [106, 224], [122, 268], [128, 308]], nodes: 6, leafScale: 0.9 },
        // Short crisp inward shoot
        { pts: [[148, 176], [134, 146], [112, 124], [86, 114]], nodes: 4, leafScale: 0.84 },
      ],
      seed: 612,
      phase: 2.0,
      freq: 0.9,
    },
    // Middle sweeping S-curve bough
    {
      id: 'mid-center-sweep',
      pivot: [-18, 354],
      limbs: [[[-18, 354], [64, 338], [152, 358], [232, 342]]],
      twigs: [
        { pts: [[40, 344], [102, 304], [168, 286], [236, 284]], nodes: 8 },
        { pts: [[98, 346], [164, 356], [228, 384], [282, 424]], nodes: 8 },
        { pts: [[56, 346], [88, 396], [104, 444], [112, 488]], nodes: 6, leafScale: 0.9 },
      ],
      seed: 713,
      phase: 3.1,
      freq: 0.86,
    },
    // Lower-mid weeping & upward counter-arch
    {
      id: 'mid-lower-arch',
      pivot: [-18, 514],
      limbs: [[[-18, 514], [58, 496], [134, 512], [202, 548]]],
      twigs: [
        { pts: [[34, 502], [92, 464], [154, 446], [218, 444]], nodes: 7 },
        { pts: [[84, 504], [142, 526], [192, 566], [228, 616]], nodes: 7 },
        { pts: [[48, 506], [72, 558], [84, 604], [86, 646]], nodes: 5, leafScale: 0.88 },
      ],
      seed: 814,
      phase: 4.3,
      freq: 0.92,
    },
    // Bottom cascading feather bough
    {
      id: 'mid-bottom-cascade',
      pivot: [-16, 686],
      limbs: [[[-16, 686], [48, 672], [108, 692], [158, 728]]],
      twigs: [
        { pts: [[26, 678], [76, 646], [128, 632], [182, 634]], nodes: 6 },
        { pts: [[68, 682], [116, 706], [154, 744], [178, 788]], nodes: 6 },
        { pts: [[28, 684], [48, 738], [58, 788], [60, 834]], nodes: 5, leafScale: 0.86 },
      ],
      seed: 915,
      phase: 5.2,
      freq: 0.84,
    },
  ];

  midDefs.forEach((md) => {
    clusters.push({
      id: md.id,
      layer: 'mid',
      pivotX: md.pivot[0],
      pivotY: md.pivot[1],
      swayAmp: 1.35,
      windFreq: md.freq,
      phase: md.phase,
      scrollSensitivity: 0.55,
      woodPaths: md.limbs.map((pts) => ({
        d: buildTaperedCubicBranch(pts, 3.1, 1.0),
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

  // ---------------------------------------------------------------------------
  // 3. FRONT VARIED-LENGTH SHOOTS (Short, medium & long expressive sky-reaching shoots in diverse angles)
  // ---------------------------------------------------------------------------
  const frontDefs: Array<{
    id: string;
    pivot: Pt;
    twigs: Array<{ pts: [Pt, Pt, Pt, Pt]; nodes: number; leafScale: number }>;
    seed: number;
    phase: number;
    freq: number;
    amp: number;
  }> = [
    // Long sweeping top-corner branch reaching across upper sky + hanging sub-twig
    {
      id: 'front-long-corner',
      pivot: [255, -14],
      twigs: [
        { pts: [[255, -14], [312, 22], [388, 32], [472, 16]], nodes: 10, leafScale: 0.92 },
        { pts: [[292, 12], [344, 46], [392, 88], [428, 138]], nodes: 7, leafScale: 0.88 },
        { pts: [[268, 2], [252, 48], [256, 94], [274, 134]], nodes: 5, leafScale: 0.84 },
      ],
      seed: 1111,
      phase: 0.9,
      freq: 1.24,
      amp: 2.35,
    },
    // Long dramatic S-curved upper shoot (stretches far to x=495) + upward fork
    {
      id: 'front-long-upper',
      pivot: [164, 118],
      twigs: [
        { pts: [[164, 118], [268, 146], [382, 124], [492, 86]], nodes: 11, leafScale: 0.94 },
        { pts: [[282, 138], [344, 168], [398, 206], [434, 252]], nodes: 7, leafScale: 0.86 },
        // Short playful upward sprig mid-branch
        { pts: [[224, 136], [242, 102], [268, 78], [296, 66]], nodes: 4, leafScale: 0.82 },
      ],
      seed: 1212,
      phase: 2.1,
      freq: 1.32,
      amp: 2.75,
    },
    // Expressive arching & drooping mid-upper shoot (x -> 455)
    {
      id: 'front-mid-reach',
      pivot: [152, 266],
      twigs: [
        { pts: [[152, 266], [248, 242], [354, 268], [452, 306]], nodes: 10, leafScale: 0.9 },
        { pts: [[262, 250], [324, 224], [386, 208], [438, 208]], nodes: 6, leafScale: 0.86 },
        { pts: [[202, 254], [218, 298], [224, 342], [218, 384]], nodes: 5, leafScale: 0.82 },
      ],
      seed: 1313,
      phase: 3.4,
      freq: 1.18,
      amp: 2.45,
    },
    // Medium-long graceful S-curve sweeping upward from middle canopy (x -> 395)
    {
      id: 'front-mid-upward',
      pivot: [138, 434],
      twigs: [
        { pts: [[138, 434], [218, 444], [308, 412], [392, 368]], nodes: 9, leafScale: 0.88 },
        { pts: [[228, 434], [286, 456], [336, 488], [372, 526]], nodes: 6, leafScale: 0.84 },
      ],
      seed: 1414,
      phase: 4.5,
      freq: 1.28,
      amp: 2.35,
    },
    // Short + medium-long weeping shoots on lower canopy (x -> 318 & weeping down)
    {
      id: 'front-lower-weep',
      pivot: [108, 594],
      twigs: [
        { pts: [[108, 594], [182, 578], [254, 592], [318, 622]], nodes: 7, leafScale: 0.86 },
        { pts: [[164, 584], [204, 548], [246, 522], [286, 512]], nodes: 5, leafScale: 0.82 },
        { pts: [[136, 588], [156, 636], [164, 686], [158, 734]], nodes: 5, leafScale: 0.8 },
      ],
      seed: 1515,
      phase: 5.4,
      freq: 1.16,
      amp: 2.1,
    },
    // Short delicate bottom-margin finishing tuft
    {
      id: 'front-bottom-tuft',
      pivot: [66, 756],
      twigs: [
        { pts: [[66, 756], [122, 744], [176, 758], [224, 788]], nodes: 5, leafScale: 0.82 },
        { pts: [[104, 748], [134, 718], [168, 698], [202, 692]], nodes: 4, leafScale: 0.78 },
      ],
      seed: 1616,
      phase: 1.6,
      freq: 1.12,
      amp: 1.85,
    },
  ];

  frontDefs.forEach((fd) => {
    clusters.push({
      id: fd.id,
      layer: 'front',
      pivotX: fd.pivot[0],
      pivotY: fd.pivot[1],
      swayAmp: fd.amp,
      windFreq: fd.freq,
      phase: fd.phase,
      scrollSensitivity: 0.95,
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

/**
 * Generates an organic, intentionally non-symmetrical right-side canopy composition:
 * - Coordinates live in viewBox [0..540, 0..900], anchored out of the top-right corner & right edge (x = 540+).
 * - Staggered vertical anchors, distinct branch lengths/angles, extra trailing low tendrils, and independent PRNG seeds
 *   ensure it complements the left canopy naturally without mirror symmetry.
 */
function createRightCornerCanopyClusters(): WindBoughCluster[] {
  const clusters: WindBoughCluster[] = [];

  // ---------------------------------------------------------------------------
  // 1. BACK DENSE TOP-RIGHT CORNER & RIGHT MARGIN VOLUME
  // ---------------------------------------------------------------------------
  const backDefs: Array<{
    id: string;
    pivot: Pt;
    limbs: Array<[Pt, Pt, Pt, Pt]>;
    twigs: Array<{ pts: [Pt, Pt, Pt, Pt]; nodes: number }>;
    seed: number;
    phase: number;
  }> = [
    {
      id: 'r-back-corner-crown',
      pivot: [498, -18],
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
      phase: 0.9,
    },
    {
      id: 'r-back-upper-wall',
      pivot: [564, 212],
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
      phase: 2.1,
    },
    {
      id: 'r-back-mid-wall',
      pivot: [564, 434],
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
      phase: 3.4,
    },
    {
      id: 'r-back-lower-wall',
      pivot: [562, 658],
      limbs: [
        [[562, 658], [498, 636], [442, 650], [396, 688]],
      ],
      twigs: [
        { pts: [[550, 612], [494, 602], [444, 622], [400, 658]], nodes: 6 },
        { pts: [[532, 658], [478, 666], [432, 692], [398, 732]], nodes: 6 },
        { pts: [[554, 718], [504, 736], [462, 768], [432, 814]], nodes: 6 },
      ],
      seed: 2404,
      phase: 4.6,
    },
  ];

  backDefs.forEach((bd, idx) => {
    clusters.push({
      id: bd.id,
      layer: 'back',
      pivotX: bd.pivot[0],
      pivotY: bd.pivot[1],
      swayAmp: 0.7,
      windFreq: 0.64 + idx * 0.065,
      phase: bd.phase,
      scrollSensitivity: 0.24,
      woodPaths: bd.limbs.map((pts) => ({
        d: buildTaperedCubicBranch(pts, 4.0, 1.35),
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

  // ---------------------------------------------------------------------------
  // 2. MID-CANOPY MULTI-DIRECTIONAL BOUGHS (Staggered heights vs left side)
  // ---------------------------------------------------------------------------
  const midDefs: Array<{
    id: string;
    pivot: Pt;
    limbs: Array<[Pt, Pt, Pt, Pt]>;
    twigs: Array<{ pts: [Pt, Pt, Pt, Pt]; nodes: number; leafScale?: number }>;
    seed: number;
    phase: number;
    freq: number;
  }> = [
    // Top-right header-edge draping bough (slightly wider sweep leftward)
    {
      id: 'r-mid-top-drape',
      pivot: [362, -20],
      limbs: [[[362, -20], [342, 26], [298, 58], [228, 72]]],
      twigs: [
        { pts: [[354, 8], [344, 58], [326, 108], [296, 152]], nodes: 7 },
        { pts: [[322, 40], [280, 22], [230, 18], [168, 28]], nodes: 8 },
        { pts: [[296, 58], [244, 68], [198, 94], [162, 130]], nodes: 7 },
        { pts: [[346, 24], [382, 48], [416, 62], [446, 58]], nodes: 5, leafScale: 0.86 },
      ],
      seed: 2511,
      phase: 1.4,
      freq: 0.91,
    },
    // Top-right corner bridge cluster
    {
      id: 'r-mid-corner-diag',
      pivot: [556, 72],
      limbs: [[[556, 72], [492, 54], [424, 72], [358, 114]]],
      twigs: [
        { pts: [[522, 62], [478, 26], [426, 10], [372, 14]], nodes: 6, leafScale: 0.9 },
        { pts: [[474, 62], [410, 66], [346, 94], [288, 138]], nodes: 8 },
        { pts: [[496, 64], [464, 118], [448, 174], [440, 232]], nodes: 7 },
      ],
      seed: 2547,
      phase: 1.9,
      freq: 0.87,
    },
    // Upper-mid split (anchored at y=252, offset from left side's y=204)
    {
      id: 'r-mid-upper-split',
      pivot: [558, 252],
      limbs: [[[558, 252], [476, 226], [384, 224], [294, 248]]],
      twigs: [
        { pts: [[506, 236], [442, 192], [372, 166], [298, 158]], nodes: 8 },
        { pts: [[428, 222], [362, 234], [302, 264], [254, 308]], nodes: 8 },
        { pts: [[464, 228], [434, 274], [418, 318], [412, 358]], nodes: 6, leafScale: 0.9 },
        { pts: [[392, 226], [406, 194], [428, 172], [454, 162]], nodes: 4, leafScale: 0.84 },
      ],
      seed: 2612,
      phase: 2.8,
      freq: 0.93,
    },
    // Center S-curve (anchored at y=402, offset from left side's y=354)
    {
      id: 'r-mid-center-sweep',
      pivot: [558, 402],
      limbs: [[[558, 402], [476, 386], [388, 406], [308, 388]]],
      twigs: [
        { pts: [[500, 392], [438, 352], [372, 334], [304, 332]], nodes: 8 },
        { pts: [[442, 394], [376, 406], [312, 434], [258, 474]], nodes: 8 },
        { pts: [[484, 394], [452, 444], [436, 492], [428, 536]], nodes: 6, leafScale: 0.88 },
      ],
      seed: 2713,
      phase: 3.9,
      freq: 0.85,
    },
    // Lower-mid weeping & counter-arch (anchored at y=558, offset from left side's y=514)
    {
      id: 'r-mid-lower-arch',
      pivot: [558, 558],
      limbs: [[[558, 558], [482, 540], [406, 556], [338, 592]]],
      twigs: [
        { pts: [[506, 546], [448, 508], [386, 490], [322, 488]], nodes: 7 },
        { pts: [[456, 548], [398, 570], [348, 610], [312, 660]], nodes: 7 },
        { pts: [[492, 550], [468, 602], [456, 648], [454, 690]], nodes: 5, leafScale: 0.88 },
      ],
      seed: 2814,
      phase: 5.0,
      freq: 0.9,
    },
    // Bottom cascading feather bough
    {
      id: 'r-mid-bottom-cascade',
      pivot: [556, 722],
      limbs: [[[556, 722], [492, 708], [432, 728], [382, 764]]],
      twigs: [
        { pts: [[514, 714], [464, 682], [412, 668], [358, 670]], nodes: 6 },
        { pts: [[472, 718], [424, 742], [386, 780], [362, 824]], nodes: 6 },
        { pts: [[512, 720], [492, 774], [482, 824], [480, 868]], nodes: 5, leafScale: 0.84 },
      ],
      seed: 2915,
      phase: 0.5,
      freq: 0.83,
    },
  ];

  midDefs.forEach((md) => {
    clusters.push({
      id: md.id,
      layer: 'mid',
      pivotX: md.pivot[0],
      pivotY: md.pivot[1],
      swayAmp: 1.32,
      windFreq: md.freq,
      phase: md.phase,
      scrollSensitivity: 0.52,
      woodPaths: md.limbs.map((pts) => ({
        d: buildTaperedCubicBranch(pts, 3.1, 1.0),
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

  // ---------------------------------------------------------------------------
  // 3. FRONT EXPRESSIVE ASYMMETRIC SHOOTS (Varied lengths & non-mirrored reaches)
  // ---------------------------------------------------------------------------
  const frontDefs: Array<{
    id: string;
    pivot: Pt;
    twigs: Array<{ pts: [Pt, Pt, Pt, Pt]; nodes: number; leafScale: number }>;
    seed: number;
    phase: number;
    freq: number;
    amp: number;
  }> = [
    // Medium-long top-right corner shoot (shorter than left's 472px reach for asymmetry)
    {
      id: 'r-front-corner-tuft',
      pivot: [298, -14],
      twigs: [
        { pts: [[298, -14], [244, 24], [174, 36], [102, 22]], nodes: 9, leafScale: 0.9 },
        { pts: [[258, 14], [208, 48], [162, 90], [128, 138]], nodes: 6, leafScale: 0.85 },
        { pts: [[282, 4], [296, 48], [292, 92], [274, 130]], nodes: 5, leafScale: 0.82 },
      ],
      seed: 3111,
      phase: 1.5,
      freq: 1.21,
      amp: 2.25,
    },
    // Upper curving shoot reaching leftward with playful downward pendant
    {
      id: 'r-front-upper-reach',
      pivot: [378, 148],
      twigs: [
        { pts: [[378, 148], [282, 174], [174, 154], [76, 118]], nodes: 10, leafScale: 0.92 },
        { pts: [[268, 166], [206, 198], [154, 236], [118, 282]], nodes: 7, leafScale: 0.86 },
        { pts: [[322, 162], [306, 128], [282, 102], [254, 88]], nodes: 4, leafScale: 0.8 },
      ],
      seed: 3212,
      phase: 2.6,
      freq: 1.3,
      amp: 2.6,
    },
    // Signature extra-long expressive S-curved mid-bough (longest shoot on right side, reaching x=44)
    {
      id: 'r-front-mid-sweep',
      pivot: [392, 312],
      twigs: [
        { pts: [[392, 312], [292, 288], [172, 316], [56, 356]], nodes: 11, leafScale: 0.93 },
        { pts: [[284, 298], [220, 272], [158, 256], [104, 258]], nodes: 7, leafScale: 0.86 },
        { pts: [[342, 302], [326, 348], [318, 394], [324, 438]], nodes: 5, leafScale: 0.82 },
      ],
      seed: 3313,
      phase: 3.8,
      freq: 1.24,
      amp: 2.7,
    },
    // Graceful upward-arching mid-lower shoot
    {
      id: 'r-front-lower-arch',
      pivot: [406, 482],
      twigs: [
        { pts: [[406, 482], [328, 492], [238, 458], [154, 414]], nodes: 9, leafScale: 0.88 },
        { pts: [[318, 482], [260, 504], [210, 536], [174, 576]], nodes: 6, leafScale: 0.84 },
      ],
      seed: 3414,
      phase: 4.9,
      freq: 1.26,
      amp: 2.3,
    },
    // Longer lower-margin weeping bough (extends lower than left side's lower tuft for natural balance)
    {
      id: 'r-front-lower-weep',
      pivot: [436, 636],
      twigs: [
        { pts: [[436, 636], [358, 620], [280, 634], [208, 668]], nodes: 8, leafScale: 0.87 },
        { pts: [[378, 626], [336, 590], [292, 566], [248, 558]], nodes: 5, leafScale: 0.82 },
        { pts: [[406, 630], [386, 682], [376, 734], [382, 784]], nodes: 6, leafScale: 0.82 },
      ],
      seed: 3515,
      phase: 0.8,
      freq: 1.15,
      amp: 2.15,
    },
    // Delicate bottom-right finishing sprig
    {
      id: 'r-front-bottom-tuft',
      pivot: [478, 788],
      twigs: [
        { pts: [[478, 788], [422, 774], [368, 788], [322, 818]], nodes: 5, leafScale: 0.8 },
        { pts: [[440, 778], [410, 748], [376, 728], [344, 722]], nodes: 4, leafScale: 0.78 },
      ],
      seed: 3616,
      phase: 2.2,
      freq: 1.1,
      amp: 1.8,
    },
  ];

  frontDefs.forEach((fd) => {
    clusters.push({
      id: fd.id,
      layer: 'front',
      pivotX: fd.pivot[0],
      pivotY: fd.pivot[1],
      swayAmp: fd.amp,
      windFreq: fd.freq,
      phase: fd.phase,
      scrollSensitivity: 0.92,
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

interface CanopyLayerSvgProps {
  idPrefix: 'left' | 'right';
  clusters: WindBoughCluster[];
  className: string;
  preserveAspectRatio: string;
}

const CanopyLayerSvg: React.FC<CanopyLayerSvgProps> = ({
  idPrefix,
  clusters,
  className,
  preserveAspectRatio,
}) => {
  const leafShadowId = `${idPrefix}-canopy-leaf-shadow`;
  const leafOliveId = `${idPrefix}-canopy-leaf-olive`;
  const leafSunlitId = `${idPrefix}-canopy-leaf-sunlit`;
  const leafSilverId = `${idPrefix}-canopy-leaf-silver`;
  const oliveGreenId = `${idPrefix}-canopy-olive-green`;
  const oliveDarkId = `${idPrefix}-canopy-olive-dark`;

  return (
    <svg
      className={className}
      viewBox="0 0 540 900"
      preserveAspectRatio={preserveAspectRatio}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={leafShadowId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D3B23" />
          <stop offset="100%" stopColor="#3F5031" />
        </linearGradient>
        <linearGradient id={leafOliveId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#485B36" />
          <stop offset="60%" stopColor="#586D41" />
          <stop offset="100%" stopColor="#697F4E" />
        </linearGradient>
        <linearGradient id={leafSunlitId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#697D44" />
          <stop offset="55%" stopColor="#7E9252" />
          <stop offset="100%" stopColor="#94A765" />
        </linearGradient>
        <linearGradient id={leafSilverId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8A997E" />
          <stop offset="58%" stopColor="#A2B097" />
          <stop offset="100%" stopColor="#B8C4AE" />
        </linearGradient>
        <radialGradient id={oliveGreenId} cx="35%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#9AB060" />
          <stop offset="58%" stopColor="#6D833F" />
          <stop offset="100%" stopColor="#4A5B2A" />
        </radialGradient>
        <radialGradient id={oliveDarkId} cx="35%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#726958" />
          <stop offset="58%" stopColor="#4B4438" />
          <stop offset="100%" stopColor="#2F2B23" />
        </radialGradient>
      </defs>

      {clusters.map((cluster) => (
        <g key={cluster.id} opacity={cluster.clusterOpacity}>
          <g
            className="js-canopy-wind"
            data-side={idPrefix}
            data-pivot-x={cluster.pivotX}
            data-pivot-y={cluster.pivotY}
            data-sway-amp={cluster.swayAmp}
            data-wind-freq={cluster.windFreq}
            data-phase={cluster.phase}
            data-scroll-sens={cluster.scrollSensitivity}
          >
            {cluster.woodPaths.map((wp, wIdx) => (
              <path key={`${cluster.id}-wood-${wIdx}`} d={wp.d} fill={wp.color} />
            ))}

            {cluster.twigs.map((twig, twIdx) => (
              <g key={`${cluster.id}-tw-${twIdx}`}>
                <path
                  d={twig.pathD}
                  fill="none"
                  stroke={twig.strokeColor}
                  strokeWidth={twig.strokeWidth}
                  strokeLinecap="round"
                />

                {/* Deep interior shadow leaves */}
                {twig.leaves
                  .filter((l) => l.tone === 'shadow')
                  .map((l, lIdx) => {
                    const { bladeD, petioleD } = buildSlenderOliveLeafD(l.length, l.width, l.bend);
                    return (
                      <g
                        key={`${cluster.id}-${twIdx}-sh-${lIdx}`}
                        transform={`translate(${l.x.toFixed(1)}, ${l.y.toFixed(1)}) rotate(${l.angle.toFixed(1)})`}
                      >
                        <path
                          d={petioleD}
                          fill="none"
                          stroke="#3F4732"
                          strokeWidth="0.9"
                          strokeLinecap="round"
                        />
                        <path d={bladeD} fill={`url(#${leafShadowId})`} />
                      </g>
                    );
                  })}

                {/* Silvery-sage undersides */}
                {twig.leaves
                  .filter((l) => l.tone === 'silver')
                  .map((l, lIdx) => {
                    const { bladeD, midribD, petioleD } = buildSlenderOliveLeafD(
                      l.length,
                      l.width,
                      l.bend
                    );
                    return (
                      <g
                        key={`${cluster.id}-${twIdx}-sv-${lIdx}`}
                        transform={`translate(${l.x.toFixed(1)}, ${l.y.toFixed(1)}) rotate(${l.angle.toFixed(1)})`}
                      >
                        <path
                          d={petioleD}
                          fill="none"
                          stroke="#636C54"
                          strokeWidth="0.9"
                          strokeLinecap="round"
                        />
                        <path d={bladeD} fill={`url(#${leafSilverId})`} />
                        <path
                          d={midribD}
                          fill="none"
                          stroke="#7C8C6F"
                          strokeWidth="0.65"
                          strokeLinecap="round"
                          opacity="0.65"
                        />
                      </g>
                    );
                  })}

                {/* Rich Istrian olive greens */}
                {twig.leaves
                  .filter((l) => l.tone === 'olive')
                  .map((l, lIdx) => {
                    const { bladeD, midribD, petioleD } = buildSlenderOliveLeafD(
                      l.length,
                      l.width,
                      l.bend
                    );
                    return (
                      <g
                        key={`${cluster.id}-${twIdx}-ol-${lIdx}`}
                        transform={`translate(${l.x.toFixed(1)}, ${l.y.toFixed(1)}) rotate(${l.angle.toFixed(1)})`}
                      >
                        <path
                          d={petioleD}
                          fill="none"
                          stroke="#525B3E"
                          strokeWidth="0.9"
                          strokeLinecap="round"
                        />
                        <path d={bladeD} fill={`url(#${leafOliveId})`} />
                        <path
                          d={midribD}
                          fill="none"
                          stroke="#98AA83"
                          strokeWidth="0.65"
                          strokeLinecap="round"
                          opacity="0.7"
                        />
                      </g>
                    );
                  })}

                {/* Sunlit outer leaf highlights */}
                {twig.leaves
                  .filter((l) => l.tone === 'sunlit')
                  .map((l, lIdx) => {
                    const { bladeD, midribD, petioleD } = buildSlenderOliveLeafD(
                      l.length,
                      l.width,
                      l.bend
                    );
                    return (
                      <g
                        key={`${cluster.id}-${twIdx}-sn-${lIdx}`}
                        transform={`translate(${l.x.toFixed(1)}, ${l.y.toFixed(1)}) rotate(${l.angle.toFixed(1)})`}
                      >
                        <path
                          d={petioleD}
                          fill="none"
                          stroke="#667349"
                          strokeWidth="0.9"
                          strokeLinecap="round"
                        />
                        <path d={bladeD} fill={`url(#${leafSunlitId})`} />
                        <path
                          d={midribD}
                          fill="none"
                          stroke="#C4D3A4"
                          strokeWidth="0.7"
                          strokeLinecap="round"
                          opacity="0.75"
                        />
                      </g>
                    );
                  })}

                {/* Subtle olives tucked inside foliage */}
                {twig.olives.map((ov, oIdx) => (
                  <g key={`${cluster.id}-${twIdx}-ov-${oIdx}`}>
                    <path
                      d={`M ${ov.x.toFixed(1)},${ov.y.toFixed(1)} L ${(ov.x + ov.stemDx).toFixed(1)},${(ov.y + ov.stemDy * 0.7).toFixed(1)}`}
                      fill="none"
                      stroke="#5A6345"
                      strokeWidth="0.95"
                      strokeLinecap="round"
                    />
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="3.8"
                      ry="5.7"
                      transform={`translate(${(ov.x + ov.stemDx).toFixed(1)}, ${(ov.y + ov.stemDy).toFixed(1)}) rotate(${ov.tilt})`}
                      fill={ov.dark ? `url(#${oliveDarkId})` : `url(#${oliveGreenId})`}
                    />
                  </g>
                ))}
              </g>
            ))}
          </g>
        </g>
      ))}
    </svg>
  );
};

export const OliveBranchScrollBg: React.FC<OliveBranchScrollBgProps> = ({ heroRef }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftClusters = useMemo(() => createCornerCanopyClusters(), []);
  const rightClusters = useMemo(() => createRightCornerCanopyClusters(), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const boughNodes = Array.from(container.querySelectorAll<SVGGElement>('.js-canopy-wind'));
    if (prefersReducedMotion || boughNodes.length === 0) return;

    let rafId = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let smoothedGust = 0;
    let lastTime = performance.now();

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      lastScrollY = currentY;
      scrollVelocity = Math.max(-24, Math.min(24, scrollVelocity + delta * 0.085));
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const t = now / 1000;

      scrollVelocity *= Math.pow(0.08, dt);
      smoothedGust += (scrollVelocity - smoothedGust) * Math.min(1, dt * 6);

      const heroEl = heroRef.current;
      const heroBottom = heroEl ? heroEl.offsetTop + heroEl.offsetHeight : window.innerHeight;
      const scrollDepthRatio = Math.max(
        0,
        Math.min(1, (window.scrollY - Math.max(0, heroBottom - window.innerHeight)) / 2400)
      );

      for (let i = 0; i < boughNodes.length; i++) {
        const node = boughNodes[i];
        const isRight = node.dataset.side === 'right';
        const pivotX = Number(node.dataset.pivotX ?? 0);
        const pivotY = Number(node.dataset.pivotY ?? 0);
        const amp = Number(node.dataset.swayAmp ?? 1.2);
        const freq = Number(node.dataset.windFreq ?? 1);
        const phase = Number(node.dataset.phase ?? 0);
        const sens = Number(node.dataset.scrollSens ?? 0.5);

        // Gentle breeze sweep offset between left & right sides so both canopies never move identically
        const breezeTime = isRight ? t - 0.55 : t;
        const primarySway = Math.sin(breezeTime * freq + phase);
        const harmonicFlutter = 0.42 * Math.sin(breezeTime * freq * 1.73 + phase * 1.37);
        const microRustle = 0.18 * Math.sin(breezeTime * freq * 2.91 + phase * 2.1);

        const gustSign = isRight ? -0.15 : 0.18;
        const angle =
          (primarySway + harmonicFlutter + microRustle) * amp +
          smoothedGust * gustSign * sens +
          Math.sin(scrollDepthRatio * Math.PI * 1.5 + phase) * 0.65 * sens;

        const translateY = (primarySway * 1.35 + harmonicFlutter * 0.65) * sens;

        node.setAttribute(
          'transform',
          `translate(${pivotX} ${(pivotY + translateY).toFixed(2)}) rotate(${angle.toFixed(2)}) translate(${-pivotX} ${-pivotY})`
        );
      }

      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, [heroRef]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5]"
    >
      {/* Anchored flush beneath the sticky header so both canopies fill the upper corners */}
      <div className="sticky top-[60px] sm:top-[68px] lg:top-[76px] h-[calc(100vh-60px)] sm:h-[calc(100vh-68px)] lg:h-[calc(100vh-76px)] w-full overflow-hidden">
        <CanopyLayerSvg
          idPrefix="left"
          clusters={leftClusters}
          preserveAspectRatio="xMinYMin slice"
          className="absolute left-0 top-0 h-[420px] sm:h-[580px] md:h-full w-[138px] sm:w-[235px] md:w-[420px] lg:w-[485px] xl:w-[545px] 2xl:w-[585px] opacity-[0.34] sm:opacity-[0.54] md:opacity-[0.80] lg:opacity-[0.90] xl:opacity-[0.96] [mask-image:linear-gradient(to_right,black_0%,black_55%,rgba(0,0,0,0.4)_82%,transparent_100%)] md:[mask-image:linear-gradient(to_right,black_0%,black_84%,rgba(0,0,0,0.65)_94%,transparent_100%)]"
        />
        <CanopyLayerSvg
          idPrefix="right"
          clusters={rightClusters}
          preserveAspectRatio="xMaxYMin slice"
          className="absolute right-0 top-0 h-[420px] sm:h-[580px] md:h-full w-[132px] sm:w-[225px] md:w-[408px] lg:w-[475px] xl:w-[532px] 2xl:w-[572px] opacity-[0.32] sm:opacity-[0.52] md:opacity-[0.78] lg:opacity-[0.88] xl:opacity-[0.95] [mask-image:linear-gradient(to_left,black_0%,black_55%,rgba(0,0,0,0.4)_82%,transparent_100%)] md:[mask-image:linear-gradient(to_left,black_0%,black_84%,rgba(0,0,0,0.65)_94%,transparent_100%)]"
        />
      </div>
    </div>
  );
};
