/*
 * Müfredat ve Tahmini Süre (T.S) verisi.
 *
 * v  = Konu anlatım videolarının toplam süresi (dakika). Kısa (shorts) videolar ve
 *      özet/derleme videoları hariç tutulmuştur. T.S = v × çarpan (Ayarlar > T.S çarpanı, varsayılan 2).
 * ts = Sabit T.S (dakika). Bu alan varsa çarpan uygulanmaz.
 * est = Oynatma listesinde karşılığı olmayan, süresi tahmini girilen konu.
 * sona = TYT matematikte sona bırakılan konu (Bitirilecekler çubuğunda "Sona Kalan" sekmesinde görünür).
 * sozel = Sorumlu olunan sözel ders (yine "Sona Kalan" sekmesinde görünür).
 *
 * Kaynak oynatma listeleri (Kasım 2026'da tarandı):
 *  TYT Türkçe   : Emek Taştan – 10 Günde Dil Bilgisi Kampı
 *  TYT Matematik: Eyüp Boncuk – TYT Matematik Video Dersler
 *  Geometri     : Eyüp B – Geometri VDK 2026 (TYT + AYT)
 *  TYT Fizik    : TYT Fizik Kampı 2027
 *  TYT Kimya    : Görkem Şahin – TYT Kimya 2027
 *  TYT Biyoloji : Dr. Biyoloji – YKS 2027 TYT Kampı
 *  AYT Matematik: Eyüp Boncuk – AYT Matematik Video Dersler
 *  AYT Fizik    : AYT Fizik Kampı 2027
 *  AYT Kimya    : Görkem Şahin – AYT Kimya
 *  AYT Biyoloji : Dr. Biyoloji – YKS 2027 AYT Kampı
 */
window.SUBJECTS = [
  { id: 'tr',   exam: 'TYT', name: 'Türkçe',     short: 'Türkçe', track: 'tr',  color: '#b65a45' },
  { id: 'mat',  exam: 'TYT', name: 'Matematik',  short: 'Mat',    track: 'mat', color: '#8ccfee' },
  { id: 'geo',  exam: 'TYT', name: 'Geometri',   short: 'Geo',    track: 'geo', color: '#9fd8f2' },
  { id: 'fiz',  exam: 'TYT', name: 'Fizik',      short: 'Fizik',  track: 'fiz', color: '#ffb47e' },
  { id: 'kim',  exam: 'TYT', name: 'Kimya',      short: 'Kimya',  track: 'kim', color: '#a9b2ff' },
  { id: 'bio',  exam: 'TYT', name: 'Biyoloji',   short: 'Bio',    track: 'bio', color: '#9ee39a' },
  { id: 'sos',  exam: 'TYT', name: 'Tarih-Coğrafya-Felsefe-Din', short: 'Sosyal', track: 'sos', color: '#4fae6f' },
  { id: 'amat', exam: 'AYT', name: 'Matematik',  short: 'Mat',    track: 'mat', color: '#72bbdf' },
  { id: 'ageo', exam: 'AYT', name: 'Geometri',   short: 'Geo',    track: 'geo', color: '#84c6e6' },
  { id: 'afiz', exam: 'AYT', name: 'Fizik',      short: 'Fizik',  track: 'fiz', color: '#ef9c5f' },
  { id: 'akim', exam: 'AYT', name: 'Kimya',      short: 'Kimya',  track: 'kim', color: '#8d97ef' },
  { id: 'abio', exam: 'AYT', name: 'Biyoloji',   short: 'Bio',    track: 'bio', color: '#80cf7c' }
];

