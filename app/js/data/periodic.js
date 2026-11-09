/* Periyodik tablo: [sembol, Türkçe ad, atom kütlesi]. Dizideki sıra = atom numarası − 1. */
(function () {
  const RAW = [
    ['H','Hidrojen',1.008],['He','Helyum',4.003],['Li','Lityum',6.94],['Be','Berilyum',9.012],['B','Bor',10.81],
    ['C','Karbon',12.011],['N','Azot',14.007],['O','Oksijen',15.999],['F','Flor',18.998],['Ne','Neon',20.180],
    ['Na','Sodyum',22.990],['Mg','Magnezyum',24.305],['Al','Alüminyum',26.982],['Si','Silisyum',28.085],['P','Fosfor',30.974],
    ['S','Kükürt',32.06],['Cl','Klor',35.45],['Ar','Argon',39.948],['K','Potasyum',39.098],['Ca','Kalsiyum',40.078],
    ['Sc','Skandiyum',44.956],['Ti','Titanyum',47.867],['V','Vanadyum',50.942],['Cr','Krom',51.996],['Mn','Mangan',54.938],
    ['Fe','Demir',55.845],['Co','Kobalt',58.933],['Ni','Nikel',58.693],['Cu','Bakır',63.546],['Zn','Çinko',65.38],
    ['Ga','Galyum',69.723],['Ge','Germanyum',72.630],['As','Arsenik',74.922],['Se','Selenyum',78.971],['Br','Brom',79.904],
    ['Kr','Kripton',83.798],['Rb','Rubidyum',85.468],['Sr','Stronsiyum',87.62],['Y','İtriyum',88.906],['Zr','Zirkonyum',91.224],
    ['Nb','Niyobyum',92.906],['Mo','Molibden',95.95],['Tc','Teknesyum',98],['Ru','Rutenyum',101.07],['Rh','Rodyum',102.906],
    ['Pd','Paladyum',106.42],['Ag','Gümüş',107.868],['Cd','Kadmiyum',112.414],['In','İndiyum',114.818],['Sn','Kalay',118.710],
    ['Sb','Antimon',121.760],['Te','Tellür',127.60],['I','İyot',126.904],['Xe','Ksenon',131.293],['Cs','Sezyum',132.905],
    ['Ba','Baryum',137.327],['La','Lantan',138.905],['Ce','Seryum',140.116],['Pr','Praseodim',140.908],['Nd','Neodim',144.242],
    ['Pm','Prometyum',145],['Sm','Samaryum',150.36],['Eu','Evropiyum',151.964],['Gd','Gadolinyum',157.25],['Tb','Terbiyum',158.925],
    ['Dy','Disprozyum',162.500],['Ho','Holmiyum',164.930],['Er','Erbiyum',167.259],['Tm','Tulyum',168.934],['Yb','İterbiyum',173.045],
    ['Lu','Lutesyum',174.967],['Hf','Hafniyum',178.49],['Ta','Tantal',180.948],['W','Tungsten',183.84],['Re','Renyum',186.207],
    ['Os','Osmiyum',190.23],['Ir','İridyum',192.217],['Pt','Platin',195.084],['Au','Altın',196.967],['Hg','Cıva',200.592],
    ['Tl','Talyum',204.38],['Pb','Kurşun',207.2],['Bi','Bizmut',208.980],['Po','Polonyum',209],['At','Astatin',210],
    ['Rn','Radon',222],['Fr','Fransiyum',223],['Ra','Radyum',226],['Ac','Aktinyum',227],['Th','Toryum',232.038],
    ['Pa','Protaktinyum',231.036],['U','Uranyum',238.029],['Np','Neptünyum',237],['Pu','Plütonyum',244],['Am','Amerikyum',243],
    ['Cm','Küriyum',247],['Bk','Berkelyum',247],['Cf','Kaliforniyum',251],['Es','Aynştaynyum',252],['Fm','Fermiyum',257],
    ['Md','Mendelevyum',258],['No','Nobelyum',259],['Lr','Lavrensiyum',266],['Rf','Rutherfordiyum',267],['Db','Dubniyum',268],
    ['Sg','Seaborgiyum',269],['Bh','Bohriyum',270],['Hs','Hassiyum',277],['Mt','Meitneriyum',278],['Ds','Darmstadtiyum',281],
    ['Rg','Röntgenyum',282],['Cn','Kopernikyum',285],['Nh','Nihonyum',286],['Fl','Flerovyum',289],['Mc','Moskovyum',290],
    ['Lv','Livermoryum',293],['Ts','Tennesin',294],['Og','Oganesson',294]
  ];

  const CATS = {
    alkali: { name: 'Alkali metal', color: '#ff8a80' },
    toprak: { name: 'Toprak alkali metal', color: '#ffbe76' },
    gecis: { name: 'Geçiş metali', color: '#f6d77a' },
    metal: { name: 'Zayıf metal', color: '#9ad5b8' },
    yarimetal: { name: 'Yarı metal', color: '#7fd1d9' },
    ametal: { name: 'Ametal', color: '#8fb8ff' },
    halojen: { name: 'Halojen', color: '#b8a4ff' },
    soygaz: { name: 'Soy gaz', color: '#e39cf0' },
    lantanit: { name: 'Lantanit', color: '#f2a7c3' },
    aktinit: { name: 'Aktinit', color: '#e0a3a3' }
  };

  const set = (arr) => new Set(arr);
  const ALKALI = set([3, 11, 19, 37, 55, 87]);
  const TOPRAK = set([4, 12, 20, 38, 56, 88]);
  const YARIMETAL = set([5, 14, 32, 33, 51, 52]);
  const AMETAL = set([1, 6, 7, 8, 15, 16, 34]);
  const HALOJEN = set([9, 17, 35, 53, 85, 117]);
  const SOYGAZ = set([2, 10, 18, 36, 54, 86, 118]);

  const PERIOD_END = [2, 10, 18, 36, 54, 86, 118];

  function position(z) {
    let period = PERIOD_END.findIndex((e) => z <= e) + 1;
    const start = period === 1 ? 1 : PERIOD_END[period - 2] + 1;
    const idx = z - start;
    if (period === 1) return { period, group: z === 1 ? 1 : 18, row: 1, col: z === 1 ? 1 : 18 };
    if (period <= 3) {
      const group = idx < 2 ? idx + 1 : idx + 11;
      return { period, group, row: period, col: group };
    }
    if (period <= 5) return { period, group: idx + 1, row: period, col: idx + 1 };
    // 6. ve 7. periyot
    if (idx < 2) return { period, group: idx + 1, row: period, col: idx + 1 };
    if (idx <= 16) return { period, group: 3, row: period === 6 ? 9 : 10, col: idx + 1, fblock: true };
    const group = idx - 13;
    return { period, group, row: period, col: group };
  }

  function category(z, pos) {
    if (ALKALI.has(z)) return 'alkali';
    if (TOPRAK.has(z)) return 'toprak';
    if (SOYGAZ.has(z)) return 'soygaz';
    if (HALOJEN.has(z)) return 'halojen';
    if (YARIMETAL.has(z)) return 'yarimetal';
    if (AMETAL.has(z)) return 'ametal';
    if (z >= 57 && z <= 71) return 'lantanit';
    if (z >= 89 && z <= 103) return 'aktinit';
    if (pos.group >= 3 && pos.group <= 12) return 'gecis';
    return 'metal';
  }

  // Aufbau sırası ile elektron dizilimi (yaygın istisnalar elle verilmiştir).
  const ORDER = ['1s','2s','2p','3s','3p','4s','3d','4p','5s','4d','5p','6s','4f','5d','6p','7s','5f','6d','7p'];
  const CAP = { s: 2, p: 6, d: 10, f: 14 };
  const NOBLE = [[86,'Rn'],[54,'Xe'],[36,'Kr'],[18,'Ar'],[10,'Ne'],[2,'He']];
  const EXCEPTIONS = {
    24: '[Ar] 4s¹ 3d⁵', 29: '[Ar] 4s¹ 3d¹⁰', 41: '[Kr] 5s¹ 4d⁴', 42: '[Kr] 5s¹ 4d⁵',
    44: '[Kr] 5s¹ 4d⁷', 45: '[Kr] 5s¹ 4d⁸', 46: '[Kr] 4d¹⁰', 47: '[Kr] 5s¹ 4d¹⁰',
    57: '[Xe] 6s² 5d¹', 58: '[Xe] 6s² 4f¹ 5d¹', 64: '[Xe] 6s² 4f⁷ 5d¹', 78: '[Xe] 6s¹ 4f¹⁴ 5d⁹',
    79: '[Xe] 6s¹ 4f¹⁴ 5d¹⁰', 89: '[Rn] 7s² 6d¹', 90: '[Rn] 7s² 6d²', 91: '[Rn] 7s² 5f² 6d¹',
    92: '[Rn] 7s² 5f³ 6d¹', 93: '[Rn] 7s² 5f⁴ 6d¹', 96: '[Rn] 7s² 5f⁷ 6d¹'
  };
  const SUP = { 0:'⁰',1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷',8:'⁸',9:'⁹' };
  const sup = (n) => String(n).split('').map((d) => SUP[d]).join('');

  function config(z) {
    if (EXCEPTIONS[z]) return EXCEPTIONS[z];
    const core = NOBLE.find(([n]) => n < z);
    let left = z, parts = [], skip = core ? core[0] : 0;
    for (const sh of ORDER) {
      if (left <= 0) break;
      const c = Math.min(CAP[sh[1]], left);
      left -= c;
      if (skip > 0) { skip -= c; continue; }
      parts.push(sh + sup(c));
    }
    return (core ? '[' + core[1] + '] ' : '') + parts.join(' ');
  }

  function fullConfig(z) {
    let left = z, parts = [];
    for (const sh of ORDER) {
      if (left <= 0) break;
      const c = Math.min(CAP[sh[1]], left);
      left -= c;
      parts.push(sh + sup(c));
    }
    return parts.join(' ');
  }

  window.PERIODIC_CATS = CATS;
  window.ELEMENTS = RAW.map(([sym, name, mass], i) => {
    const z = i + 1;
    const pos = position(z);
    const cat = category(z, pos);
    return { z, sym, name, mass, ...pos, cat, config: config(z), full: z <= 36 && !EXCEPTIONS[z] ? fullConfig(z) : null };
  });
})();
