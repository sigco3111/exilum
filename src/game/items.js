// EXILIUM — item generation: base types, implicits, rarity, naming, tooltip data.
// Owner: LootSystem. Pure data + generation; no THREE, no side effects.
// PoE's identity is its loot: the base, the roll, the colour, the name.

import { rollAffixes, UNIQUE_MODS } from './affixes.js';

// ---------------------------------------------------------------------------
// Rarity — EXACT PoE colour coding (hex ints for THREE, css strings for DOM).
// ---------------------------------------------------------------------------
export const RARITY = {
  normal: { key: 'normal', hex: 0xc8c8c8, css: '#c8c8c8', maxPrefix: 0, maxSuffix: 0 },
  magic:  { key: 'magic',  hex: 0x8888ff, css: '#8888ff', maxPrefix: 1, maxSuffix: 1 },
  rare:   { key: 'rare',   hex: 0xffff77, css: '#ffff77', maxPrefix: 3, maxSuffix: 3 },
  unique: { key: 'unique', hex: 0xaf6025, css: '#af6025', maxPrefix: 0, maxSuffix: 0 },
};
export const CURRENCY = { key: 'currency', hex: 0xaa9e82, css: '#aa9e82' };
export const GEM = { key: 'gem', hex: 0x1ba29b, css: '#1ba29b' };

export function rarityColor(rarityKey) {
  if (rarityKey === 'currency') return CURRENCY.hex;
  if (rarityKey === 'gem') return GEM.hex;
  return (RARITY[rarityKey] || RARITY.normal).hex;
}
export function rarityCss(rarityKey) {
  if (rarityKey === 'currency') return CURRENCY.css;
  if (rarityKey === 'gem') return GEM.css;
  return (RARITY[rarityKey] || RARITY.normal).css;
}

// ---------------------------------------------------------------------------
// Small deterministic helpers.
// ---------------------------------------------------------------------------
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const rf = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];
function weightedPick(list, weightOf) {
  let total = 0;
  for (const it of list) total += weightOf(it);
  if (total <= 0) return null;
  let r = Math.random() * total;
  for (const it of list) { r -= weightOf(it); if (r <= 0) return it; }
  return list[list.length - 1];
}

