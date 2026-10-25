// EXILIUM — affix system: PoE-style prefixes/suffixes with tiers, weighted
// rolls, mutually-exclusive groups, and per-rarity counts.
// Owner: LootSystem. Pure data + rolling; no THREE, no side effects.
//
// Model (mirrors PoE):
//   - An affix is a "group" (mutually exclusive — only one tier of a group can
//     appear on an item, and only one mod per group).
//   - Each affix has tiers; a tier has ilvl (min item level), weight, and one
//     or more roll ranges [min,max]. Higher tiers require higher ilvl and roll
//     lower weight (rarer) but stronger values.
//   - pools: tags the mod can roll on (item eligible if it shares ANY tag).
//   - Prefix tiers carry a `word` (the item-name prefix); suffix tiers carry
//     an `of` phrase (the "of ..." item-name suffix).

const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

// ---------------------------------------------------------------------------
// PREFIXES — additive/increased offence & defence, flat life/mana/es, etc.
// ---------------------------------------------------------------------------
export const PREFIXES = [
  {
    group: 'LocalPhysDamagePct', pools: ['weapon'],
    render: (v) => `물리 피해 ${v[0]}% 증가`,
    tiers: [
      { ilvl: 1,  weight: 1000, word: '윤나는', name: '반짝이는',  rolls: [[15, 25]] },
      { ilvl: 11, weight: 800,  word: '광택 나는',  name: '번뜩이는',  rolls: [[26, 40]] },
      { ilvl: 23, weight: 500,  word: '벼려진',     name: '담금질된',  rolls: [[41, 55]] },
      { ilvl: 35, weight: 260,  word: '톱니 달린',  name: '면도날 같은', rolls: [[56, 74]] },
      { ilvl: 50, weight: 120,  word: '사악한',    name: '단련된',  rolls: [[75, 100]] },
    ],
  },
  {
    group: 'LocalFlatPhys', pools: ['weapon'],
    render: (v) => `물리 피해 ${v[0]}~${v[1]} 추가`,
    tiers: [
      { ilvl: 2,  weight: 1000, word: '들쭉날쭉한',   name: '파멸의',   rolls: [[2, 4], [5, 8]] },
      { ilvl: 15, weight: 700,  word: '가시 돋친',   name: '찢어발김의', rolls: [[5, 9], [11, 16]] },
      { ilvl: 30, weight: 380,  word: '잔혹한',  name: '대혼란의',  rolls: [[10, 16], [20, 30]] },
      { ilvl: 45, weight: 150,  word: '피에 굶주린', name: '대학살의', rolls: [[17, 26], [34, 50]] },
    ],
  },
  {
    group: 'AddedFireDamage', pools: ['weapon'],
    render: (v) => `화염 피해 ${v[0]}~${v[1]} 추가`,
    tiers: [
      { ilvl: 8,  weight: 700, word: '달궈진',    name: '잿더미의',    rolls: [[2, 4], [6, 10]] },
      { ilvl: 25, weight: 400, word: '그을리는', name: '불씨의', rolls: [[6, 11], [16, 24]] },
      { ilvl: 42, weight: 180, word: '폭발하는',  name: '분신 제물의', rolls: [[14, 22], [34, 50]] },
    ],
  },
  {
    group: 'IncSpellDamage', pools: ['caster'],
    render: (v) => `주문 피해 ${v[0]}% 증가`,
    tiers: [
      { ilvl: 4,  weight: 800, word: '견습생의', name: '신비한',   rolls: [[10, 19]] },
      { ilvl: 20, weight: 500, word: '숙련자의',      name: '비전의',   rolls: [[20, 29]] },
      { ilvl: 38, weight: 240, word: '오컬티스트의',  name: '룬 새겨진',    rolls: [[30, 42]] },
      { ilvl: 55, weight: 90,  word: '룬 새겨진',      name: '전설적인',   rolls: [[43, 58]] },
    ],
  },
  {
    group: 'MaxLife', pools: ['armour', 'belt', 'jewelry', 'body', 'helm', 'gloves', 'boots'],
    render: (v) => `최대 생명력 +${v[0]}`,
    tiers: [
      { ilvl: 1,  weight: 1000, word: '건강한',      name: '튼튼한',  rolls: [[10, 19]] },
      { ilvl: 11, weight: 800,  word: '튼튼한',   name: '혈기 왕성한', rolls: [[20, 29]] },
      { ilvl: 22, weight: 500,  word: '혈기 왕성한',  name: '듬직한', rolls: [[30, 44]] },
      { ilvl: 36, weight: 260,  word: '듬직한',  name: '강건한',   rolls: [[45, 64]] },
      { ilvl: 54, weight: 100,  word: '활력 넘치는',  name: '운동선수의', rolls: [[65, 89]] },
    ],
  },
  {
    group: 'MaxMana', pools: ['armour', 'jewelry', 'body', 'helm', 'gloves', 'boots'],
    render: (v) => `최대 마나 +${v[0]}`,
    tiers: [
      { ilvl: 1,  weight: 900, word: '이슬 맺힌',      name: '안개 낀',    rolls: [[15, 24]] },
      { ilvl: 13, weight: 650, word: '안개 낀',     name: '하늘빛',    rolls: [[25, 39]] },
      { ilvl: 30, weight: 340, word: '하늘빛',     name: '오팔빛', rolls: [[40, 59]] },
      { ilvl: 48, weight: 120, word: '유백색',   name: '예언자의', rolls: [[60, 84]] },
    ],
  },
  {
    group: 'LocalArmour', pools: ['ar'],
    render: (v) => `방어도 +${v[0]}`,
    tiers: [
      { ilvl: 1,  weight: 1000, word: '녹슨',    name: '판금 덧댄',   rolls: [[8, 18]] },
      { ilvl: 12, weight: 700,  word: '판금 덧댄',    name: '철갑의', rolls: [[19, 40]] },
      { ilvl: 28, weight: 380,  word: '철갑의',  name: '단단히 두른',   rolls: [[41, 78]] },
      { ilvl: 45, weight: 140,  word: '강화된', name: '보루의', rolls: [[79, 140]] },
    ],
  },
  {
    group: 'LocalEvasion', pools: ['ev'],
    render: (v) => `회피 등급 +${v[0]}`,
    tiers: [
      { ilvl: 1,  weight: 1000, word: '주워 온',  name: '점각된', rolls: [[8, 18]] },
      { ilvl: 12, weight: 700,  word: '점각된',  name: '덧댄',   rolls: [[19, 40]] },
      { ilvl: 28, weight: 380,  word: '날랜',    name: '단거리 선수의', rolls: [[41, 78]] },
      { ilvl: 45, weight: 140,  word: '흐릿한',   name: '환영의',  rolls: [[79, 140]] },
    ],
  },
  {
    group: 'LocalEnergyShield', pools: ['es'],
    render: (v) => `최대 에너지 보호막 +${v[0]}`,
    tiers: [
      { ilvl: 2,  weight: 900, word: '유령 같은',    name: '번지는 빛의', rolls: [[4, 9]] },
      { ilvl: 14, weight: 620, word: '번지는 빛의',   name: '눈부신',  rolls: [[10, 19]] },
      { ilvl: 30, weight: 320, word: '눈부신',    name: '수호하는',  rolls: [[20, 36]] },
      { ilvl: 48, weight: 110, word: '수증기 같은',   name: '세라핌의', rolls: [[37, 60]] },
    ],
  },
];

