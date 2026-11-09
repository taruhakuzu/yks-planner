# YKS Planlayıcı

Sayısal öğrencileri için **tamamen çevrimdışı** çalışan, koyu temalı bir YKS çalışma planlayıcısı.
Aylık takvim, sürükle-bırak haftalık program, konu bazlı tahmini süre (T.S) takibi, deneme net grafiği,
hap bilgiler ve periyodik tablo tek uygulamada.

- İnternet bağlantısı **hiçbir zaman** kullanılmaz; tüm veriler yalnızca kendi bilgisayarında durur.
- Kurulum gerektirmez: Windows 10/11'de hazır bulunan Microsoft Edge'i "uygulama penceresi" olarak kullanır
  (Edge yoksa Chrome veya Brave de olur).

---

## Kurulum (ilk kez)

1. Bu sayfada yeşil **Code** düğmesine tıkla, **Download ZIP** seç.
   (Git kullanıyorsan: `git clone <depo-adresi>`)
2. ZIP'i kalıcı bir klasöre çıkar (ör. `Belgeler\YKS Planlayici`). İndirilenler klasöründen çalıştırma; sonra silebilirsin.
3. Klasördeki **`Kisayol Olustur.cmd`** dosyasına çift tıkla.
   Masaüstüne ve Başlat menüsüne ikonlu **YKS Planlayıcı** kısayolu eklenir.
4. Artık masaüstündeki **YKS Planlayıcı** simgesine çift tıklayarak uygulamayı açabilirsin.

> Kısayol istemiyorsan doğrudan **`YKS Planlayici.cmd`** dosyasına çift tıklaman da yeterli.
>
> Windows "Bilinmeyen yayımcı / SmartScreen" uyarısı gösterirse **Ek bilgi → Yine de çalıştır** de.
> Dosyalar düz metindir; içeriğini Not Defteri ile açıp inceleyebilirsin.

## Güncelleme

Yeni sürümü indirip eski klasörün üzerine çıkarman (veya `git pull`) yeterli.
**Verilerin kaybolmaz**, çünkü uygulama klasöründe değil `%LOCALAPPDATA%\YKSPlanlayici` içinde saklanır.

## Verilerim nerede? Yedek nasıl alınır?

- Veriler bilgisayarına özeldir; arkadaşınla aynı uygulamayı kullansanız da planlarınız ayrı tutulur.
- **Ayarlar → Veri ve yedek → Yedek dosyası indir** ile tüm verilerini tek bir `.json` dosyasına kaydedebilirsin.
  Bilgisayar değiştirirken veya planını birine göndermek istediğinde **Yedekten geri yükle** ile içeri al.