// ---------------------------------------------------------------------------
// Base types. Each: key, name, slot, grid w/h, level/attr requirements, tags
// (drive affix pools), a base-stat block, and a rolled implicit.
// slot ∈ weapon | offhand | helm | body | gloves | boots | belt | amulet | ring | flask | currency
// ---------------------------------------------------------------------------
export const BASES = [
  // ---- one-hand weapons ---------------------------------------------------
  { key: 'rustedSword', name: '녹슨 검', slot: 'weapon', hand: 1, w: 2, h: 3, req: { level: 1, str: 8, dex: 8, int: 0 },
    tags: ['weapon', 'melee', 'sword'], weapon: { physMin: 5, physMax: 11, crit: 5, aps: 1.55 } },
  { key: 'glintDagger', name: '반짝이는 단검', slot: 'weapon', hand: 1, w: 1, h: 3, req: { level: 1, str: 0, dex: 9, int: 6 },
    tags: ['weapon', 'melee', 'dagger'], weapon: { physMin: 3, physMax: 12, crit: 6.5, aps: 1.6 } },
  { key: 'stoneHammer', name: '돌 망치', slot: 'weapon', hand: 1, w: 2, h: 3, req: { level: 3, str: 14, dex: 0, int: 0 },
    tags: ['weapon', 'melee', 'mace'], weapon: { physMin: 9, physMax: 16, crit: 5, aps: 1.25 } },
  { key: 'driftwoodWand', name: '유목 지팡이', slot: 'weapon', hand: 1, w: 1, h: 3, req: { level: 1, str: 0, dex: 0, int: 12 },
    tags: ['weapon', 'caster', 'wand'], weapon: { physMin: 3, physMax: 7, crit: 7, aps: 1.4 } },
  { key: 'drearySceptre', name: '칙칙한 홀', slot: 'weapon', hand: 1, w: 2, h: 3, req: { level: 3, str: 10, dex: 0, int: 10 },
    tags: ['weapon', 'caster', 'sceptre', 'melee'], weapon: { physMin: 6, physMax: 13, crit: 6, aps: 1.4 } },

  // ---- two-hand weapons ---------------------------------------------------
  { key: 'corrodedBlade', name: '부식된 장검', slot: 'weapon', hand: 2, w: 2, h: 4, req: { level: 5, str: 17, dex: 17, int: 0 },
    tags: ['weapon', 'melee', 'sword', 'twohand'], weapon: { physMin: 12, physMax: 22, crit: 5, aps: 1.45 } },
  { key: 'stoneAxe', name: '돌 도끼', slot: 'weapon', hand: 2, w: 2, h: 4, req: { level: 6, str: 21, dex: 9, int: 0 },
    tags: ['weapon', 'melee', 'axe', 'twohand'], weapon: { physMin: 16, physMax: 26, crit: 5, aps: 1.3 } },
  { key: 'gnarledBranch', name: '옹이진 가지', slot: 'weapon', hand: 2, w: 2, h: 4, req: { level: 1, str: 14, dex: 0, int: 14 },
    tags: ['weapon', 'caster', 'staff', 'twohand'], weapon: { physMin: 10, physMax: 20, crit: 6.5, aps: 1.3 } },
  { key: 'crudeBow', name: '조잡한 활', slot: 'weapon', hand: 2, w: 2, h: 4, req: { level: 1, str: 0, dex: 14, int: 0 },
    tags: ['weapon', 'bow', 'twohand'], weapon: { physMin: 6, physMax: 14, crit: 6, aps: 1.4 } },

  // ---- body armour --------------------------------------------------------
  { key: 'plateVest', name: '판금 조끼', slot: 'body', w: 2, h: 3, req: { level: 1, str: 12, dex: 0, int: 0 },
    tags: ['armour', 'body', 'ar'], def: { type: 'ar', base: 34 } },
  { key: 'shabbyJerkin', name: '낡은 가죽조끼', slot: 'body', w: 2, h: 3, req: { level: 1, str: 0, dex: 12, int: 0 },
    tags: ['armour', 'body', 'ev'], def: { type: 'ev', base: 34 } },
  { key: 'simpleRobe', name: '소박한 로브', slot: 'body', w: 2, h: 3, req: { level: 1, str: 0, dex: 0, int: 12 },
    tags: ['armour', 'body', 'es'], def: { type: 'es', base: 14 } },

  // ---- helm ---------------------------------------------------------------
  { key: 'ironHat', name: '철 모자', slot: 'helm', w: 2, h: 2, req: { level: 1, str: 8, dex: 0, int: 0 },
    tags: ['armour', 'helm', 'ar'], def: { type: 'ar', base: 15 } },
  { key: 'leatherCap', name: '가죽 모자', slot: 'helm', w: 2, h: 2, req: { level: 1, str: 0, dex: 8, int: 0 },
    tags: ['armour', 'helm', 'ev'], def: { type: 'ev', base: 15 } },
  { key: 'vineCirclet', name: '덩굴 관', slot: 'helm', w: 2, h: 2, req: { level: 1, str: 0, dex: 0, int: 8 },
    tags: ['armour', 'helm', 'es'], def: { type: 'es', base: 7 } },

  // ---- gloves -------------------------------------------------------------
  { key: 'ironGauntlets', name: '철 건틀릿', slot: 'gloves', w: 2, h: 2, req: { level: 1, str: 8, dex: 0, int: 0 },
    tags: ['armour', 'gloves', 'ar'], def: { type: 'ar', base: 12 } },
  { key: 'rawhideGloves', name: '생가죽 장갑', slot: 'gloves', w: 2, h: 2, req: { level: 1, str: 0, dex: 8, int: 0 },
    tags: ['armour', 'gloves', 'ev'], def: { type: 'ev', base: 12 } },
  { key: 'woolGloves', name: '양모 장갑', slot: 'gloves', w: 2, h: 2, req: { level: 1, str: 0, dex: 0, int: 8 },
    tags: ['armour', 'gloves', 'es'], def: { type: 'es', base: 5 } },

  // ---- boots --------------------------------------------------------------
  { key: 'ironGreaves', name: '철 경갑', slot: 'boots', w: 2, h: 2, req: { level: 1, str: 8, dex: 0, int: 0 },
    tags: ['armour', 'boots', 'ar'], def: { type: 'ar', base: 12 } },
  { key: 'rawhideBoots', name: '생가죽 장화', slot: 'boots', w: 2, h: 2, req: { level: 1, str: 0, dex: 8, int: 0 },
    tags: ['armour', 'boots', 'ev'], def: { type: 'ev', base: 12 } },
  { key: 'woolShoes', name: '양모 신발', slot: 'boots', w: 2, h: 2, req: { level: 1, str: 0, dex: 0, int: 8 },
    tags: ['armour', 'boots', 'es'], def: { type: 'es', base: 5 } },

  // ---- belt ---------------------------------------------------------------
  { key: 'leatherBelt', name: '가죽 허리띠', slot: 'belt', w: 2, h: 1, req: { level: 1, str: 0, dex: 0, int: 0 },
    tags: ['belt'], implicitMod: { render: (v) => `최대 생명력 +${v[0]}`, rolls: [[20, 30]] } },
  { key: 'heavyBelt', name: '묵직한 허리띠', slot: 'belt', w: 2, h: 1, req: { level: 8, str: 0, dex: 0, int: 0 },
    tags: ['belt'], implicitMod: { render: (v) => `힘 +${v[0]}`, rolls: [[15, 25]] } },
  { key: 'chainBelt', name: '사슬 허리띠', slot: 'belt', w: 2, h: 1, req: { level: 4, str: 0, dex: 0, int: 0 },
    tags: ['belt'], implicitMod: { render: (v) => `기절 및 방어 회복 ${v[0]}% 증가`, rolls: [[10, 16]] } },

  // ---- rings --------------------------------------------------------------
  { key: 'ironRing', name: '철 반지', slot: 'ring', w: 1, h: 1, req: { level: 1, str: 0, dex: 0, int: 0 },
    tags: ['ring', 'jewelry'], implicitMod: { render: (v) => `공격에 물리 피해 ${v[0]}~${v[1]} 추가`, rolls: [[1, 2], [3, 5]] } },
  { key: 'coralRing', name: '산호 반지', slot: 'ring', w: 1, h: 1, req: { level: 1, str: 0, dex: 0, int: 0 },
    tags: ['ring', 'jewelry'], implicitMod: { render: (v) => `최대 생명력 +${v[0]}`, rolls: [[20, 30]] } },
  { key: 'pauaRing', name: '전복 반지', slot: 'ring', w: 1, h: 1, req: { level: 1, str: 0, dex: 0, int: 0 },
    tags: ['ring', 'jewelry'], implicitMod: { render: (v) => `최대 마나 +${v[0]}`, rolls: [[20, 30]] } },
  { key: 'goldRing', name: '금 반지', slot: 'ring', w: 1, h: 1, req: { level: 20, str: 0, dex: 0, int: 0 },
    tags: ['ring', 'jewelry'], implicitMod: { render: (v) => `발견 아이템 희귀도 ${v[0]}% 증가`, rolls: [[4, 8]] } },

  // ---- amulet -------------------------------------------------------------
  { key: 'coralAmulet', name: '산호 부적', slot: 'amulet', w: 1, h: 1, req: { level: 1, str: 0, dex: 0, int: 0 },
    tags: ['amulet', 'jewelry'], implicitMod: { render: (v) => `초당 생명력 ${v[0]} 재생`, rolls: [[2, 4]] } },
  { key: 'jadeAmulet', name: '비취 부적', slot: 'amulet', w: 1, h: 1, req: { level: 1, str: 0, dex: 0, int: 0 },
    tags: ['amulet', 'jewelry'], implicitMod: { render: (v) => `민첩 +${v[0]}`, rolls: [[20, 30]] } },
  { key: 'lapisAmulet', name: '청금석 부적', slot: 'amulet', w: 1, h: 1, req: { level: 1, str: 0, dex: 0, int: 0 },
    tags: ['amulet', 'jewelry'], implicitMod: { render: (v) => `지능 +${v[0]}`, rolls: [[20, 30]] } },

  // ---- flasks -------------------------------------------------------------
  { key: 'lifeFlask', name: '생명력 플라스크', slot: 'flask', w: 1, h: 2, req: { level: 1, str: 0, dex: 0, int: 0 },
    tags: ['flask', 'lifeflask'], flask: { restore: 'life', amount: 70, duration: 6 },
    implicitMod: { render: (v) => `Recovers ${v[0]} Life over 6.00 seconds`, rolls: [[70, 70]] } },
  { key: 'manaFlask', name: '마나 플라스크', slot: 'flask', w: 1, h: 2, req: { level: 1, str: 0, dex: 0, int: 0 },
    tags: ['flask', 'manaflask'], flask: { restore: 'mana', amount: 50, duration: 5 },
    implicitMod: { render: (v) => `Recovers ${v[0]} Mana over 5.00 seconds`, rolls: [[50, 50]] } },
  { key: 'quicksilverFlask', name: '수은 플라스크', slot: 'flask', w: 1, h: 2, req: { level: 4, str: 0, dex: 0, int: 0 },
    tags: ['flask', 'utilityflask'], flask: { restore: 'speed', amount: 40, duration: 4 },
    implicitMod: { render: (v) => `이동 속도 ${v[0]}% 증가`, rolls: [[40, 40]] } },
];
export const BASE_BY_KEY = new Map(BASES.map((b) => [b.key, b]));
const EQUIP_BASES = BASES.filter((b) => b.slot !== 'flask' && b.slot !== 'currency');