// ---------------------------------------------------------------------------
// SUFFIXES — resistances, attributes, attack/cast speed, crit, regen, etc.
// ---------------------------------------------------------------------------
export const SUFFIXES = [
  {
    group: 'FireResist', pools: ['armour', 'belt', 'jewelry', 'body', 'helm', 'gloves', 'boots'],
    render: (v) => `화염 저항 +${v[0]}%`,
    tiers: [
      { ilvl: 1,  weight: 1000, of: '새끼 용의',   name: '새끼 용의',   rolls: [[6, 11]] },
      { ilvl: 12, weight: 700,  of: '도롱뇽의', name: '도롱뇽의', rolls: [[12, 17]] },
      { ilvl: 30, weight: 400,  of: '드레이크의',   name: '드레이크의',   rolls: [[18, 23]] },
      { ilvl: 48, weight: 160,  of: '용의',  name: '용의',  rolls: [[24, 30]] },
    ],
  },
  {
    group: 'ColdResist', pools: ['armour', 'belt', 'jewelry', 'body', 'helm', 'gloves', 'boots'],
    render: (v) => `냉기 저항 +${v[0]}%`,
    tiers: [
      { ilvl: 1,  weight: 1000, of: '이누이트의',   name: '이누이트의',   rolls: [[6, 11]] },
      { ilvl: 12, weight: 700,  of: '예티의',    name: '예티의',    rolls: [[12, 17]] },
      { ilvl: 30, weight: 400,  of: '바다코끼리의',  name: '바다코끼리의',  rolls: [[18, 23]] },
      { ilvl: 48, weight: 160,  of: '북극곰의', name: '북극곰의', rolls: [[24, 30]] },
    ],
  },
  {
    group: 'LightningResist', pools: ['armour', 'belt', 'jewelry', 'body', 'helm', 'gloves', 'boots'],
    render: (v) => `번개 저항 +${v[0]}%`,
    tiers: [
      { ilvl: 1,  weight: 1000, of: '구름의',   name: '구름의',   rolls: [[6, 11]] },
      { ilvl: 12, weight: 700,  of: '돌풍의',  name: '돌풍의',  rolls: [[12, 17]] },
      { ilvl: 30, weight: 400,  of: '폭풍의',   name: '폭풍의',   rolls: [[18, 23]] },
      { ilvl: 48, weight: 160,  of: '대폭풍의', name: '대폭풍의', rolls: [[24, 30]] },
    ],
  },
  {
    group: 'Strength', pools: ['armour', 'jewelry', 'belt', 'body', 'helm', 'gloves', 'boots'],
    render: (v) => `힘 +${v[0]}`,
    tiers: [
      { ilvl: 1,  weight: 900, of: '야수의',  name: '야수의',  rolls: [[8, 12]] },
      { ilvl: 18, weight: 600, of: '레슬러의', name: '레슬러의', rolls: [[13, 17]] },
      { ilvl: 36, weight: 300, of: '곰의',   name: '곰의',   rolls: [[18, 22]] },
      { ilvl: 55, weight: 110, of: '사자의',   name: '사자의',   rolls: [[23, 30]] },
    ],
  },
  {
    group: 'Dexterity', pools: ['armour', 'jewelry', 'belt', 'body', 'helm', 'gloves', 'boots'],
    render: (v) => `민첩 +${v[0]}`,
    tiers: [
      { ilvl: 1,  weight: 900, of: '몽구스의', name: '몽구스의', rolls: [[8, 12]] },
      { ilvl: 18, weight: 600, of: '여우의',    name: '여우의',    rolls: [[13, 17]] },
      { ilvl: 36, weight: 300, of: '매의', name: '매의', rolls: [[18, 22]] },
      { ilvl: 55, weight: 110, of: '표범의', name: '표범의', rolls: [[23, 30]] },
    ],
  },
  {
    group: 'Intelligence', pools: ['armour', 'jewelry', 'belt', 'body', 'helm', 'gloves', 'boots'],
    render: (v) => `지능 +${v[0]}`,
    tiers: [
      { ilvl: 1,  weight: 900, of: '학도의', name: '학도의', rolls: [[8, 12]] },
      { ilvl: 18, weight: 600, of: '신동의', name: '신동의', rolls: [[13, 17]] },
      { ilvl: 36, weight: 300, of: '석학의', name: '석학의', rolls: [[18, 22]] },
      { ilvl: 55, weight: 110, of: '천재의', name: '천재의', rolls: [[23, 30]] },
    ],
  },
  {
    group: 'AttackSpeed', pools: ['weapon', 'gloves'],
    render: (v) => `공격 속도 ${v[0]}% 증가`,
    tiers: [
      { ilvl: 1,  weight: 700, of: '기술의',    name: '기술의',    rolls: [[5, 7]] },
      { ilvl: 20, weight: 420, of: '수월함의',     name: '수월함의',     rolls: [[8, 10]] },
      { ilvl: 40, weight: 180, of: '열정의',  name: '열정의',  rolls: [[11, 13]] },
      { ilvl: 58, weight: 70,  of: '신속의', name: '신속의', rolls: [[14, 17]] },
    ],
  },
  {
    group: 'CastSpeed', pools: ['caster'],
    render: (v) => `시전 속도 ${v[0]}% 증가`,
    tiers: [
      { ilvl: 4,  weight: 600, of: '수다의',  name: '수다의',  rolls: [[5, 8]] },
      { ilvl: 24, weight: 340, of: '위협의',   name: '위협의',   rolls: [[9, 12]] },
      { ilvl: 44, weight: 130, of: '쾌속의', name: '쾌속의', rolls: [[13, 16]] },
    ],
  },
  {
    group: 'CritChance', pools: ['weapon'],
    render: (v) => `치명타 확률 ${v[0]}% 증가`,
    tiers: [
      { ilvl: 8,  weight: 500, of: '바늘 같은', name: '바늘 같은', rolls: [[10, 20]] },
      { ilvl: 30, weight: 260, of: '절개의', name: '절개의', rolls: [[21, 35]] },
      { ilvl: 50, weight: 90,  of: '꿰뚫음의', name: '꿰뚫음의', rolls: [[36, 50]] },
    ],
  },
  {
    group: 'LifeRegen', pools: ['armour', 'jewelry', 'belt', 'body', 'helm', 'gloves', 'boots'],
    render: (v) => `초당 생명력 ${v[0]} 재생`,
    tiers: [
      { ilvl: 3,  weight: 600, of: '복원의', name: '복원의', rolls: [[2, 4]] },
      { ilvl: 20, weight: 340, of: '재생장의',    name: '재생장의',    rolls: [[5, 8]] },
      { ilvl: 40, weight: 130, of: '회춘의', name: '회춘의', rolls: [[9, 14]] },
    ],
  },
  {
    group: 'MoveSpeed', pools: ['boots'],
    render: (v) => `이동 속도 ${v[0]}% 증가`,
    tiers: [
      { ilvl: 1,  weight: 500, of: '바람의',  name: '바람의',  rolls: [[10, 14]] },
      { ilvl: 20, weight: 280, of: '강풍의',  name: '강풍의',  rolls: [[15, 19]] },
      { ilvl: 40, weight: 90,  of: '잔상의',  name: '잔상의',  rolls: [[20, 25]] },
    ],
  },
  {
    group: 'ItemRarity', pools: ['armour', 'jewelry', 'helm', 'gloves', 'boots'],
    render: (v) => `발견 아이템 희귀도 ${v[0]}% 증가`,
    tiers: [
      { ilvl: 5,  weight: 300, of: '풍요의',   name: '풍요의',   rolls: [[6, 10]] },
      { ilvl: 30, weight: 160, of: '행운의',  name: '행운의',  rolls: [[11, 16]] },
      { ilvl: 55, weight: 55,  of: '부의',   name: '부의',   rolls: [[17, 24]] },
    ],
  },
];