window.TOPICS = [
  // ---------------- TYT TÜRKÇE ----------------
  { id: 'tr-sozcuk-anlam', s: 'tr', n: 'Sözcükte Anlam', v: 90, est: true },
  { id: 'tr-cumle-anlam', s: 'tr', n: 'Cümlede Anlam', v: 90, est: true },
  { id: 'tr-paragraf', s: 'tr', n: 'Paragraf', v: 300, est: true },
  { id: 'tr-ses', s: 'tr', n: 'Ses Bilgisi', v: 39 },
  { id: 'tr-yazim', s: 'tr', n: 'Yazım Kuralları ve Noktalama', v: 37 },
  { id: 'tr-yapi', s: 'tr', n: 'Yapı Bilgisi (Kök-Ek)', v: 23 },
  { id: 'tr-sozcuk-tur', s: 'tr', n: 'Sözcük Türleri', v: 71 },
  { id: 'tr-fiil', s: 'tr', n: 'Fiiller ve Fiil Yapısı', v: 21 },
  { id: 'tr-ekfiil', s: 'tr', n: 'Ek Fiil ve Fiilimsiler', v: 24 },
  { id: 'tr-cati', s: 'tr', n: 'Fiilde Çatı', v: 18 },
  { id: 'tr-ogeler', s: 'tr', n: 'Cümlenin Ögeleri', v: 19 },
  { id: 'tr-cumle-tur', s: 'tr', n: 'Cümle Türleri', v: 18 },
  { id: 'tr-anlatim', s: 'tr', n: 'Anlatım Bozuklukları', v: 45, est: true },

  // ---------------- TYT MATEMATİK ----------------
  { id: 'mat-temel', s: 'mat', n: 'Temel Kavramlar', v: 114 },
  { id: 'mat-tekcift', s: 'mat', n: 'Tek-Çift ve Pozitif-Negatif Sayılar', v: 73 },
  { id: 'mat-ardisik', s: 'mat', n: 'Ardışık Sayılar', v: 75 },
  { id: 'mat-faktoriyel', s: 'mat', n: 'Faktöriyel', v: 59 },
  { id: 'mat-asal', s: 'mat', n: 'Asal Sayılar', v: 46 },
  { id: 'mat-basamak', s: 'mat', n: 'Sayı Basamakları', v: 71 },
  { id: 'mat-bolme', s: 'mat', n: 'Bölme ve Bölünebilme', v: 131 },
  { id: 'mat-asalcarpan', s: 'mat', n: 'Asal Çarpanlara Ayırma', v: 84 },
  { id: 'mat-ebob', s: 'mat', n: 'EBOB-EKOK', v: 112 },
  { id: 'mat-periyodik', s: 'mat', n: 'Periyodik Problemler', v: 42 },
  { id: 'mat-rasyonel', s: 'mat', n: 'Rasyonel ve Ondalık Sayılar', v: 76 },
  { id: 'mat-denklem1', s: 'mat', n: 'Birinci Dereceden Denklemler', v: 80 },
  { id: 'mat-esitsizlik', s: 'mat', n: 'Basit Eşitsizlikler', v: 103 },
  { id: 'mat-mutlak', s: 'mat', n: 'Mutlak Değer', v: 148 },
  { id: 'mat-uslu', s: 'mat', n: 'Üslü Sayılar', v: 134 },
  { id: 'mat-koklu', s: 'mat', n: 'Köklü Sayılar', v: 110 },
  { id: 'mat-carpan', s: 'mat', n: 'Çarpanlara Ayırma', v: 118 },
  { id: 'mat-oran', s: 'mat', n: 'Oran-Orantı', v: 160 },
  { id: 'mat-sayiprob', s: 'mat', n: 'Sayı Problemleri', v: 139 },
  { id: 'mat-kesirprob', s: 'mat', n: 'Kesir Problemleri', v: 88 },
  { id: 'mat-yasprob', s: 'mat', n: 'Yaş Problemleri', v: 44 },
  { id: 'mat-isciprob', s: 'mat', n: 'İşçi Problemleri', v: 79 },
  { id: 'mat-hizprob', s: 'mat', n: 'Hız Problemleri', v: 133 },
  { id: 'mat-yuzde', s: 'mat', n: 'Yüzde, Kâr-Zarar Problemleri', v: 113 },
  { id: 'mat-karisim', s: 'mat', n: 'Karışım Problemleri', v: 73 },
  { id: 'mat-grafik', s: 'mat', n: 'Grafik Problemleri', v: 67 },
  { id: 'mat-kumeler', s: 'mat', n: 'Kümeler ve Kartezyen Çarpım', v: 238 },
  { id: 'mat-fonk1', s: 'mat', n: 'Fonksiyonlar 1 (Tanım, Çeşitler)', v: 274 },
  { id: 'mat-fonk2', s: 'mat', n: 'Fonksiyonlar 2 (Ters, Bileşke, Grafik)', v: 323 },
  { id: 'mat-polinom', s: 'mat', n: 'Polinomlar', v: 217 },
  { id: 'mat-denklem2', s: 'mat', n: '2. Dereceden Denklemler', v: 173 },
  { id: 'mat-karmasik', s: 'mat', n: 'Karmaşık Sayılar', v: 38 },
  { id: 'mat-sayma', s: 'mat', n: 'Sayma ve Permütasyon', v: 253, sona: true },
  { id: 'mat-kombinasyon', s: 'mat', n: 'Kombinasyon', v: 174, sona: true },
  { id: 'mat-binom', s: 'mat', n: 'Binom', v: 67, sona: true },
  { id: 'mat-olasilik', s: 'mat', n: 'Olasılık', v: 98, sona: true },
  { id: 'mat-veri', s: 'mat', n: 'Veri ve İstatistik', v: 70, sona: true },
  { id: 'mat-mantik', s: 'mat', n: 'Mantık', v: 95, sona: true },

  // ---------------- TYT GEOMETRİ ----------------
  { id: 'geo-dogruaci', s: 'geo', n: 'Doğruda Açı', v: 145 },
  { id: 'geo-ucgenaci', s: 'geo', n: 'Üçgende Açı', v: 193 },
  { id: 'geo-dikucgen', s: 'geo', n: 'Dik Üçgen', v: 123 },
  { id: 'geo-ikizkenar', s: 'geo', n: 'İkizkenar ve Eşkenar Üçgen', v: 131 },
  { id: 'geo-aciortay', s: 'geo', n: 'Açıortay', v: 98 },
  { id: 'geo-kenarortay', s: 'geo', n: 'Kenarortay', v: 75 },
  { id: 'geo-aci-kenar', s: 'geo', n: 'Üçgende Açı-Kenar Bağıntıları', v: 63 },
  { id: 'geo-benzerlik', s: 'geo', n: 'Benzerlik', v: 259 },
  { id: 'geo-alan', s: 'geo', n: 'Üçgende Alan', v: 202 },
  { id: 'geo-cokgen', s: 'geo', n: 'Çokgenler', v: 133 },
  { id: 'geo-dortgen', s: 'geo', n: 'Dörtgenler ve Deltoid', v: 85 },
  { id: 'geo-yamuk', s: 'geo', n: 'Yamuk', v: 201 },
  { id: 'geo-paralelkenar', s: 'geo', n: 'Paralelkenar', v: 147 },
  { id: 'geo-eskenardortgen', s: 'geo', n: 'Eşkenar Dörtgen', v: 63 },
  { id: 'geo-dikdortgen', s: 'geo', n: 'Dikdörtgen', v: 104 },
  { id: 'geo-kare', s: 'geo', n: 'Kare', v: 108 },
  { id: 'geo-kati', s: 'geo', n: 'Katı Cisimler', v: 305 },

  // ---------------- TYT FİZİK ----------------
  { id: 'fiz-giris', s: 'fiz', n: 'Fizik Bilimine Giriş', v: 77 },
  { id: 'fiz-madde', s: 'fiz', n: 'Madde ve Özellikleri', v: 118 },
  { id: 'fiz-hareket', s: 'fiz', n: 'Hareket ve Kuvvet', v: 152 },
  { id: 'fiz-enerji', s: 'fiz', n: 'İş, Güç ve Enerji', v: 111 },
  { id: 'fiz-isi', s: 'fiz', n: 'Isı, Sıcaklık ve Genleşme', v: 184 },
  { id: 'fiz-basinc', s: 'fiz', n: 'Basınç', v: 144 },
  { id: 'fiz-kaldirma', s: 'fiz', n: 'Kaldırma Kuvveti', v: 68 },
  { id: 'fiz-elektrostatik', s: 'fiz', n: 'Elektrostatik', v: 97 },
  { id: 'fiz-akim', s: 'fiz', n: 'Elektrik Akımı ve Devreler', v: 145 },
  { id: 'fiz-manyetizma', s: 'fiz', n: 'Mıknatıslar ve Manyetizma', v: 81 },
  { id: 'fiz-dalga', s: 'fiz', n: 'Dalgalara Giriş ve Yay Dalgaları', v: 91 },
  { id: 'fiz-dalga2', s: 'fiz', n: 'Su, Ses ve Deprem Dalgaları', v: 84 },
  { id: 'fiz-aydinlanma', s: 'fiz', n: 'Aydınlanma ve Gölge', v: 66 },
  { id: 'fiz-yansima', s: 'fiz', n: 'Yansıma ve Düzlem Ayna', v: 53 },
  { id: 'fiz-kuresel', s: 'fiz', n: 'Küresel Aynalar', v: 86 },
  { id: 'fiz-kirilma', s: 'fiz', n: 'Işığın Kırılması', v: 58 },
  { id: 'fiz-mercek', s: 'fiz', n: 'Mercekler', v: 97 },
  { id: 'fiz-renk', s: 'fiz', n: 'Prizmalar ve Renk', v: 45 },

  // ---------------- TYT KİMYA ----------------
  { id: 'kim-bilim', s: 'kim', n: 'Kimya Bilimi', v: 245 },
  { id: 'kim-atom', s: 'kim', n: 'Atom Modelleri ve Atomun Yapısı', v: 136 },
  { id: 'kim-periyodik', s: 'kim', n: 'Periyodik Sistem', v: 213 },
  { id: 'kim-etkilesim', s: 'kim', n: 'Kimyasal Türler Arası Etkileşimler', v: 332 },
  { id: 'kim-degisim', s: 'kim', n: 'Fiziksel ve Kimyasal Değişimler', v: 41 },
  { id: 'kim-haller', s: 'kim', n: 'Maddenin Halleri', v: 198 },
  { id: 'kim-doga', s: 'kim', n: 'Doğa ve Kimya', v: 25 },
  { id: 'kim-kanunlar', s: 'kim', n: 'Kimyanın Temel Kanunları', v: 91 },
  { id: 'kim-mol', s: 'kim', n: 'Mol Kavramı', v: 176 },
  { id: 'kim-tepkime', s: 'kim', n: 'Kimyasal Tepkimeler ve Hesaplamalar', v: 304 },
  { id: 'kim-karisim', s: 'kim', n: 'Karışımlar', v: 298 },
  { id: 'kim-asitbaz', s: 'kim', n: 'Asitler, Bazlar ve Tuzlar', v: 218 },
  { id: 'kim-heryerde', s: 'kim', n: 'Kimya Her Yerde', v: 73 },

  // ---------------- TYT BİYOLOJİ ----------------
  { id: 'bio-ortak', s: 'bio', n: 'Canlıların Ortak Özellikleri ve Virüsler', v: 61 },
  { id: 'bio-inorganik', s: 'bio', n: 'İnorganik Bileşikler', v: 38 },
  { id: 'bio-organik', s: 'bio', n: 'Karbonhidrat, Lipit, Protein', v: 64 },
  { id: 'bio-enzim', s: 'bio', n: 'Enzimler ve Vitaminler', v: 57 },
  { id: 'bio-nukleik', s: 'bio', n: 'Nükleik Asitler ve ATP', v: 49 },
  { id: 'bio-hucre', s: 'bio', n: 'Hücre ve Organeller', v: 60 },
  { id: 'bio-zar', s: 'bio', n: 'Hücre Zarı, Madde Geçişleri, Bilimsel Yöntem', v: 63 },
  { id: 'bio-siniflandirma', s: 'bio', n: 'Canlıların Sınıflandırılması', v: 120 },
  { id: 'bio-mitoz', s: 'bio', n: 'Mitoz', v: 38 },
  { id: 'bio-mayoz', s: 'bio', n: 'Mayoz', v: 29 },
  { id: 'bio-ureme', s: 'bio', n: 'Eşeysiz ve Eşeyli Üreme', v: 46 },
  { id: 'bio-kalitim', s: 'bio', n: 'Kalıtım', v: 98 },
  { id: 'bio-ekoloji', s: 'bio', n: 'Ekoloji ve Güncel Çevre Sorunları', v: 80 },

  // ---------------- TYT SOSYAL (sorumlu olunan sözel) ----------------
  { id: 'sos-hepsi', s: 'sos', n: 'Tarih-Coğrafya-Felsefe-Din', ts: 960, sozel: true },

  // ---------------- AYT MATEMATİK ----------------
  { id: 'amat-polinom', s: 'amat', n: 'Polinomlar', v: 130 },
  { id: 'amat-polbolme', s: 'amat', n: 'Polinomlarda Bölme', v: 202 },
  { id: 'amat-denklem2', s: 'amat', n: 'İkinci Dereceden Denklemler', v: 191 },
  { id: 'amat-parabol', s: 'amat', n: 'Parabol', v: 313 },
  { id: 'amat-esitsizlik', s: 'amat', n: '2. Dereceden Eşitsizlikler', v: 285 },
  { id: 'amat-fonkuyg', s: 'amat', n: 'Fonksiyon Uygulamaları', v: 213 },
  { id: 'amat-trig1', s: 'amat', n: 'Trigonometri 1 (Birim Çember, Özdeşlikler)', v: 227 },
  { id: 'amat-trig2', s: 'amat', n: 'Trigonometri 2 (İndirgeme, Sin-Cos Teoremi, Grafik)', v: 264 },
  { id: 'amat-trig3', s: 'amat', n: 'Trigonometri 3 (Toplam-Fark, Denklemler)', v: 224 },
  { id: 'amat-log', s: 'amat', n: 'Logaritma', v: 333 },
  { id: 'amat-diziler', s: 'amat', n: 'Diziler', v: 245 },
  { id: 'amat-limit', s: 'amat', n: 'Limit ve Süreklilik', v: 298 },
  { id: 'amat-turev1', s: 'amat', n: 'Türev 1 (Tanım ve Kurallar)', v: 263 },
  { id: 'amat-turev2', s: 'amat', n: 'Türev 2 (Geometrik Yorum, Artan-Azalan)', v: 354 },
  { id: 'amat-turev3', s: 'amat', n: 'Türev 3 (Ekstremum, Maks-Min, Grafik)', v: 262 },
  { id: 'amat-integral1', s: 'amat', n: 'Belirsiz İntegral', v: 190 },
  { id: 'amat-integral2', s: 'amat', n: 'Belirli İntegral ve Alan', v: 420 },
  { id: 'amat-kosullu', s: 'amat', n: 'Koşullu Olasılık', v: 97, sona: true },

  // ---------------- AYT GEOMETRİ ----------------
  { id: 'ageo-cemberaci', s: 'ageo', n: 'Çemberde Açı', v: 126 },
  { id: 'ageo-cemberuzunluk', s: 'ageo', n: 'Çemberde Uzunluk', v: 152 },
  { id: 'ageo-daire', s: 'ageo', n: 'Dairede Alan', v: 80 },
  { id: 'ageo-nokta', s: 'ageo', n: 'Noktanın Analitiği', v: 115 },
  { id: 'ageo-dogru', s: 'ageo', n: 'Doğrunun Analitiği', v: 260 },
  { id: 'ageo-donusum', s: 'ageo', n: 'Dönüşümler', v: 163 },
  { id: 'ageo-cemberanalitik', s: 'ageo', n: 'Çemberin Analitiği', v: 107 },

  // ---------------- AYT FİZİK ----------------
  { id: 'afiz-trig', s: 'afiz', n: 'Fizik için Trigonometri', v: 41 },
  { id: 'afiz-vektor', s: 'afiz', n: 'Vektörler', v: 98 },
  { id: 'afiz-bagil', s: 'afiz', n: 'Bağıl Hareket', v: 77 },
  { id: 'afiz-newton', s: 'afiz', n: 'Newton’un Hareket Yasaları', v: 126 },
  { id: 'afiz-ivmeli', s: 'afiz', n: 'Bir Boyutta Sabit İvmeli Hareket', v: 128 },
  { id: 'afiz-atislar', s: 'afiz', n: 'Atışlar', v: 51 },
  { id: 'afiz-enerji', s: 'afiz', n: 'İş, Güç ve Enerji', v: 122 },
  { id: 'afiz-momentum', s: 'afiz', n: 'İtme ve Momentum', v: 192 },
  { id: 'afiz-tork', s: 'afiz', n: 'Tork ve Denge', v: 102 },
  { id: 'afiz-kutlemerkez', s: 'afiz', n: 'Kütle ve Ağırlık Merkezi', v: 58 },
  { id: 'afiz-basitmakine', s: 'afiz', n: 'Basit Makineler', v: 101 },
  { id: 'afiz-elektrikalan', s: 'afiz', n: 'Elektrik Alan ve Potansiyel', v: 106 },
  { id: 'afiz-siga', s: 'afiz', n: 'Paralel Levhalar ve Sığa', v: 57 },
  { id: 'afiz-manyetik', s: 'afiz', n: 'Manyetik Alan ve Manyetik Kuvvet', v: 83 },
  { id: 'afiz-induksiyon', s: 'afiz', n: 'Elektromanyetik İndüksiyon', v: 75 },
  { id: 'afiz-alternatif', s: 'afiz', n: 'Alternatif Akım ve Transformatörler', v: 73 },
  { id: 'afiz-cembersel', s: 'afiz', n: 'Çembersel Hareket', v: 144 },
  { id: 'afiz-donme', s: 'afiz', n: 'Dönme, Yuvarlanma ve Açısal Momentum', v: 108 },
  { id: 'afiz-kutlecekim', s: 'afiz', n: 'Kütle Çekim ve Kepler Yasaları', v: 78 },
  { id: 'afiz-bhh', s: 'afiz', n: 'Basit Harmonik Hareket', v: 116 },
  { id: 'afiz-dalga', s: 'afiz', n: 'Dalga Mekaniği ve EM Dalgalar', v: 85 },
  { id: 'afiz-atom', s: 'afiz', n: 'Atom Modelleri', v: 75 },
  { id: 'afiz-parcacik', s: 'afiz', n: 'Büyük Patlama ve Parçacık Fiziği', v: 43 },
  { id: 'afiz-radyoaktivite', s: 'afiz', n: 'Radyoaktivite', v: 54 },
  { id: 'afiz-gorelilik', s: 'afiz', n: 'Özel Görelilik', v: 45 },
  { id: 'afiz-siyahcisim', s: 'afiz', n: 'Siyah Cisim Işıması', v: 31 },
  { id: 'afiz-fotoelektrik', s: 'afiz', n: 'Fotoelektrik Olay', v: 58 },
  { id: 'afiz-compton', s: 'afiz', n: 'Compton Saçılması ve de Broglie', v: 26 },
  { id: 'afiz-modern', s: 'afiz', n: 'Modern Fiziğin Teknolojideki Uygulamaları', v: 44 },

  // ---------------- AYT KİMYA ----------------
  { id: 'akim-atom', s: 'akim', n: 'Modern Atom Teorisi', v: 328 },
  { id: 'akim-gazlar', s: 'akim', n: 'Gazlar', v: 371 },
  { id: 'akim-cozelti', s: 'akim', n: 'Sıvı Çözeltiler ve Çözünürlük', v: 436 },
  { id: 'akim-enerji', s: 'akim', n: 'Kimyasal Tepkimelerde Enerji', v: 200 },
  { id: 'akim-hiz', s: 'akim', n: 'Kimyasal Tepkimelerde Hız', v: 159 },
  { id: 'akim-denge', s: 'akim', n: 'Kimyasal Tepkimelerde Denge', v: 180 },
  { id: 'akim-suludenge', s: 'akim', n: 'Sulu Çözelti Dengeleri', v: 307 },
  { id: 'akim-elektrik', s: 'akim', n: 'Kimya ve Elektrik', v: 284 },
  { id: 'akim-karbon', s: 'akim', n: 'Karbon Kimyasına Giriş', v: 102 },
  { id: 'akim-organik', s: 'akim', n: 'Organik Bileşikler', v: 366 },

  // ---------------- AYT BİYOLOJİ ----------------
  { id: 'abio-sinir', s: 'abio', n: 'Sinir Sistemi', v: 113 },
  { id: 'abio-endokrin', s: 'abio', n: 'Endokrin Sistem', v: 105 },
  { id: 'abio-duyu', s: 'abio', n: 'Duyu Organları', v: 104 },
  { id: 'abio-destek', s: 'abio', n: 'Destek ve Hareket Sistemi', v: 93 },
  { id: 'abio-sindirim', s: 'abio', n: 'Sindirim Sistemi', v: 98 },
  { id: 'abio-dolasim', s: 'abio', n: 'Dolaşım, Lenf ve Bağışıklık', v: 160 },
  { id: 'abio-solunum', s: 'abio', n: 'Solunum Sistemi', v: 68 },
  { id: 'abio-uriner', s: 'abio', n: 'Üriner (Boşaltım) Sistem', v: 59 },
  { id: 'abio-ureme', s: 'abio', n: 'Üreme Sistemi ve Embriyonik Gelişim', v: 83 },
  { id: 'abio-ekoloji', s: 'abio', n: 'Komünite ve Popülasyon Ekolojisi', v: 85 },
  { id: 'abio-genetik', s: 'abio', n: 'Nükleik Asitler, Genetik Kod, Protein Sentezi', v: 116 },
  { id: 'abio-biyotek', s: 'abio', n: 'Biyoteknoloji ve Gen Mühendisliği', v: 62 },
  { id: 'abio-fotosentez', s: 'abio', n: 'Fotosentez ve Kemosentez', v: 70 },
  { id: 'abio-solunum2', s: 'abio', n: 'Hücresel Solunum ve Fermantasyon', v: 81 },
  { id: 'abio-bitki1', s: 'abio', n: 'Bitki Biyolojisi 1 (Doku, Organ, Taşıma)', v: 184 },
  { id: 'abio-bitki2', s: 'abio', n: 'Bitki Biyolojisi 2 (Hormon, Hareket, Üreme)', v: 88 },
  { id: 'abio-cevre', s: 'abio', n: 'Canlılar ve Çevre', v: 22 }
];

/* Konuya bağlı olmayan genel çalışma blokları (haftalık plana sürüklenebilir). */
window.GENERIC_BLOCKS = [
  { id: 'g-deneme', n: 'Deneme Sınavı', color: '#e2c26b', dur: 165 },
  { id: 'g-soru', n: 'Soru Çözümü', color: '#c9a0ff', dur: 60 },
  { id: 'g-tekrar', n: 'Genel Tekrar', color: '#7fd6c8', dur: 60 },
  { id: 'g-paragraf', n: 'Paragraf Rutini', color: '#d9876f', dur: 30 },
  { id: 'g-problem', n: 'Problem Rutini', color: '#7fb8e0', dur: 30 },
  { id: 'g-analiz', n: 'Deneme Analizi', color: '#e0a86b', dur: 45 }
];