// ---------------------------------------------------------------------------
// Currency — weighted drop table. Common orbs frequent, mirror vanishingly rare.
// ---------------------------------------------------------------------------
export const CURRENCIES = [
  { key: 'scroll',      name: '지혜의 주문서',    weight: 320, maxStack: 40, tint: 0x8a7f66, desc: '아이템을 감정합니다.' },
  { key: 'portal',      name: '차원문 주문서',       weight: 160, maxStack: 40, tint: 0x7f8ea3, desc: '마을로 가는 차원문을 엽니다.' },
  { key: 'transmute',   name: '변환의 오브', weight: 150, maxStack: 40, tint: 0x9aa0b4, desc: '일반 아이템을 마법 아이템으로 올립니다.' },
  { key: 'augment',     name: '증강의 오브', weight: 120, maxStack: 30, tint: 0x8fa2c4, desc: '마법 아이템에 속성을 추가합니다.' },
  { key: 'alteration',  name: '변경의 오브',   weight: 110, maxStack: 20, tint: 0x6c8fc0, desc: '마법 아이템의 속성을 다시 굴립니다.' },
  { key: 'chromatic',   name: '채색의 오브',       weight: 95,  maxStack: 20, tint: 0xb08fc0, desc: '소켓의 색을 재구성합니다.' },
  { key: 'fusing',      name: '융합의 오브',       weight: 80,  maxStack: 20, tint: 0xc08a5a, desc: '소켓 간 연결을 재구성합니다.' },
  { key: 'alchemy',     name: '연금술의 오브',      weight: 55,  maxStack: 10, tint: 0xd0c060, desc: '일반 아이템을 희귀 아이템으로 올립니다.' },
  { key: 'chance',      name: '기회의 오브',       weight: 60,  maxStack: 20, tint: 0xc7b878, desc: 'Upgrades a normal item to a random rarity.' },
  { key: 'regal',       name: '제왕의 오브',           weight: 22,  maxStack: 10, tint: 0xd8b0e0, desc: 'Upgrades a magic item to rare.' },
  { key: 'chaos',       name: '혼돈의 오브',           weight: 30,  maxStack: 10, tint: 0xc0a0d8, desc: '희귀 아이템의 속성을 새로 재구성합니다.' },
  { key: 'vaal',        name: '발의 오브',            weight: 16,  maxStack: 10, tint: 0xd05050, desc: '아이템을 예측 불가능하게 타락시킵니다.' },
  { key: 'exalted',     name: '엑잘티드 오브',         weight: 4,   maxStack: 10, tint: 0xe0c060, desc: '희귀 아이템에 새 속성을 추가합니다.' },
  { key: 'divine',      name: '신성한 오브',          weight: 2,   maxStack: 10, tint: 0xf0e0a0, desc: '속성의 수치를 다시 굴립니다.' },
  { key: 'mirror',      name: '칼란드라의 거울',  weight: 0.06, maxStack: 5, tint: 0xd8f0ff, desc: '아이템의 복제본을 만듭니다.' },
];
const CUR_BY_KEY = new Map(CURRENCIES.map((c) => [c.key, c]));