// ---------------------------------------------------------------------------
// Fixed unique mod sets (referenced by items.js generateUnique by unique name).
// ---------------------------------------------------------------------------
export const UNIQUE_MODS = {
  'Goldrim': {
    prefixes: [{ group: 'u_evasion', render: (v) => `회피 등급 +${v[0]}`, rolls: [[30, 60]] }],
    suffixes: [
      { group: 'u_allres', render: (v) => `모든 원소 저항 +${v[0]}%`, rolls: [[30, 40]] },
      { group: 'u_rarity', render: (v) => `발견 아이템 희귀도 ${v[0]}% 증가`, rolls: [[30, 30]] },
    ],
  },
  'Wanderlust': {
    prefixes: [{ group: 'u_mana', render: (v) => `최대 마나 +${v[0]}`, rolls: [[10, 20]] }],
    suffixes: [
      { group: 'u_ms', render: (v) => `이동 속도 ${v[0]}% 증가`, rolls: [[20, 20]] },
      { group: 'u_freeze', render: () => `빙결되지 않음`, rolls: [] },
    ],
  },
  'Meginord\u2019s Girdle': {
    prefixes: [{ group: 'u_str', render: (v) => `힘 +${v[0]}`, rolls: [[25, 35]] }],
    suffixes: [
      { group: 'u_phys', render: (v) => `물리 피해 ${v[0]}% 증가`, rolls: [[15, 25]] },
      { group: 'u_firered', render: () => `받는 화염 피해 20% 추가 증가`, rolls: [] },
    ],
  },
  'Blackheart': {
    prefixes: [{ group: 'u_chaos', render: (v) => `공격에 혼돈 피해 ${v[0]}~${v[1]} 추가`, rolls: [[3, 5], [7, 10]] }],
    suffixes: [
      { group: 'u_lifelow', render: (v) => `위급 상태일 때 피해 ${v[0]}% 증가`, rolls: [[10, 15]] },
      { group: 'u_leech', render: () => `물리 공격 피해의 0.2%를 생명력으로 흡수`, rolls: [] },
    ],
  },
  'The Pariah': {
    prefixes: [],
    suffixes: [{ group: 'u_scaling', render: (v) => `비어 있는 반지 소켓당 희귀도 ${v[0]}% 증가`, rolls: [[8, 12]] }],
  },
  'Reaper\u2019s Pursuit': {
    prefixes: [
      { group: 'u_physpct', render: (v) => `물리 피해 ${v[0]}% 증가`, rolls: [[80, 110]] },
      { group: 'u_flatphys', render: (v) => `물리 피해 ${v[0]}~${v[1]} 추가`, rolls: [[10, 15], [22, 30]] },
    ],
    suffixes: [
      { group: 'u_leech', render: () => `물리 공격 피해의 0.4%를 생명력으로 흡수`, rolls: [] },
      { group: 'u_onkill', render: () => `처치 시 광란 충전 1개 획득`, rolls: [] },
    ],
  },
};

