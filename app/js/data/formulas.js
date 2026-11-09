/*
 * Hap bilgiler. Her kart: { c: kategori, t: başlık, l: [satırlar] }.
 * Satırlarda basit HTML kullanılabilir (<sup>, <sub>, <b>).
 */
window.NOTE_CATEGORIES = [
  { id: 'mat', name: 'Matematik', color: '#8ccfee' },
  { id: 'geo', name: 'Geometri', color: '#9fd8f2' },
  { id: 'fiz', name: 'Fizik', color: '#ffb47e' },
  { id: 'kim', name: 'Kimya', color: '#a9b2ff' },
  { id: 'ptable', name: 'Periyodik Tablo', color: '#c5b8ff' },
  { id: 'bio', name: 'Biyoloji', color: '#9ee39a' },
  { id: 'tr', name: 'Türkçe', color: '#d98a74' },
  { id: 'mine', name: 'Notlarım', color: '#e2c26b' }
];

window.FORMULAS = [
  // ======================= MATEMATİK =======================
  { c: 'mat', t: 'Ardışık Sayı Toplamları', l: [
    '1 + 2 + 3 + … + n = <b>n(n+1)/2</b>',
    '2 + 4 + 6 + … + 2n = <b>n(n+1)</b>',
    '1 + 3 + 5 + … + (2n−1) = <b>n²</b>',
    '1² + 2² + … + n² = <b>n(n+1)(2n+1)/6</b>',
    '1³ + 2³ + … + n³ = <b>[n(n+1)/2]²</b>',
    'Terim sayısı = (son − ilk) / artış + 1',
    'Toplam = (ilk + son) · terim sayısı / 2'
  ]},
  { c: 'mat', t: 'Özdeşlikler', l: [
    '(a + b)² = a² + 2ab + b²',
    '(a − b)² = a² − 2ab + b²',
    'a² − b² = (a − b)(a + b)',
    '(a + b)³ = a³ + 3a²b + 3ab² + b³',
    '(a − b)³ = a³ − 3a²b + 3ab² − b³',
    'a³ + b³ = (a + b)(a² − ab + b²)',
    'a³ − b³ = (a − b)(a² + ab + b²)',
    'a² + b² = (a + b)² − 2ab = (a − b)² + 2ab',
    'x² + 1/x² = (x + 1/x)² − 2',
    '(a + b + c)² = a² + b² + c² + 2(ab + ac + bc)'
  ]},
  { c: 'mat', t: 'Üslü Sayılar', l: [
    'a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup>  ·  a<sup>m</sup> / a<sup>n</sup> = a<sup>m−n</sup>',
    '(a<sup>m</sup>)<sup>n</sup> = a<sup>m·n</sup>  ·  (a·b)<sup>n</sup> = a<sup>n</sup>·b<sup>n</sup>',
    'a<sup>0</sup> = 1 (a ≠ 0)  ·  a<sup>−n</sup> = 1 / a<sup>n</sup>',
    'Negatif sayının çift kuvveti pozitif, tek kuvveti negatiftir.',
    'a<sup>x</sup> = a<sup>y</sup> ⇒ x = y (a ≠ 0, ±1)'
  ]},
  { c: 'mat', t: 'Köklü Sayılar', l: [
    '<sup>n</sup>√(a<sup>m</sup>) = a<sup>m/n</sup>',
    '√a · √b = √(ab)  ·  √a / √b = √(a/b)',
    '√(a²) = |a|',
    'x√a ± y√a = (x ± y)√a',
    'Paydayı rasyonel yapma: 1/(√a − √b) = (√a + √b)/(a − b)',
    '√(a + b ± 2√(ab)) = √a ± √b  (a > b)'
  ]},
  { c: 'mat', t: 'Mutlak Değer', l: [
    '|x| = x (x ≥ 0), |x| = −x (x < 0)',
    '|x| = a ⇒ x = a veya x = −a (a ≥ 0)',
    '|x| < a ⇒ −a < x < a',
    '|x| > a ⇒ x > a veya x < −a',
    '|a · b| = |a| · |b|,  |a + b| ≤ |a| + |b|'
  ]},
  { c: 'mat', t: 'Bölünebilme Kuralları', l: [
    '<b>2:</b> son basamak çift  ·  <b>5:</b> son basamak 0 veya 5',
    '<b>3:</b> rakamlar toplamı 3’ün katı  ·  <b>9:</b> rakamlar toplamı 9’un katı',
    '<b>4:</b> son iki basamak 4’ün katı  ·  <b>8:</b> son üç basamak 8’in katı',
    '<b>10:</b> son basamak 0',
    '<b>11:</b> sağdan başlayarak + − + − … işaretleriyle toplam 11’in katı',
    'Aralarında asal sayıların çarpımına bölünebilme: her birine ayrı bölünür (ör. 6 = 2·3, 12 = 3·4, 15 = 3·5)',
    'Bölme: A = B·Q + K, 0 ≤ K < B'
  ]},
  { c: 'mat', t: 'Asal Çarpanlar, EBOB-EKOK', l: [
    'A = a<sup>x</sup> · b<sup>y</sup> · c<sup>z</sup> ise pozitif bölen sayısı = (x+1)(y+1)(z+1)',
    'Tam sayı bölen sayısı = 2 · pozitif bölen sayısı',
    'Asal olmayan bölen sayısı = pozitif bölen sayısı − asal bölen sayısı',
    'EBOB(a,b) · EKOK(a,b) = a · b',
    'EBOB: ortak asal çarpanların en küçük üslüleri; EKOK: tüm asal çarpanların en büyük üslüleri',
    'Aralarında asal ⇒ EBOB = 1'
  ]},
  { c: 'mat', t: 'Faktöriyel ve Basamak', l: [
    'n! = 1 · 2 · 3 · … · n,   0! = 1! = 1',
    'n! sonundaki sıfır sayısı: n’yi sürekli 5’e bölüp bölümleri topla',
    '(abc)<sub>10</sub> = 100a + 10b + c',
    'ab + ba = 11(a + b)   ·   ab − ba = 9(a − b)',
    'abc − cba = 99(a − c)'
  ]},
  { c: 'mat', t: 'Oran-Orantı ve Problemler', l: [
    'Doğru orantı: x / y = k   ·   Ters orantı: x · y = k',
    '<b>Hız:</b> yol = hız × zaman',
    'Karşılaşma: t = x / (v₁ + v₂)   ·   Yetişme: t = x / (v₁ − v₂)',
    'Ortalama hız (eşit yollar) = 2v₁v₂ / (v₁ + v₂)',
    '<b>İşçi:</b> 1/t₁ + 1/t₂ = 1/t (birlikte bitirme süresi)',
    '<b>Yüzde:</b> Satış = Alış · (100 ± kâr%) / 100',
    '<b>Karışım:</b> (m₁·%₁ + m₂·%₂) / (m₁ + m₂) = %karışım',
    '<b>Yaş:</b> yaş farkı hiç değişmez; t yıl sonra her kişi t yaş büyür'
  ]},
  { c: 'mat', t: 'Kümeler', l: [
    's(A ∪ B) = s(A) + s(B) − s(A ∩ B)',
    's(A ∪ B ∪ C) = s(A)+s(B)+s(C) − s(A∩B) − s(A∩C) − s(B∩C) + s(A∩B∩C)',
    'n elemanlı kümenin alt küme sayısı = 2<sup>n</sup>, öz alt küme sayısı = 2<sup>n</sup> − 1',
    'r elemanlı alt küme sayısı = C(n, r)',
    'De Morgan: (A ∪ B)′ = A′ ∩ B′,  (A ∩ B)′ = A′ ∪ B′',
    's(A × B) = s(A) · s(B)'
  ]},
  { c: 'mat', t: 'Fonksiyonlar', l: [
    's(A) = a, s(B) = b ise A’dan B’ye fonksiyon sayısı = b<sup>a</sup>',
    'Bire bir fonksiyon sayısı = b! / (b − a)!',
    'f(x) = (ax + b)/(cx + d) ⇒ f<sup>−1</sup>(x) = (−dx + b)/(cx − a)',
    '(f ∘ f<sup>−1</sup>)(x) = x,  (f ∘ g)<sup>−1</sup> = g<sup>−1</sup> ∘ f<sup>−1</sup>',
    'Tek fonksiyon: f(−x) = −f(x) (orijine simetrik) · Çift: f(−x) = f(x) (y eksenine simetrik)',
    'y = f(x − a) + b: grafik a birim sağa, b birim yukarı ötelenir'
  ]},
  { c: 'mat', t: 'Permütasyon, Kombinasyon, Binom', l: [
    'P(n, r) = n! / (n − r)!',
    'Tekrarlı permütasyon: n! / (a! · b! · c!)',
    'Dairesel permütasyon: (n − 1)!',
    'C(n, r) = n! / (r! · (n − r)!),   C(n, r) = C(n, n − r)',
    'C(n, 0) + C(n, 1) + … + C(n, n) = 2<sup>n</sup>',
    '(a + b)<sup>n</sup> açılımında n + 1 terim vardır',
    'Baştan (r+1). terim: C(n, r) · a<sup>n−r</sup> · b<sup>r</sup>',
    'Katsayılar toplamı: değişkenlere 1 ver; sabit terim: değişkene 0 ver (veya üssü 0 yapan terim)'
  ]},
  { c: 'mat', t: 'Olasılık', l: [
    'P(A) = s(A) / s(E),   0 ≤ P(A) ≤ 1',
    'P(A′) = 1 − P(A)',
    'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)',
    'Bağımsız olaylar: P(A ∩ B) = P(A) · P(B)',
    'Koşullu olasılık: P(A | B) = P(A ∩ B) / P(B)',
    'Ayrık olaylar: A ∩ B = ∅ ⇒ P(A ∪ B) = P(A) + P(B)'
  ]},
  { c: 'mat', t: 'Mantık', l: [
    'p ⇒ q ≡ p′ ∨ q',
    'p ⇔ q ≡ (p ⇒ q) ∧ (q ⇒ p)',
    '(p ∧ q)′ ≡ p′ ∨ q′   ·   (p ∨ q)′ ≡ p′ ∧ q′',
    'p ⇒ q yalnızca 1 ⇒ 0 durumunda yanlıştır',
    'Karşıt ters: p ⇒ q ≡ q′ ⇒ p′',
    '(∀x, p(x))′ ≡ ∃x, p′(x)'
  ]},
  { c: 'mat', t: 'Veri ve İstatistik', l: [
    'Aritmetik ortalama = toplam / terim sayısı',
    'Medyan: sıralanmış verinin ortadaki değeri (çift sayıda veride ortadaki iki değerin ortalaması)',
    'Mod: en çok tekrar eden değer',
    'Açıklık = en büyük − en küçük',
    'Standart sapma = √( Σ(xᵢ − x̄)² / (n − 1) )',
    'Kartiller: alt çeyrek Q1, üst çeyrek Q3; çeyrekler açıklığı = Q3 − Q1'
  ]},
  { c: 'mat', t: 'Polinomlar', l: [
    'P(1) = katsayılar toplamı,   P(0) = sabit terim',
    'P(x)’in (x − a) ile bölümünden kalan = P(a)',
    'P(x)’in (ax + b) ile bölümünden kalan = P(−b/a)',
    'Bölme: P(x) = Q(x) · B(x) + K(x), der(K) < der(B)',
    'Çift dereceli terimlerin katsayıları toplamı = [P(1) + P(−1)] / 2',
    'Tek dereceli terimlerin katsayıları toplamı = [P(1) − P(−1)] / 2'
  ]},
  { c: 'mat', t: '2. Dereceden Denklemler', l: [
    'ax² + bx + c = 0,   Δ = b² − 4ac',
    'Δ > 0: iki farklı reel kök · Δ = 0: çakışık kök · Δ < 0: reel kök yok',
    'x₁,₂ = (−b ± √Δ) / 2a',
    'x₁ + x₂ = −b/a,   x₁ · x₂ = c/a,   |x₁ − x₂| = √Δ / |a|',
    'Kökleri x₁, x₂ olan denklem: x² − (x₁ + x₂)x + x₁x₂ = 0',
    '1/x₁ + 1/x₂ = −b/c,   x₁² + x₂² = (x₁+x₂)² − 2x₁x₂'
  ]},
  { c: 'mat', t: 'Parabol ve Eşitsizlikler', l: [
    'y = ax² + bx + c tepe noktası: r = −b/2a,  k = f(r)',
    'y = a(x − r)² + k biçimi; a > 0 kollar yukarı, a < 0 kollar aşağı',
    'Simetri ekseni: x = r',
    'Parabol x eksenini Δ > 0 ise 2, Δ = 0 ise 1 noktada keser',
    'İşaret tablosu: en büyük dereceli terimin katsayısının işareti en sağdan başlar; çift katlı kökte işaret değişmez'
  ]},
  { c: 'mat', t: 'Karmaşık Sayılar', l: [
    'i² = −1,  i³ = −i,  i⁴ = 1 (üsler 4’ün katına göre döner)',
    'z = a + bi,  eşlenik z̄ = a − bi',
    '|z| = √(a² + b²),   z · z̄ = |z|²',
    'Bölme: pay ve paydayı paydanın eşleniğiyle çarp'
  ]},
  { c: 'mat', t: 'Logaritma', l: [
    'log<sub>a</sub>x = y ⇔ a<sup>y</sup> = x  (a > 0, a ≠ 1, x > 0)',
    'log<sub>a</sub>(xy) = log<sub>a</sub>x + log<sub>a</sub>y,   log<sub>a</sub>(x/y) = log<sub>a</sub>x − log<sub>a</sub>y',
    'log<sub>a</sub>x<sup>n</sup> = n · log<sub>a</sub>x,   log<sub>a<sup>m</sup></sub>x = (1/m) log<sub>a</sub>x',
    'Taban değiştirme: log<sub>a</sub>b = log b / log a',
    'a<sup>log<sub>a</sub>x</sup> = x,   log<sub>a</sub>b · log<sub>b</sub>a = 1',
    'log 2 ≈ 0,301   ·   log 3 ≈ 0,477   ·   ln e = 1'
  ]},
  { c: 'mat', t: 'Diziler', l: [
    '<b>Aritmetik:</b> aₙ = a₁ + (n − 1)d,   Sₙ = n(a₁ + aₙ)/2',
    'aₙ = (aₙ₋ₖ + aₙ₊ₖ) / 2 (ortadaki terim)',
    '<b>Geometrik:</b> aₙ = a₁ · r<sup>n−1</sup>,   Sₙ = a₁(r<sup>n</sup> − 1)/(r − 1)',
    'aₙ² = aₙ₋ₖ · aₙ₊ₖ',
    'Sonsuz geometrik toplam (|r| < 1): S = a₁ / (1 − r)'
  ]},
  { c: 'mat', t: 'Trigonometri — Temel', l: [
    'sin²x + cos²x = 1,   tan x = sin x / cos x,   cot x = 1 / tan x',
    '1 + tan²x = sec²x,   1 + cot²x = csc²x',
    'Özel açılar (sin): 0° → 0, 30° → 1/2, 45° → √2/2, 60° → √3/2, 90° → 1',
    'Özel açılar (cos): 0° → 1, 30° → √3/2, 45° → √2/2, 60° → 1/2, 90° → 0',
    'tan 30° = √3/3,  tan 45° = 1,  tan 60° = √3',
    'π radyan = 180°'
  ]},
  { c: 'mat', t: 'Trigonometri — İleri', l: [
    'sin(a ± b) = sin a cos b ± cos a sin b',
    'cos(a ± b) = cos a cos b ∓ sin a sin b',
    'tan(a ± b) = (tan a ± tan b) / (1 ∓ tan a tan b)',
    'sin 2x = 2 sin x cos x',
    'cos 2x = cos²x − sin²x = 2cos²x − 1 = 1 − 2sin²x',
    'Sinüs teoremi: a/sin A = b/sin B = c/sin C = 2R',
    'Kosinüs teoremi: a² = b² + c² − 2bc · cos A',
    'Periyot: sin(kx), cos(kx) → 2π/|k|;   tan(kx), cot(kx) → π/|k|',
    'İndirgeme: 90° ± x ve 270° ± x’te fonksiyon değişir (sin↔cos); 180° ± x, 360° ± x’te değişmez; işaret bölgeye göre'
  ]},
  { c: 'mat', t: 'Limit', l: [
    'Limit varsa sağdan ve soldan limitler eşittir',
    '0/0 belirsizliği: çarpanlara ayır veya L’Hospital: lim f/g = lim f′/g′',
    'lim<sub>x→0</sub> sin x / x = 1,   lim<sub>x→0</sub> tan x / x = 1',
    '∞/∞: payın ve paydanın en büyük dereceli terimlerine bak',
    'Süreklilik: lim<sub>x→a</sub> f(x) = f(a)'
  ]},
  { c: 'mat', t: 'Türev', l: [
    '(xⁿ)′ = n·xⁿ⁻¹,   (c)′ = 0',
    '(u·v)′ = u′v + uv′,   (u/v)′ = (u′v − uv′) / v²',
    'Zincir kuralı: [f(g(x))]′ = f′(g(x)) · g′(x)',
    '(sin x)′ = cos x,   (cos x)′ = −sin x,   (tan x)′ = 1 + tan²x',
    '(eˣ)′ = eˣ,   (aˣ)′ = aˣ ln a,   (ln x)′ = 1/x',
    'Teğetin eğimi = f′(a); teğet denklemi: y − f(a) = f′(a)(x − a)',
    'f′ > 0 artan, f′ < 0 azalan; f′ = 0 ve işaret değişimi → ekstremum',
    'f″ = 0 ve işaret değişimi → büküm noktası'
  ]},
  { c: 'mat', t: 'İntegral', l: [
    '∫xⁿ dx = xⁿ⁺¹/(n + 1) + c  (n ≠ −1)',
    '∫(1/x) dx = ln|x| + c,   ∫eˣ dx = eˣ + c',
    '∫sin x dx = −cos x + c,   ∫cos x dx = sin x + c',
    '∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a)',
    'Alan: eğri x ekseninin altındaysa integralin mutlak değeri alınır',
    'İki eğri arası alan = ∫ (üstteki − alttaki) dx'
  ]},

  // ======================= GEOMETRİ =======================
  { c: 'geo', t: 'Açılar ve Üçgende Açı', l: [
    'Tümler açılar toplamı 90°, bütünler açılar toplamı 180°',
    'Paralel iki doğruyu kesen doğruda: yöndeş ve iç ters açılar eşittir',
    'Üçgende iç açılar toplamı 180°, dış açılar toplamı 360°',
    'Bir dış açı, kendisine komşu olmayan iki iç açının toplamına eşittir',
    'İç açıortaylar arası açı: 90° + A/2;  dış açıortaylar arası: 90° − A/2'
  ]},
  { c: 'geo', t: 'Açı-Kenar Bağıntıları', l: [
    'Büyük açı karşısında büyük kenar bulunur',
    'Üçgen eşitsizliği: |b − c| < a < b + c',
    'Dar açılı: a² < b² + c²   ·   Geniş açılı: a² > b² + c²'
  ]},
  { c: 'geo', t: 'Dik Üçgen', l: [
    'Pisagor: a² + b² = c²',
    'Özel üçgenler: 3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29',
    '30°-60°-90°: kenarlar 1 : √3 : 2',
    '45°-45°-90°: kenarlar 1 : 1 : √2',
    'Öklid: h² = p · k,   b² = p · c,   a² = k · c',
    'Hipotenüse ait kenarortay = hipotenüs / 2',
    'Dik üçgende alan = dik kenarlar çarpımı / 2 = hipotenüs · yükseklik / 2'
  ]},
  { c: 'geo', t: 'İkizkenar ve Eşkenar Üçgen', l: [
    'İkizkenar üçgende tepe açıdan inen yükseklik aynı zamanda açıortay ve kenarortaydır',
    'Eşkenar üçgen: h = a√3/2,   Alan = a²√3/4',
    'Eşkenar üçgende içteki bir noktadan kenarlara inen dikmeler toplamı = h'
  ]},
  { c: 'geo', t: 'Açıortay ve Kenarortay', l: [
    'İç açıortay teoremi: |BD| / |DC| = c / b',
    'İç açıortay uzunluğu: nₐ² = b·c − m·n',
    'Dış açıortay teoremi: |BE| / |CE| = c / b',
    'Kenarortaylar ağırlık merkezinde 2 : 1 oranında kesişir',
    'Kenarortay uzunluğu: 4Vₐ² = 2b² + 2c² − a²',
    'Ağırlık merkezi üçgeni alanca 6 eş parçaya ayırır'
  ]},
  { c: 'geo', t: 'Benzerlik', l: [
    'Benzerlik oranı k ise: uzunluklar k, alanlar k², hacimler k³ oranındadır',
    'Temel benzerlik: DE ∥ BC ⇒ |AD|/|AB| = |AE|/|AC| = |DE|/|BC|',
    'Tales: paralel doğrular kesenleri orantılı parçalara ayırır',
    'Kelebek: AB ∥ CD ise üçgenler benzer, oran |AB| / |CD|'
  ]},
  { c: 'geo', t: 'Üçgende Alan', l: [
    'A = (taban · yükseklik) / 2',
    'A = (1/2) · b · c · sin A',
    'Heron: A = √(u(u−a)(u−b)(u−c)),  u = (a+b+c)/2',
    'A = u · r (r: iç teğet çember yarıçapı)',
    'A = a·b·c / (4R) (R: çevrel çember yarıçapı)',
    'Yükseklikleri aynı üçgenlerin alanları tabanlarıyla orantılıdır'
  ]},
  { c: 'geo', t: 'Çokgenler', l: [
    'İç açılar toplamı = (n − 2) · 180°',
    'Dış açılar toplamı = 360°',
    'Düzgün çokgende bir dış açı = 360° / n',
    'Köşegen sayısı = n(n − 3) / 2',
    'Düzgün altıgen = 6 eşkenar üçgen,  Alan = 6 · a²√3/4'
  ]},
  { c: 'geo', t: 'Dörtgenler', l: [
    'Herhangi dörtgen: A = (1/2) · e · f · sin θ',
    'Köşegenleri dik dörtgende: a² + c² = b² + d²',
    '<b>Yamuk:</b> orta taban = (a + c)/2,  A = (a + c) · h / 2',
    '<b>Paralelkenar:</b> A = a · h = a · b · sin θ; köşegenler birbirini ortalar',
    '<b>Eşkenar dörtgen:</b> A = e · f / 2; köşegenler dik kesişir',
    '<b>Deltoid:</b> A = e · f / 2',
    '<b>Dikdörtgen:</b> köşegen = √(a² + b²)',
    '<b>Kare:</b> köşegen = a√2,  A = a² = köşegen² / 2'
  ]},
  { c: 'geo', t: 'Çember ve Daire', l: [
    'Merkez açı = gördüğü yay',
    'Çevre açı = gördüğü yay / 2;  çapı gören çevre açı 90°',
    'Teğet-kiriş açısı = gördüğü yay / 2',
    'İç açı = (yay₁ + yay₂) / 2,   Dış açı = (büyük yay − küçük yay) / 2',
    'Kirişler: |PA|·|PB| = |PC|·|PD|;  teğet: |PT|² = |PA|·|PB|',
    'Teğet yarıçapa diktir; dıştaki noktadan çizilen teğet uzunlukları eşittir',
    'Çevre = 2πr,  Alan = πr²',
    'Yay uzunluğu = 2πr · α/360°,  Daire dilimi = πr² · α/360°'
  ]},
  { c: 'geo', t: 'Analitik Geometri', l: [
    'İki nokta arası uzaklık: √((x₂−x₁)² + (y₂−y₁)²)',
    'Orta nokta: ((x₁+x₂)/2, (y₁+y₂)/2)',
    'Eğim: m = (y₂ − y₁)/(x₂ − x₁) = tan α',
    'Doğru denklemi: y − y₁ = m(x − x₁)',
    'Paralel: m₁ = m₂   ·   Dik: m₁ · m₂ = −1',
    'Noktanın doğruya uzaklığı: |ax₀ + by₀ + c| / √(a² + b²)',
    'Paralel doğrular arası: |c₁ − c₂| / √(a² + b²)',
    'Çember: (x − a)² + (y − b)² = r²',
    'x² + y² + Dx + Ey + F = 0 ⇒ M(−D/2, −E/2), r = ½√(D² + E² − 4F)'
  ]},
  { c: 'geo', t: 'Dönüşümler', l: [
    'x eksenine göre yansıma: (x, y) → (x, −y)',
    'y eksenine göre yansıma: (x, y) → (−x, y)',
    'Orijine göre yansıma: (x, y) → (−x, −y)',
    'y = x doğrusuna göre: (x, y) → (y, x);  y = −x: (x, y) → (−y, −x)',
    'Orijin etrafında 90° (saat yönü tersi): (x, y) → (−y, x)',
    '180° dönme: (x, y) → (−x, −y)',
    'Öteleme (a, b): (x, y) → (x + a, y + b)'
  ]},
  { c: 'geo', t: 'Katı Cisimler', l: [
    '<b>Küp:</b> V = a³,  A = 6a²,  cisim köşegeni = a√3',
    '<b>Dikdörtgenler prizması:</b> V = abc,  A = 2(ab + ac + bc),  köşegen = √(a² + b² + c²)',
    '<b>Prizma:</b> V = taban alanı · h',
    '<b>Silindir:</b> V = πr²h,  yanal alan = 2πrh',
    '<b>Piramit:</b> V = taban alanı · h / 3',
    '<b>Koni:</b> V = πr²h / 3,  yanal alan = πrℓ,  ℓ² = r² + h²',
    '<b>Küre:</b> V = 4πr³ / 3,  A = 4πr²'
  ]},

  // ======================= FİZİK =======================
  { c: 'fiz', t: 'Madde ve Özellikleri', l: [
    'Özkütle: d = m / V',
    'Karışım özkütlesi: d = (m₁ + m₂) / (V₁ + V₂)',
    'Eşit hacim karışım: (d₁ + d₂)/2   ·   Eşit kütle karışım: 2d₁d₂/(d₁ + d₂)',
    'Dayanıklılık ∝ kesit alanı / hacim (boyut büyüdükçe azalır)',
    'Adezyon > kohezyon ⇒ sıvı ıslatır, kılcal borularda yükselir'
  ]},
  { c: 'fiz', t: 'Hareket', l: [
    'Sabit hız: x = v · t',
    'İvme: a = Δv / Δt',
    'v = v₀ + a·t,   x = v₀·t + ½·a·t²,   v² = v₀² + 2·a·x',
    'Konum-zaman grafiğinde eğim = hız',
    'Hız-zaman grafiğinde eğim = ivme, alan = yer değiştirme',
    'İvme-zaman grafiğinde alan = hız değişimi'
  ]},
  { c: 'fiz', t: 'Kuvvet ve Newton Yasaları', l: [
    'F<sub>net</sub> = m · a',
    'Ağırlık: G = m · g (g ≈ 10 m/s²)',
    'Sürtünme: f<sub>s</sub> = k · N',
    'Eylemsizlik: F<sub>net</sub> = 0 ise cisim durur veya sabit hızla gider',
    'Etki-tepki kuvvetleri eşit büyüklükte, zıt yönlü ve farklı cisimlere etki eder',
    'Eğik düzlemde: aşağı bileşen mg·sinθ, dik bileşen mg·cosθ'
  ]},
  { c: 'fiz', t: 'İş, Güç, Enerji', l: [
    'W = F · x · cos θ',
    'P = W / t = F · v',
    'Kinetik enerji: E<sub>k</sub> = ½ m v²',
    'Potansiyel enerji: E<sub>p</sub> = m g h',
    'Yay potansiyel enerjisi: ½ k x²',
    'Verim = yararlı enerji / harcanan enerji',
    'Sürtünmesiz ortamda mekanik enerji korunur'
  ]},
  { c: 'fiz', t: 'Isı ve Sıcaklık', l: [
    'Q = m · c · ΔT   ·   Isı sığası = m · c',
    'Hal değişimi: Q = m · L',
    'Denge sıcaklığı: T = (m₁c₁T₁ + m₂c₂T₂) / (m₁c₁ + m₂c₂)',
    'Boyca genleşme: ΔL = L₀ · λ · ΔT',
    'Hacimce genleşme: ΔV = V₀ · α · ΔT',
    'K = °C + 273,   °F = 1,8 · °C + 32',
    'Hal değişimi sırasında saf maddenin sıcaklığı sabit kalır'
  ]},
  { c: 'fiz', t: 'Basınç ve Kaldırma Kuvveti', l: [
    'Katı basıncı: P = F / A',
    'Sıvı basıncı: P = h · d · g (kabın şeklinden bağımsız)',
    'Açık hava basıncı ≈ 76 cmHg ≈ 10⁵ Pa',
    'Pascal: F₁/A₁ = F₂/A₂',
    'Kaldırma kuvveti: F<sub>k</sub> = V<sub>batan</sub> · d<sub>sıvı</sub> · g',
    'd<sub>cisim</sub> < d<sub>sıvı</sub> yüzer · eşit: askıda · büyük: batar',
    'Yüzen cisimde: F<sub>k</sub> = G'
  ]},
  { c: 'fiz', t: 'Elektrostatik ve Elektrik', l: [
    'Coulomb: F = k · q₁ · q₂ / d²,   k = 9·10⁹ N·m²/C²',
    'Dokunmada yükler yarıçaplarla orantılı paylaşılır',
    'Akım: I = q / t',
    'Ohm: V = I · R,   Direnç: R = ρ · L / A',
    'Seri: R<sub>eş</sub> = R₁ + R₂ + …  (akım ortak)',
    'Paralel: 1/R<sub>eş</sub> = 1/R₁ + 1/R₂ + …  (gerilim ortak)',
    'Güç: P = V·I = I²R = V²/R,   Enerji: W = P · t'
  ]},
  { c: 'fiz', t: 'Manyetizma (TYT)', l: [
    'Aynı kutuplar iter, zıt kutuplar çeker',
    'Manyetik alan çizgileri mıknatısın dışında N’den S’ye gider',
    'Akım geçen telin çevresinde dairesel manyetik alan oluşur (sağ el kuralı)',
    'Dünya’nın coğrafi kuzeyi yakınında manyetik güney kutbu vardır'
  ]},
  { c: 'fiz', t: 'Dalgalar', l: [
    'v = λ · f,   f = 1 / T',
    'Dalga hızı ortama bağlıdır; frekans kaynağa bağlıdır',
    'Yay dalgası: hız gerilmeyle artar, yayın kalınlaşmasıyla azalır',
    'İnce yaydan kalına geçişte yansıyan atma ters döner; kalından inceye geçişte düz yansır',
    'Sabit uçta yansıyan atma ters, serbest uçta düz döner',
    'Su dalgası: derin ortamda hız ve dalga boyu büyüktür',
    'Ses: katılarda > sıvılarda > gazlarda hızlıdır; boşlukta yayılmaz',
    'Deprem dalgaları: P (boyuna, hızlı), S (enine, yavaş)'
  ]},
  { c: 'fiz', t: 'Optik', l: [
    'Düzlem ayna: görüntü düz, eşit boyda, aynaya eşit uzaklıkta, sanal',
    'α açılı iki aynada görüntü sayısı: n = 360°/α − 1',
    'Küresel ayna & mercek: 1/f = 1/d<sub>c</sub> + 1/d<sub>g</sub>',
    'Aynada f = r / 2;  büyütme: h<sub>g</sub>/h<sub>c</sub> = d<sub>g</sub>/d<sub>c</sub>',
    'Snell: n₁ · sin θ₁ = n₂ · sin θ₂',
    'Sınır açı: sin θ<sub>s</sub> = n₂ / n₁ (çok kırıcıdan az kırıcıya)',
    'Işığın ana renkleri: kırmızı, yeşil, mavi → beyaz',
    'Boyanın ana renkleri: cyan, magenta, sarı'
  ]},
  { c: 'fiz', t: 'Vektör, Bağıl Hareket, Atışlar', l: [
    '|A + B|² = A² + B² + 2AB · cos θ',
    'Bağıl hız: v<sub>bağıl</sub> = v<sub>cisim</sub> − v<sub>gözlemci</sub>',
    'Nehir: karşıya geçiş süresi yalnızca akıntıya dik hız bileşenine bağlıdır',
    'Serbest düşme: h = ½gt²,  v = gt,  v² = 2gh',
    'Yatay atış: x = v₀ · t,  h = ½gt²',
    'Eğik atış: t<sub>uçuş</sub> = 2v₀ sin θ / g,  menzil = v₀² sin 2θ / g,  h<sub>max</sub> = (v₀ sin θ)² / 2g'
  ]},
  { c: 'fiz', t: 'Momentum, Tork, Denge', l: [
    'Momentum: p = m · v',
    'İtme: I = F · Δt = Δp',
    'Dış kuvvet yoksa toplam momentum korunur',
    'Esnek çarpışmada kinetik enerji de korunur',
    'Tork: τ = F · d (dik uzaklık)',
    'Denge: ΣF = 0 ve Στ = 0',
    'Kütle merkezi: x<sub>KM</sub> = Σ mᵢxᵢ / Σ mᵢ'
  ]},
  { c: 'fiz', t: 'Basit Makineler', l: [
    'Kaldıraç: kuvvet × kuvvet kolu = yük × yük kolu',
    'Sabit makara: F = P (yön değiştirir)',
    'Hareketli makara: F = P / 2',
    'Eğik düzlem: F · L = P · h',
    'Çıkrık: F · R = P · r',
    'Basit makineler kuvvetten kazanç sağlar, işten kazanç sağlamaz'
  ]},
  { c: 'fiz', t: 'Elektrik Alan ve Sığa', l: [
    'E = k · q / d²,   V = k · q / d',
    'İş: W = q · ΔV',
    'Paralel levhalar: E = V / d,  F = q · E',
    'Sığa: C = ε · A / d,   Q = C · V',
    'Depolanan enerji: ½ C V²',
    'Paralel bağlı: C<sub>eş</sub> = C₁ + C₂   ·   Seri: 1/C<sub>eş</sub> = 1/C₁ + 1/C₂'
  ]},
  { c: 'fiz', t: 'Manyetik Alan ve İndüksiyon', l: [
    'Düz tel: B = 2k · I / d   (k = 10⁻⁷)',
    'Halka merkezi: B = 2πk · I / r',
    'Akım makarası: B = 4πk · N · I / ℓ',
    'Tele etki eden kuvvet: F = B · I · ℓ · sin θ',
    'Yüke etki eden kuvvet: F = q · v · B (Lorentz)',
    'Manyetik akı: Φ = B · A · cos θ',
    'İndüksiyon emk: ε = −ΔΦ / Δt,   hareketli çubuk: ε = B · ℓ · v',
    'Transformatör: V<sub>p</sub>/V<sub>s</sub> = N<sub>p</sub>/N<sub>s</sub> = I<sub>s</sub>/I<sub>p</sub>',
    'Alternatif akım: V<sub>etkin</sub> = V<sub>max</sub>/√2,  X<sub>L</sub> = 2πfL,  X<sub>C</sub> = 1/(2πfC)'
  ]},
  { c: 'fiz', t: 'Çembersel Hareket ve Kütle Çekim', l: [
    'v = 2πr / T,   ω = 2π / T,   v = ω · r',
    'Merkezcil ivme: a = v² / r,   F = m v² / r',
    'Virajda güvenli hız: tan θ = v² / (r g)',
    'Düşey çember tepe noktasında v<sub>min</sub> = √(g r)',
    'Kütle çekim: F = G · m₁m₂ / d²',
    'Yüzey çekim ivmesi: g = G M / R²',
    'Kepler 3: T² / r³ = sabit',
    'Açısal momentum: L = I · ω (dış tork yoksa korunur)'
  ]},
  { c: 'fiz', t: 'Basit Harmonik Hareket', l: [
    'Yay sarkacı: T = 2π √(m / k)',
    'Basit sarkaç: T = 2π √(ℓ / g)',
    'x = A sin(ωt),   v<sub>max</sub> = A ω,   a<sub>max</sub> = A ω²',
    'Denge noktasında hız maksimum, ivme sıfır; uç noktalarda tersi'
  ]},
  { c: 'fiz', t: 'Dalga Mekaniği', l: [
    'Çift yarık: saçak aralığı Δx = λ · L / d',
    'n. aydınlık saçak: xₙ = n · λ · L / d',
    'Tek yarık: merkezi aydınlık genişliği = 2λL / a',
    'Doppler: kaynak yaklaşırken algılanan frekans artar',
    'Elektromanyetik dalgalar boşlukta c = 3·10⁸ m/s ile yayılır'
  ]},
  { c: 'fiz', t: 'Modern Fizik', l: [
    'Foton enerjisi: E = h · f = h · c / λ   (hc ≈ 12400 eV·Å)',
    'Fotoelektrik: E<sub>k,max</sub> = h·f − W₀;  eşik frekansı f₀ = W₀ / h',
    'Işık şiddeti koparılan elektron sayısını, frekans elektron enerjisini belirler',
    'de Broglie: λ = h / (m · v)',
    'Compton: saçılan fotonun dalga boyu artar',
    'Bohr (H): Eₙ = −13,6 / n² eV,  rₙ ∝ n²',
    'Görelilik: zaman genişlemesi t = γ t₀,  boy kısalması L = L₀ / γ,  E = mc²',
    'Yarılanma: N = N₀ · (1/2)<sup>t/T</sup>',
    'α: ⁴₂He (A −4, Z −2) · β⁻: Z +1 · γ: A ve Z değişmez',
    'Wien: λ<sub>max</sub> · T = sabit'
  ]},

  // ======================= KİMYA =======================
  { c: 'kim', t: 'Atomun Yapısı', l: [
    'Atom numarası (Z) = proton sayısı',
    'Kütle numarası (A) = proton + nötron',
    'İyonda elektron sayısı = proton − yük',
    'İzotop: aynı Z, farklı A · İzoton: aynı nötron · İzobar: aynı A',
    'İzoelektronik: elektron sayısı ve dizilimi aynı'
  ]},
  { c: 'kim', t: 'Periyodik Özellikler', l: [
    'Atom yarıçapı: grupta aşağı ↑, periyotta sağa ↓',
    'İyonlaşma enerjisi: grupta aşağı ↓, periyotta sağa ↑ (istisna: 2A > 3A, 5A > 6A)',
    'Elektronegatiflik: sağ üst köşeye doğru artar (en büyük F)',
    'Metalik aktiflik: sol alta doğru artar; ametal aktiflik sağ üste doğru',
    'Katyon yarıçapı < nötr atom < anyon yarıçapı',
    'Soy gazların değerlik katmanı tam doludur (He: 1s²)'
  ]},
  { c: 'kim', t: 'Kimyasal Bağlar', l: [
    'İyonik: metal + ametal (elektron alışverişi)',
    'Kovalent: ametal + ametal (elektron ortaklaşması)',
    'Apolar kovalent: aynı atomlar arası (H₂, O₂); polar: farklı atomlar arası',
    'Metalik bağ: metal katyonları ve serbest elektron denizi',
    'Molekül polarlığı: merkez atomda ortaklanmamış elektron yoksa ve uçlar aynıysa apolardır'
  ]},
  { c: 'kim', t: 'Molekül Geometrisi (VSEPR)', l: [
    'AX₂: doğrusal, 180°, sp (BeH₂, CO₂)',
    'AX₃: düzlem üçgen, 120°, sp² (BF₃)',
    'AX₄: düzgün dörtyüzlü, 109,5°, sp³ (CH₄)',
    'AX₃E: üçgen piramit, ~107° (NH₃)',
    'AX₂E₂: kırık doğru, ~104,5° (H₂O)',
    'Tekli bağ: 1σ · ikili bağ: 1σ + 1π · üçlü bağ: 1σ + 2π'
  ]},
  { c: 'kim', t: 'Zayıf Etkileşimler', l: [
    'Hidrojen bağı: H atomu F, O veya N’ye bağlıysa',
    'Dipol-dipol: polar moleküller arasında',
    'London (indüklenmiş dipol): tüm moleküllerde; molekül büyüdükçe artar',
    'Etkileşim kuvveti arttıkça kaynama noktası artar, buhar basıncı azalır',
    'Benzer benzeri çözer: polar polarda, apolar apolarda çözünür'
  ]},
  { c: 'kim', t: 'Mol Kavramı', l: [
    'n = m / M<sub>A</sub>',
    'n = N / N<sub>A</sub>,   N<sub>A</sub> = 6,02 · 10²³',
    'NŞA (0 °C, 1 atm): 1 mol gaz = 22,4 L',
    'Oda koşulu (25 °C, 1 atm): 1 mol gaz = 24,5 L',
    '1 akb (u) = 1/N<sub>A</sub> gram'
  ]},
  { c: 'kim', t: 'Temel Kanunlar ve Tepkimeler', l: [
    'Kütlenin korunumu: girenlerin kütlesi = ürünlerin kütlesi',
    'Sabit oranlar: bileşikteki elementlerin kütlece oranı sabittir',
    'Katlı oranlar: aynı elementlerden oluşan iki bileşikte oranlar küçük tam sayılarla ifade edilir',
    'Sınırlayıcı bileşen: tamamen tükenen madde, ürün miktarını belirler',
    'Verim % = (gerçek ürün / teorik ürün) · 100',
    'Tepkime türleri: yanma, sentez, analiz, asit-baz (nötralleşme), çözünme-çökelme, redoks'
  ]},
  { c: 'kim', t: 'Karışımlar ve Derişim', l: [
    'Kütlece % = (m<sub>çözünen</sub> / m<sub>çözelti</sub>) · 100',
    'ppm = (m<sub>çözünen</sub> / m<sub>çözelti</sub>) · 10⁶',
    'Molarite: M = n / V(L)',
    'Molalite: m = n / kg çözücü',
    'Seyreltme: M₁V₁ = M₂V₂',
    'Karıştırma: M<sub>son</sub> = (M₁V₁ + M₂V₂) / (V₁ + V₂)',
    'Koligatif: ΔT<sub>k</sub> = K<sub>k</sub> · m · i,   ΔT<sub>d</sub> = K<sub>d</sub> · m · i  (i: tanecik sayısı)'
  ]},
  { c: 'kim', t: 'Ayırma Yöntemleri', l: [
    'Tanecik boyutu: süzme, eleme, diyaliz',
    'Özkütle: ayırma hunisi, yüzdürme, santrifüj',
    'Kaynama noktası: basit/ayrımsal damıtma',
    'Çözünürlük: kristallendirme, ekstraksiyon',
    'Erime noktası: erime farkı ile ayırma',
    'Manyetik özellik: mıknatıs ile ayırma'
  ]},
  { c: 'kim', t: 'Asitler, Bazlar, pH', l: [
    'Arrhenius: asit suda H⁺, baz OH⁻ verir',
    'Brønsted-Lowry: asit proton verir, baz proton alır',
    'pH = −log[H⁺],   pOH = −log[OH⁻],   pH + pOH = 14 (25 °C)',
    'K<sub>su</sub> = [H⁺][OH⁻] = 10⁻¹⁴',
    'Nötralleşme: n<sub>H⁺</sub> = n<sub>OH⁻</sub>',
    'Amfoter metaller: Al, Zn, Cr, Pb, Sn, Be (hem asit hem bazla tepkime verir)',
    'Soy metaller (Cu, Ag, Au, Pt, Hg) HCl ile H₂ açığa çıkarmaz'
  ]},
  { c: 'kim', t: 'Gazlar', l: [
    'İdeal gaz: P · V = n · R · T,   R = 0,082 L·atm/(mol·K)',
    'Boyle: P₁V₁ = P₂V₂   ·   Charles: V₁/T₁ = V₂/T₂',
    'Gay-Lussac: P₁/T₁ = P₂/T₂   ·   Avogadro: V₁/n₁ = V₂/n₂',
    'Birleşik: P₁V₁/T₁ = P₂V₂/T₂',
    'Dalton: P<sub>toplam</sub> = ΣPᵢ,   Pᵢ = Xᵢ · P<sub>toplam</sub>',
    'Graham: v₁/v₂ = √(M₂/M₁)',
    'Ortalama kinetik enerji yalnızca mutlak sıcaklığa bağlıdır',
    'Su üstünde toplanan gaz: P<sub>gaz</sub> = P<sub>toplam</sub> − P<sub>su buharı</sub>'
  ]},
  { c: 'kim', t: 'Tepkimelerde Enerji', l: [
    'ΔH = ΣH<sub>ürünler</sub> − ΣH<sub>girenler</sub>',
    'ΔH < 0 ekzotermik, ΔH > 0 endotermik',
    'Bağ enerjileriyle: ΔH = Σ(kırılan bağlar) − Σ(oluşan bağlar)',
    'Hess: tepkime ters çevrilirse ΔH işaret değiştirir, katsayıyla çarpılırsa ΔH de çarpılır',
    'Elementlerin standart oluşum entalpisi sıfırdır'
  ]},
  { c: 'kim', t: 'Tepkime Hızı ve Denge', l: [
    'Hız bağıntısı: r = k [A]<sup>x</sup> [B]<sup>y</sup> (yavaş adıma göre)',
    'Hızı artıranlar: sıcaklık, derişim, temas yüzeyi, katalizör',
    'Katalizör E<sub>a</sub>’yı düşürür; ΔH’yi ve dengeyi değiştirmez',
    'K<sub>c</sub> = [ürünler]<sup>katsayı</sup> / [girenler]<sup>katsayı</sup> (katı ve saf sıvılar yazılmaz)',
    'K<sub>p</sub> = K<sub>c</sub> · (RT)<sup>Δn</sup>',
    'Le Chatelier: denge, etkiyi azaltacak yöne kayar',
    'K yalnızca sıcaklıkla değişir'
  ]},
  { c: 'kim', t: 'Sulu Çözelti Dengeleri', l: [
    'K<sub>a</sub> · K<sub>b</sub> = K<sub>su</sub>',
    'Zayıf asit: [H⁺] ≈ √(K<sub>a</sub> · C)',
    'Tampon: zayıf asit + konjuge bazı (veya zayıf baz + konjuge asidi)',
    'Çözünürlük çarpımı: AB → K<sub>çç</sub> = s²,  AB₂ → 4s³,  A₂B₃ → 108s⁵',
    'Ortak iyon çözünürlüğü azaltır',
    'Q > K<sub>çç</sub> ise çökelme olur'
  ]},
  { c: 'kim', t: 'Kimya ve Elektrik', l: [
    'Yükseltgenme: elektron verme (yükseltgenme basamağı artar)',
    'İndirgenme: elektron alma (yükseltgenme basamağı azalır)',
    'Pilde anot (−) yükseltgenir, katot (+) indirgenir',
    'E°<sub>pil</sub> = E°<sub>katot</sub> − E°<sub>anot</sub> (indirgenme potansiyelleri); E° > 0 ise istemli',
    'Nernst: E = E° − (0,0592 / n) · log Q',
    'Faraday: 1 mol e⁻ = 96500 C,  Q = I · t',
    'Elektrolizde anot (+) yükseltgenme, katot (−) indirgenme'
  ]},
  { c: 'kim', t: 'Organik Kimya', l: [
    'Alkan: CₙH₂ₙ₊₂ (sp³) · Alken: CₙH₂ₙ (sp²) · Alkin: CₙH₂ₙ₋₂ (sp)',
    'Ön ekler: 1 met, 2 et, 3 prop, 4 büt, 5 pent, 6 heks, 7 hept, 8 okt, 9 non, 10 dek',
    'Alkol: R−OH · Eter: R−O−R′',
    'Aldehit: R−CHO · Keton: R−CO−R′',
    'Karboksilik asit: R−COOH · Ester: R−COO−R′',
    'Birincil alkol → aldehit → karboksilik asit (yükseltgenme); ikincil alkol → keton',
    'Esterleşme: asit + alkol → ester + su'
  ]},

  // ======================= BİYOLOJİ =======================
  { c: 'bio', t: 'Canlıların Ortak Özellikleri', l: [
    'Hücresel yapı, beslenme, solunum, boşaltım, üreme',
    'Uyarılara tepki, hareket, büyüme ve gelişme, metabolizma, homeostazi',
    'Virüsler: hücresel yapıları yoktur, yalnızca canlı hücre içinde çoğalır, tek tip nükleik asit taşır'
  ]},
  { c: 'bio', t: 'Organik Bileşikler', l: [
    '<b>Karbonhidrat:</b> monomer monosakkarit (glikoz), bağ glikozit',
    '<b>Protein:</b> monomer amino asit, bağ peptit',
    '<b>Lipit (yağ):</b> yağ asidi + gliserol, bağ ester',
    '<b>Nükleik asit:</b> monomer nükleotit, bağ fosfodiester',
    'Dehidrasyon sentezi: n monomer → n − 1 su açığa çıkar; hidroliz ile tersi',
    'Enerji kullanım sırası: karbonhidrat → yağ → protein',
    'Glikojen hayvanlarda, nişasta bitkilerde depo polisakkarittir; selüloz bitki hücre çeperinde'
  ]},
  { c: 'bio', t: 'Enzimler ve Vitaminler', l: [
    'Enzimler protein yapılıdır, tepkimeden değişmeden çıkar, spesifiktir',
    'Etkileyen faktörler: sıcaklık, pH, enzim ve substrat derişimi, inhibitör, aktivatör',
    'Yağda çözünen vitaminler: A, D, E, K (depolanabilir)',
    'Suda çözünen vitaminler: B grubu, C (depolanamaz)'
  ]},
  { c: 'bio', t: 'DNA, RNA ve ATP', l: [
    'DNA: deoksiriboz, A-T-G-C, çift zincir; RNA: riboz, A-U-G-C, tek zincir',
    'DNA’da A = T, G ≡ C (A-T 2, G-C 3 hidrojen bağı)',
    'Pürin: A, G · Pirimidin: T, C, U',
    'ATP: adenin + riboz + 3 fosfat',
    'Replikasyon yarı korunumludur',
    'Kodon: 3 nükleotit; 64 kodon (61 anlamlı, 3 stop), başlangıç kodonu AUG'
  ]},
  { c: 'bio', t: 'Hücre ve Organeller', l: [
    'Ribozom: protein sentezi (zarsız, tüm hücrelerde)',
    'Mitokondri: oksijenli solunum, ATP üretimi',
    'Kloroplast: fotosentez (bitki ve bazı protistler)',
    'Golgi: paketleme ve salgılama · Lizozom: hücre içi sindirim',
    'Endoplazmik retikulum: madde taşınması (granüllü: protein)',
    'Koful: depo; bitkilerde büyük merkezi koful · Sentrozom: hayvan hücresinde bölünme',
    'Prokaryotlarda zarlı organel ve çekirdek zarı yoktur'
  ]},
  { c: 'bio', t: 'Madde Geçişleri', l: [
    'Difüzyon: çoktan aza, enerji harcanmaz',
    'Kolaylaştırılmış difüzyon: taşıyıcı protein ile, enerji harcanmaz',
    'Osmoz: suyun az yoğundan çok yoğun ortama geçişi',
    'Aktif taşıma: azdan çoğa, ATP harcanır (Na⁺-K⁺ pompası)',
    'Endositoz (fagositoz, pinositoz) ve ekzositoz: ATP harcanır',
    'Hipertonik ortamda bitki hücresi plazmoliz, hipotonikte turgor'
  ]},
  { c: 'bio', t: 'Sınıflandırma', l: [
    'Alem → Şube → Sınıf → Takım → Familya → Cins → Tür',
    'Alemler: Bakteriler, Arkeler, Protistler, Bitkiler, Mantarlar, Hayvanlar',
    'Bilimsel ad: cins adı (büyük harfle) + tür adı',
    'Aynı türün bireyleri çiftleşip verimli döller verebilir'
  ]},
  { c: 'bio', t: 'Mitoz ve Mayoz', l: [
    'Mitoz: 2n → 2n, iki özdeş hücre; büyüme, onarım, eşeysiz üreme',
    'Mayoz: 2n → n, dört farklı hücre; gamet oluşumu',
    'Krossing over mayoz I profaz evresinde, tetratlarda gerçekleşir',
    'Homolog kromozomlar mayoz I’de, kardeş kromatitler mayoz II’de ayrılır',
    'Mitozda sitoplazma bölünmesi: hayvanda boğumlanma, bitkide ara lamel'
  ]},
  { c: 'bio', t: 'Kalıtım', l: [
    'Monohibrit (Aa × Aa): fenotip 3 : 1, genotip 1 : 2 : 1',
    'Dihibrit (AaBb × AaBb): fenotip 9 : 3 : 3 : 1',
    'Gamet çeşidi = 2ⁿ (n: heterozigot gen çifti sayısı)',
    'Kan grupları: A ve B eş baskın, 0 çekinik; Rh⁺ baskın',
    'X’e bağlı çekinik: renk körlüğü, hemofili (erkeklerde daha sık)',
    'Kontrol çaprazlaması: baskın fenotipli birey homozigot çekinikle çaprazlanır'
  ]},
  { c: 'bio', t: 'Ekoloji', l: [
    'Besin zincirinde bir basamaktan diğerine enerjinin yaklaşık %10’u aktarılır',
    'Üreticiler → birincil tüketiciler → ikincil tüketiciler; ayrıştırıcılar madde döngüsünü sağlar',
    'Biyolojik birikim üst basamaklarda artar',
    'Azot döngüsü: azot bağlayıcı bakteriler, nitrifikasyon, denitrifikasyon',
    'Simbiyoz: mutualizm (+,+), kommensalizm (+,0), parazitlik (+,−)'
  ]},
  { c: 'bio', t: 'Sinir Sistemi ve Duyu', l: [
    'Nöron: dendrit → hücre gövdesi → akson',
    'Dinlenme potansiyeli ≈ −70 mV; Na⁺-K⁺ pompası 3 Na⁺ dışarı, 2 K⁺ içeri',
    'Depolarizasyon: Na⁺ içeri; repolarizasyon: K⁺ dışarı',
    'Miyelin kılıf iletimi hızlandırır (sıçrayarak iletim)',
    'Beyincik: denge ve koordinasyon · Omurilik soğanı: refleks, solunum, kalp atışı',
    'Göz: ışık sırasıyla kornea → göz bebeği → mercek → retina; çubuk hücreler loş ışık, koni hücreler renk'
  ]},
  { c: 'bio', t: 'Hormonlar', l: [
    'Hipofiz: GH, TSH, ACTH, FSH, LH, prolaktin (ön); ADH, oksitosin (arka, hipotalamusta üretilir)',
    'Tiroit: tiroksin (metabolizma), kalsitonin (kan Ca²⁺ ↓)',
    'Paratiroit: parathormon (kan Ca²⁺ ↑)',
    'Pankreas: insülin (kan şekeri ↓), glukagon (kan şekeri ↑)',
    'Böbrek üstü: adrenalin (öz), aldosteron ve kortizol (kabuk)',
    'Epifiz: melatonin (biyolojik saat)'
  ]},
  { c: 'bio', t: 'Sindirim', l: [
    'Ağız: tükürük amilazı (nişasta) · Mide: pepsin (protein), HCl',
    'İnce bağırsak: tripsin, lipaz, amilaz (pankreastan); maltaz, laktaz, sükraz, peptidaz',
    'Safra: yağları emülsiyon hâline getirir, enzim içermez',
    'Emilim çoğunlukla ince bağırsak villuslarında; yağlar lenfe, diğerleri kana geçer'
  ]},
  { c: 'bio', t: 'Dolaşım, Solunum, Boşaltım', l: [
    'Küçük dolaşım: sağ karıncık → akciğer → sol kulakçık',
    'Büyük dolaşım: sol karıncık → vücut → sağ kulakçık',
    'O₂ hemoglobinle taşınır; CO₂ çoğunlukla bikarbonat (HCO₃⁻) olarak',
    'Nefron: süzülme (glomerulus) → geri emilim → salgılama',
    'ADH su geri emilimini, aldosteron Na⁺ geri emilimini artırır',
    'Aktif bağışıklık: aşı/hastalık (kalıcı) · Pasif: serum/anne sütü (geçici)'
  ]},
  { c: 'bio', t: 'Fotosentez ve Solunum', l: [
    'Fotosentez: 6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O (ışık, klorofil)',
    'Işığa bağımlı evre: tilakoit zarı, ATP ve NADPH üretilir, O₂ sudan çıkar',
    'Calvin döngüsü: stroma, CO₂ bağlanır',
    'Oksijenli solunum: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP',
    'Glikoliz sitoplazmada (net 2 ATP); Krebs ve ETS mitokondride',
    'Etil alkol fermantasyonu: CO₂ açığa çıkar · Laktik asit fermantasyonu: CO₂ çıkmaz'
  ]},
  { c: 'bio', t: 'Bitki Biyolojisi', l: [
    'Oksin: uzama, fototropizma · Giberellin: gövde uzaması, tohum çimlenmesi',
    'Sitokinin: hücre bölünmesi · Absisik asit: dormansi, stoma kapanması',
    'Etilen: meyve olgunlaşması, yaprak dökümü',
    'Ksilem: su ve mineral (ölü hücreler) · Floem: organik madde (canlı hücreler)',
    'Kohezyon-gerilim teorisi: terleme suyu yukarı çeker',
    'Çift döllenme: sperm + yumurta → zigot (2n); sperm + kutup çekirdekleri → endosperm (3n)'
  ]},

  // ======================= TÜRKÇE =======================
  { c: 'tr', t: 'Ses Olayları', l: [
    'Sert ünsüzler: <b>FıSTıKÇı ŞaHaP</b> (f, s, t, k, ç, ş, h, p)',
    'Ünsüz benzeşmesi: sert ünsüzle biten sözcüğe c, d, g ile başlayan ek gelince sertleşir (kitapçı)',
    'Ünsüz yumuşaması: p, ç, t, k ünlüyle başlayan ek alınca b, c, d, ğ/g olur (kitabı)',
    'Ünlü düşmesi: ağız → ağzı, burun → burnu',
    'Ünlü daralması: -yor ekinden önce a/e → ı/i/u/ü (başla → başlıyor)',
    'Kaynaştırma ünsüzleri: y, ş, s, n'
  ]},
  { c: 'tr', t: 'Yazım Kuralları', l: [
    'Bağlaç olan "de/da" ayrı yazılır; ek olan bitişik',
    'Bağlaç olan "ki" ayrı yazılır (istisna: belki, oysaki, mademki, sanki, halbuki…)',
    'Soru eki "mi" ayrı yazılır, önceki sözcüğe uyar',
    'Özel adlara gelen ekler kesme işaretiyle ayrılır (kurum adları hariç)',
    'Sayılar ayrı yazılır (on beş); "-er/-ar" üleştirme eki bitişik'
  ]},
  { c: 'tr', t: 'Fiilimsiler', l: [
    '<b>İsim-fiil:</b> -ma, -ış, -mak',
    '<b>Sıfat-fiil:</b> -an, -ası, -mez, -ar, -dık, -acak, -mış',
    '<b>Zarf-fiil:</b> -ıp, -arak, -madan, -ınca, -dıkça, -alı, -ken, -casına, -r … -mez',
    'Fiilimsiler olumsuzluk eki alabilir ama kip ve kişi eki almaz'
  ]},
  { c: 'tr', t: 'Cümlenin Ögeleri ve Çatı', l: [
    'Önce yüklem, sonra özne ("kim/ne?"), sonra nesne ("neyi/ne?")',
    'Dolaylı tümleç: -e, -de, -den hal ekli (nereye, nerede, nereden)',
    'Zarf tümleci: nasıl, ne zaman, niçin, ne kadar',
    'Etken: öznesi belli · Edilgen: -ıl, -ın eki, sözde özne',
    'Geçişli: nesne alabilir · Geçişsiz: nesne alamaz',
    'Dönüşlü: -ın, -ıl (özne işi kendine yapar) · İşteş: -ış (karşılıklı/birlikte)'
  ]},
  { c: 'tr', t: 'Anlatım Bozuklukları', l: [
    'Gereksiz sözcük kullanımı (aynı anlamlı sözcüklerin bir arada kullanılması)',
    'Sözcüğün yanlış anlamda kullanılması',
    'Özne-yüklem uyumsuzluğu, eksik öge (özellikle ortak ögelerde)',
    'Ek fiil eksikliği, çatı uyumsuzluğu',
    'Mantık ve sıralama hataları'
  ]},
  { c: 'tr', t: 'Paragraf Stratejileri', l: [
    'Ana düşünce sorularında genellikle ilk veya son cümleye bak',
    'Anlatım biçimleri: açıklama, tartışma, betimleme, öyküleme',
    'Düşünceyi geliştirme yolları: tanımlama, örneklendirme, karşılaştırma, tanık gösterme, benzetme, sayısal veri',
    'Akışı bozan cümle: konu aynı görünse bile bakış açısı değişen cümle'
  ]}
];