// ---------------------------------------------------------------------------
// Uniques — fixed base + fixed mods + fixed name (the "always the same" thrill).
// ---------------------------------------------------------------------------
export const UNIQUES = [
  { name: '골드림',    baseKey: 'leatherCap',  flavour: '부는 그것을 찾는 자에게 찾아온다.' },
  { name: '방랑벽', baseKey: 'woolShoes',   flavour: '여정이 곧 보상이다.' },
  { name: '메기노드의 허리띠', baseKey: 'heavyBelt', flavour: '메기노드의 피가 내 혈관을 타고 흐른다.' },
  { name: '검은 심장', baseKey: 'ironRing',    flavour: '석탄의 심장, 재의 영혼.' },
  { name: '파리아', baseKey: 'coralRing',   flavour: '홀로, 외면받아도, 꺾이지 않는.' },
  { name: '수확자의 추격', baseKey: 'stoneAxe', flavour: '수확은 끝나지 않는다.' },
];

// ---------------------------------------------------------------------------
// Rare-name word pools — evocative two-word names, second word by item class.
// ---------------------------------------------------------------------------
const RARE_FIRST = ['시체', '파멸', '피', '복수', '음울', '분노', '폭풍', '냉혹', '영혼', '공포',
  '독사', '거수', '고통', '혼란', '병적', '맹공', '비탄', '유황', '썩은살', '슬픔',
  '가시덤불', '크라켄', '혼령', '증오', '저주', '승리', '용', '불사조', '소용돌이', '지룡',
  '룬', '해골', '구울', '고문', '엔트로피', '천상', '혐오', '죽음', '골렘', '독수리'];