// ---------------------------------------------------------------------------
// Eligibility + tier selection.
// ---------------------------------------------------------------------------
function poolMatches(pools, tags) {
  for (const p of pools) if (tags.includes(p)) return true;
  return false;
}

// Highest tier whose ilvl requirement <= item ilvl. Returns {tier, index}|null.
function bestTier(mod, ilvl) {
  let best = null, idx = -1;
  for (let i = 0; i < mod.tiers.length; i++) {
    const t = mod.tiers[i];
    if (t.ilvl <= ilvl) { if (!best || t.ilvl > best.ilvl) { best = t; idx = i; } }
  }
  return best ? { tier: best, index: idx } : null;
}

// Build the eligible weighted pool for one affix kind, excluding used groups.
function buildPool(list, tags, ilvl, usedGroups) {
  const out = [];
  for (const mod of list) {
    if (usedGroups.has(mod.group)) continue;
    if (!poolMatches(mod.pools, tags)) continue;
    const bt = bestTier(mod, ilvl);
    if (!bt) continue;
    out.push({ mod, tier: bt.tier, tierIndex: bt.index, weight: bt.tier.weight });
  }
  return out;
}

function weightedPick(pool) {
  let total = 0;
  for (const e of pool) total += e.weight;
  if (total <= 0) return null;
  let r = Math.random() * total;
  for (const e of pool) { r -= e.weight; if (r <= 0) return e; }
  return pool[pool.length - 1];
}