- Uygulama her gün ilk açılışta otomatik bir günlük kopya da saklar (Ayarlar'dan geri dönülebilir).
- 14 günden uzun süre yedek almazsan uygulama sana hatırlatır.

---

## Özellikler

### Ana ekran — Takvim
- İçinde bulunduğun ay açılır; ‹ › düğmeleri, ← → tuşları veya fare tekerleği ile ay değiştirilir.
- Her gün planlanan süreyi, ders renklerini ve ilk konuları gösterir. Güne tıklayınca o haftanın programı açılır.
- Sağdaki sütunda her haftanın onaylı toplam saati görünür.
- Altta, takvimden ayrı renkte **YKS'ye kalan süre** sayacı saniye saniye güncellenir; toplam çalışma, genel ilerleme ve
  "günlük gereken tempo" (kalan T.S ÷ kalan gün) burada.

### Gün renkleri (onaylanan günler)
| Renk | Koşul (varsayılan) |
|---|---|
| Yeşil | 8 saat ve üzeri |
| Turuncu-yeşil | 6 saat ve üzeri |
| Turuncu | 4 saat ve üzeri |
| Koyu turuncu | 1–4 saat arası |
| Kırmızı | 1 saat veya az |
| **Mavi (mola günü)** | Az çalışılan gün, ama haftanın **diğer günlerinin** toplamı 40 saati geçmiş |

Eşiklerin hepsi Ayarlar'dan değiştirilebilir. Renkler hem aylık takvimde hem haftalık ekranda görünür.

### Haftalık plan
- 07:00 – 02:00 arası saat ızgarası (Ayarlar'dan değiştirilebilir).
- Sağdaki **Bitirilecekler** çubuğundan konuyu sürükleyip istediğin saate bırak.
- Bloğu sürükleyerek taşı, **üst/alt kenarından** tutarak uzat-kısalt. Alt tuşuyla sürüklersen kopyası taşınır.
- Boş alanda sürükleyerek çoklu seçim; Ctrl+tık ile tek tek seçim.
- Ctrl+C / Ctrl+X / Ctrl+V / Ctrl+D / Delete / Ctrl+Z / Ctrl+Y tamamen çalışır.
- Her günün altında **Onayla** tiki var. Onaylanan günün süreleri konuların T.S'sinden otomatik düşülür
  ve gün rengini alır.
- Sağ tık menüleri: blok (düzenle, kopyala, sil, konuyu bitir), gün (kopyala, ertesi güne kopyala, temizle), hafta (sonraki haftaya kopyala).

### Bitirilecekler çubuğu
- Konular **temelden ileriye** sıralanır: her dersin TYT + AYT konuları kendi içinde sıralanır, sonra tüm dersler
  göreli ilerlemelerine göre harmanlanır. Böylece listenin başında her dersin temel konuları, sonunda ileri konular olur.
- Üstteki küçük kayan düğme ile **Sona kalan** sekmesine geçilir: TYT matematikte sona bırakılan konular
  (sayma, permütasyon, kombinasyon, binom, olasılık, veri, mantık) ve sözel dersler (Tarih-Coğrafya-Felsefe-Din) burada.
- Bir konuya **sağ tıklayıp "Bitirildi — tekrar edilecek"** dersen **Bitirilenler** klasörüne taşınır.
- **Tekrar** sekmesinde bitirilen konular son tekrar tarihine göre durur; tekrar için takvime sürüklenebilir.
- Deneme sınavı, soru çözümü, paragraf/problem rutini gibi genel bloklar da sürüklenebilir.

### Dersler ekranı
- Her konunun video süresi, T.S'si, çalışılan ve kalan süresi; alttaki çubukta dersin tamamlanma yüzdesi.
- T.S'yi tıklayıp elle değiştirebilir, kendi konunu ekleyebilir, istemediğin konuyu gizleyebilirsin.

### T.S (Tahmini Süre) sistemi
T.S = konu anlatım videolarının toplam süresi × **çarpan** (varsayılan **2×**, Ayarlar'dan değiştirilebilir).
Süreler aşağıdaki oynatma listelerindeki videolar tek tek toplanarak hesaplandı (kısa "shorts" ve özet videolar hariç):

| Ders | Kaynak | Toplam video |
|---|---|---|
| TYT Türkçe | Emek Taştan – 10 Günde Dil Bilgisi Kampı | ~4,5 sa |
| TYT Matematik | Eyüp Boncuk – TYT Matematik Video Dersler | ~76 sa |
| Geometri (TYT+AYT) | Eyüp B – Geometri VDK 2026 | ~57 sa |
| TYT Fizik | TYT Fizik Kampı 2027 | ~29 sa |
| TYT Kimya | Görkem Şahin – TYT Kimya 2027 | ~39 sa |
| TYT Biyoloji | Dr. Biyoloji – YKS 2027 TYT Kampı | ~13 sa |
| AYT Matematik | Eyüp Boncuk – AYT Matematik Video Dersler | ~75 sa |
| AYT Fizik | AYT Fizik Kampı 2027 | ~40 sa |
| AYT Kimya | Görkem Şahin – AYT Kimya | ~45 sa |
| AYT Biyoloji | Dr. Biyoloji – YKS 2027 AYT Kampı | ~26 sa |
| Tarih-Coğrafya-Felsefe-Din | — | sabit 16 sa |

Oynatma listesinde karşılığı olmayan birkaç Türkçe konusu (sözcükte/cümlede anlam, paragraf, anlatım bozuklukları)
tahmini süreyle eklendi ve uygulamada "tahmini" etiketiyle gösterilir.

### Denemeler
- TYT ve AYT için ders ders doğru/yanlış girişi (net otomatik: 4 yanlış 1 doğruyu götürür) veya yalnızca toplam net.
- Toplam ve ders bazlı net grafiği, hedef net çizgisi, son/ortalama/en yüksek net ve son 5 deneme eğilimi.

### Hap bilgiler
- Matematik, geometri, fizik, kimya, biyoloji ve Türkçe için formül ve özet kartları; tümünde arama ve favoriler.
- Etkileşimli **periyodik tablo** (118 element, Türkçe adlar, kütle, grup/periyot, elektron dizilimi; yön tuşları ve
  harf yazarak gezinme).
- **Notlarım**: kendi formül ve notlarını ekle.

### Bitirilenler
Bitirilen konular, aralıklı tekrar önerisiyle (1 → 3 → 7 → 14 → 30 → 60 gün) listelenir. "Tekrar ettim" ile kayıt düşülür.

---

## Klavye kısayolları

| Kısayol | İşlev |
|---|---|
| Ctrl+Z / Ctrl+Y | Geri al / yinele |
| Alt+← , Backspace, fare geri tuşu | Önceki ekran |
| Alt+Home | Ana ekran (takvim) |
| Alt+1 … Alt+7 | Menüdeki ekranlar |
| Esc | Pencereyi kapat / seçimi kaldır / geri |
| Ctrl+F | Arama |
| F1 | Tüm kısayollar |
| Ctrl + / Ctrl − / Ctrl 0 | Yakınlaştır / uzaklaştır / sıfırla |
| F11 | Tam ekran |

Haftalık plana özel kısayollar uygulamada **F1** ile görülebilir.

## Sorun giderme

- **Uygulama açılmıyor:** `YKS Planlayici.cmd` dosyasını komut isteminde `"YKS Planlayici.cmd" --test` ile çalıştır;
  bulunan tarayıcıyı ve adresi gösterir.
- **Pencere normal tarayıcı sekmesi olarak açıldı:** Edge/Chrome/Brave bulunamamış demektir. Microsoft Edge'i kurman yeterli.
- **Veriler görünmüyor:** Farklı tarayıcıyla açıldıysa veriler o tarayıcının profilindedir. Yedek dosyasıyla taşıyabilirsin.

## Klasör yapısı

```
YKS Planlayici.cmd      → uygulamayı başlatır
Kisayol Olustur.cmd     → masaüstü + Başlat menüsü kısayolu
app/
  index.html            → uygulama
  css/style.css         → tema
  js/                   → uygulama kodu (store, ui, app, views/…)
  js/data/              → müfredat + T.S, formüller, periyodik tablo, motivasyon sözleri
  icon.ico, icon.png
```

Müfredatı veya T.S'leri kalıcı olarak değiştirmek istersen `app/js/data/curriculum.js` dosyasını düzenle.