const RARE_SECOND = {
  weapon:  ['재앙', '가르개', '쪼개개', '분쇄', '가시', '날', '송곳니', '상처', '갈증', '노래', '꿰뚫개', '포효', '도살', '약탈자', '학살자', '화환'],
  armour:  ['수호', '결계', '망토', '껍질', '장막', '방패', '갑각', '가죽', '덮개', '외투', '피부', '수의', '장벽', '보루'],
  jewelry: ['매력', '목걸쇠', '고리', '매듭', '원환', '손아귀', '소용돌이', '걸쇠', '구슬', '우상', '인장', '부적', '띠', '선회'],
  belt:    ['속박', '허리띠', '똬리', '채찍', '버클', '움켜쥠', '걸쇠', '감싸개'],
  other:   ['유물', '잔재', '흔적', '징표', '파편', '메아리'],
};
function rareClass(base) {
  if (base.slot === 'weapon') return 'weapon';
  if (base.slot === 'body' || base.slot === 'helm' || base.slot === 'gloves' || base.slot === 'boots') return 'armour';
  if (base.slot === 'ring' || base.slot === 'amulet') return 'jewelry';
  if (base.slot === 'belt') return 'belt';
  return 'other';
}
function composeRareName(base) {
  return `${pick(RARE_FIRST)} ${pick(RARE_SECOND[rareClass(base)] || RARE_SECOND.other)}`;
}

// Magic name: [prefix word] Base [of suffix]. At least one affix guaranteed.
function composeMagicName(base, prefixes, suffixes) {
  const word = prefixes[0]?.word;
  const of = suffixes[0]?.of;
  let n = base.name;
  if (word) n = `${word} ${n}`;
  if (of) n = `${of} ${n}`;
  return n;
}

// ---------------------------------------------------------------------------
// Implicit roll — from base.implicitMod or derived from weapon/def block.
// ---------------------------------------------------------------------------
function rollImplicit(base) {
  const out = [];
  if (base.implicitMod) {
    const vals = base.implicitMod.rolls.map((r) => ri(r[0], r[1]));
    out.push({ text: base.implicitMod.render(vals), values: vals });
  }
  return out;
}