// tierName like "T2" — higher tier number == weaker (PoE convention: T1 best).
function tierLabel(mod, tierIndex) {
  return `T${mod.tiers.length - tierIndex}`;
}

function rollOne(entry, kind) {
  const vals = entry.tier.rolls.map((r) => ri(r[0], r[1]));
  return {
    kind,
    group: entry.mod.group,
    tier: mod2tier(entry),
    tierName: tierLabel(entry.mod, entry.tierIndex),
    word: kind === 'prefix' ? entry.tier.word : undefined,
    of: kind === 'suffix' ? entry.tier.of : undefined,
    name: entry.tier.name,
    ilvl: entry.tier.ilvl,
    text: entry.mod.render(vals),
    values: vals,
  };
}
function mod2tier(entry) { return entry.mod.tiers.length - entry.tierIndex; }

// ---------------------------------------------------------------------------
// rollAffixes — the public entry. Returns { prefixes:[], suffixes:[] }.
//   tags:       item tag array
//   ilvl:       item level (gates tiers)
//   maxPrefix:  cap prefixes (0/1/3)
//   maxSuffix:  cap suffixes (0/1/3)
//   minTotal:   guaranteed minimum affix count (magic:1, rare:4)
// ---------------------------------------------------------------------------
export function rollAffixes(tags, ilvl, maxPrefix, maxSuffix, minTotal = 0) {
  const prefixes = [];
  const suffixes = [];
  const usedGroups = new Set();

  // Target counts: bias toward "full" on rares, at least minTotal overall.
  let nP, nS;
  if (maxPrefix === 1 && maxSuffix === 1) {
    // magic: 1..2 affixes, split.
    const total = Math.random() < 0.55 ? 2 : 1;
    if (total === 2) { nP = 1; nS = 1; }
    else if (Math.random() < 0.5) { nP = 1; nS = 0; } else { nP = 0; nS = 1; }
  } else {
    // rare: weighted toward more affixes.
    nP = weightedCount(maxPrefix);
    nS = weightedCount(maxSuffix);
    while (nP + nS < minTotal) {
      if (nP < maxPrefix && (nS >= maxSuffix || Math.random() < 0.5)) nP++;
      else if (nS < maxSuffix) nS++;
      else if (nP < maxPrefix) nP++;
      else break;
    }
  }

  for (let i = 0; i < nP; i++) {
    const pool = buildPool(PREFIXES, tags, ilvl, usedGroups);
    const e = weightedPick(pool);
    if (!e) break;
    usedGroups.add(e.mod.group);
    prefixes.push(rollOne(e, 'prefix'));
  }
  for (let i = 0; i < nS; i++) {
    const pool = buildPool(SUFFIXES, tags, ilvl, usedGroups);
    const e = weightedPick(pool);
    if (!e) break;
    usedGroups.add(e.mod.group);
    suffixes.push(rollOne(e, 'suffix'));
  }

  // Guarantee minTotal even if a pool ran dry on one side.
  while (prefixes.length + suffixes.length < minTotal) {
    const canP = prefixes.length < maxPrefix;
    const canS = suffixes.length < maxSuffix;
    let added = false;
    if (canP) {
      const e = weightedPick(buildPool(PREFIXES, tags, ilvl, usedGroups));
      if (e) { usedGroups.add(e.mod.group); prefixes.push(rollOne(e, 'prefix')); added = true; }
    }
    if (!added && canS) {
      const e = weightedPick(buildPool(SUFFIXES, tags, ilvl, usedGroups));
      if (e) { usedGroups.add(e.mod.group); suffixes.push(rollOne(e, 'suffix')); added = true; }
    }
    if (!added) break; // no more eligible mods
  }

  return { prefixes, suffixes };
}

// Weighted affix count toward the cap: fuller items are rarer but favoured.
function weightedCount(max) {
  if (max <= 0) return 0;
  const r = Math.random();
  if (max === 3) { return r < 0.15 ? 1 : r < 0.5 ? 2 : 3; }
  if (max === 2) { return r < 0.4 ? 1 : 2; }
  return 1;
}