// Roll the base defensive/offensive numbers into concrete display stats.
function rollBaseStats(base, ilvl) {
  const q = 1 + Math.min(0.9, ilvl * 0.012); // higher ilvl bases roll a touch stronger
  if (base.weapon) {
    const w = base.weapon;
    return {
      kind: 'weapon',
      physMin: Math.round(w.physMin * q),
      physMax: Math.round(w.physMax * q),
      crit: w.crit,
      aps: w.aps,
    };
  }
  if (base.def) {
    return { kind: 'armour', defType: base.def.type, def: Math.round(base.def.base * q) };
  }
  return null;
}

// ---------------------------------------------------------------------------
// generateItem — the workhorse. Returns a fully-rolled item object.
//   opts: { ilvl, rarity, baseKey? }
// ---------------------------------------------------------------------------
let _itemSeq = 1;
export function generateItem({ ilvl = 1, rarity = 'normal', baseKey = null } = {}) {
  const base = (baseKey && BASE_BY_KEY.get(baseKey)) ||
    weightedPick(EQUIP_BASES, (b) => 1 / (1 + Math.max(0, b.req.level - ilvl) * 0.5));
  const rar = RARITY[rarity] ? rarity : 'normal';
  const item = {
    id: _itemSeq++,
    base,
    slot: base.slot,
    rarity: rar,
    ilvl: Math.max(1, ilvl),
    req: { ...base.req },
    stats: rollBaseStats(base, ilvl),
    implicits: rollImplicit(base),
    prefixes: [],
    suffixes: [],
    corrupted: false,
    x: -1, y: -1, // grid position, assigned on placement
  };

  if (rar === 'magic' || rar === 'rare') {
    const maxP = RARITY[rar].maxPrefix;
    const maxS = RARITY[rar].maxSuffix;
    // magic: guarantee at least one affix; rare: at least four for weight.
    const minTotal = rar === 'magic' ? 1 : 4;
    const rolled = rollAffixes(base.tags, item.ilvl, maxP, maxS, minTotal);
    item.prefixes = rolled.prefixes;
    item.suffixes = rolled.suffixes;
    // Affix mods can raise the level requirement (highest-tier mod gates it).
    let maxModLvl = base.req.level;
    for (const a of [...rolled.prefixes, ...rolled.suffixes]) {
      maxModLvl = Math.max(maxModLvl, Math.round(a.ilvl * 0.8));
    }
    item.req.level = Math.min(item.ilvl, Math.max(base.req.level, maxModLvl));
  }

  item.name = rar === 'rare' ? composeRareName(base)
    : rar === 'magic' ? composeMagicName(base, item.prefixes, item.suffixes)
    : base.name;
  item.color = rarityColor(rar);
  item.css = rarityCss(rar);
  return item;
}

// ---------------------------------------------------------------------------
// generateUnique — fixed name, fixed base, fixed mod set.
// ---------------------------------------------------------------------------
export function generateUnique(ilvl = 1, def = null) {
  const u = def || pick(UNIQUES);
  const base = BASE_BY_KEY.get(u.baseKey);
  const mods = UNIQUE_MODS[u.name] || { prefixes: [], suffixes: [] };
  const item = {
    id: _itemSeq++,
    base,
    slot: base.slot,
    rarity: 'unique',
    ilvl: Math.max(1, ilvl),
    req: { ...base.req },
    stats: rollBaseStats(base, ilvl),
    implicits: rollImplicit(base),
    prefixes: mods.prefixes.map((m) => rollFixed(m, 'prefix')),
    suffixes: mods.suffixes.map((m) => rollFixed(m, 'suffix')),
    corrupted: false,
    flavour: u.flavour,
    name: u.name,
    color: RARITY.unique.hex,
    css: RARITY.unique.css,
    x: -1, y: -1,
  };
  return item;
}
function rollFixed(m, kind) {
  const vals = (m.rolls || []).map((r) => ri(r[0], r[1]));
  return { kind, group: m.group || m.render.toString(), tier: 0, tierName: '고유', text: m.render(vals), values: vals };
}

// ---------------------------------------------------------------------------
// generateCurrency — weighted table; returns a stackable currency item.
// ---------------------------------------------------------------------------
export function generateCurrency(key = null, count = 1) {
  const c = (key && CUR_BY_KEY.get(key)) || weightedPick(CURRENCIES, (x) => x.weight);
  return {
    id: _itemSeq++,
    base: { key: c.key, name: c.name, slot: 'currency', w: 1, h: 1 },
    slot: 'currency',
    rarity: 'currency',
    currencyKey: c.key,
    ilvl: 1,
    req: { level: 1, str: 0, dex: 0, int: 0 },
    stack: Math.min(count, c.maxStack),
    maxStack: c.maxStack,
    tint: c.tint,
    flavour: c.desc,
    stats: null,
    implicits: [],
    prefixes: [],
    suffixes: [],
    name: c.name,
    color: CURRENCY.hex,
    css: CURRENCY.css,
    x: -1, y: -1,
  };
}

// ---------------------------------------------------------------------------
// describeItem — structured tooltip data for UIHud (no rendering here).
// Returns { name, rarity, color, css, base, ilvl, req, implicits, prefixes,
//           suffixes, flavour, lines[] } where each line is a typed segment.
// ---------------------------------------------------------------------------
export function describeItem(item) {
  const lines = [];
  const push = (kind, text, extra) => lines.push({ kind, text, ...(extra || {}) });

  push('name', item.name, { color: item.color, css: item.css });
  if (item.rarity !== 'normal' && item.rarity !== 'currency' && item.name !== item.base.name) {
    push('base', item.base.name);
  }
  push('sep');

  // Base offensive / defensive block.
  if (item.stats?.kind === 'weapon') {
    const s = item.stats;
    push('stat', `물리 피해: ${s.physMin}-${s.physMax}`, { hl: true });
    push('stat', `치명타 확률: ${s.crit.toFixed(2)}%`);
    push('stat', `초당 공격 횟수: ${s.aps.toFixed(2)}`);
    const dps = ((s.physMin + s.physMax) / 2) * s.aps;
    push('stat', `물리 DPS: ${dps.toFixed(1)}`, { hl: true });
    push('sep');
  } else if (item.stats?.kind === 'armour') {
    const label = item.stats.defType === 'ar' ? '방어도'
      : item.stats.defType === 'ev' ? '회피 등급' : '에너지 보호막';
    push('stat', `${label}: ${item.stats.def}`, { hl: true });
    push('sep');
  } else if (item.slot === 'currency') {
    push('stat', `중첩: ${item.stack}/${item.maxStack}`);
    push('sep');
  }

  // Requirements.
  const r = item.req;
  const reqParts = [`레벨 ${r.level}`];
  if (r.str) reqParts.push(`힘 ${r.str}`);
  if (r.dex) reqParts.push(`민첩 ${r.dex}`);
  if (r.int) reqParts.push(`지능 ${r.int}`);
  if (item.slot !== 'currency') { push('req', `요구 조건: ${reqParts.join(', ')}`); push('sep'); }

  // Implicit mods (rendered with the implicit separator style).
  if (item.implicits.length) {
    for (const m of item.implicits) push('implicit', m.text);
    if (item.prefixes.length || item.suffixes.length) push('sep');
  }

  // Explicit affixes.
  for (const a of item.prefixes) push('prefix', a.text, { tier: a.tier, tierName: a.tierName });
  for (const a of item.suffixes) push('suffix', a.text, { tier: a.tier, tierName: a.tierName });

  if (item.flavour) { push('sep'); push('flavour', item.flavour); }

  return {
    name: item.name,
    rarity: item.rarity,
    color: item.color,
    css: item.css,
    base: item.base.name,
    ilvl: item.ilvl,
    req: { ...item.req },
    implicits: item.implicits.map((m) => ({ text: m.text })),
    prefixes: item.prefixes.map((a) => ({ text: a.text, tier: a.tier, tierName: a.tierName })),
    suffixes: item.suffixes.map((a) => ({ text: a.text, tier: a.tier, tierName: a.tierName })),
    flavour: item.flavour || null,
    lines,
  };
}
