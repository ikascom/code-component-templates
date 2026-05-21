# ikas Code Components Example Theme

ikas Code Components ile geliştirilmiş, referans olarak kullanılan bir storefront temasıdır. Mağaza editöründe sayfa-sayfa kullanılabilecek hazır section'lar içerir.

## Hızlı Başlangıç

```bash
ikas theme dev
```

ikas editörünü açın ve **Dev Components** panelinden çalışan dev sunucusuna bağlanın.

## Core Sections

Her sayfada görünen temel section'lar. Konfigürasyon tema genelinde ortaktır.

| Section | Amaç |
|---|---|
| `Header` | Üst menü, logo, navigasyon ve site genelindeki tüm chrome yüzeylerinin tetikleyicisi |
| `Footer` | Alt menü, marka bilgisi, hızlı linkler |

## Chrome Surfaces (Header içinde)

Aşağıdaki yüzeyler `Header` ile birlikte gelir; **ayrıca section olarak eklemeniz gerekmez**. Header'ın kendi prop'larından konfigüre edilir.

| Yüzey | Tetiklenme |
|---|---|
| Duyuru Çubuğu | Her zaman (Header üstünde) |
| Sepet Çekmecesi | Sepete ekleme veya sepet ikonu tıklaması |
| Arama Modali | Arama ikonu tıklaması |
| Mobil Çekmece | Hamburger ikonu (mobil) |

## Page Surfaces

Her sayfa tipi için eklenmesi gereken section'lar:

| Sayfa | Amaç | Section(s) |
|---|---|---|
| Anasayfa | Marka vitrini ve alışverişe giriş | `HeroSlider` (veya `SingleHero`), `MultiTabProductSlider`, `MediaLinkGrid`, `ImageWithText`, `RichText`, `BlogSlider`, `Newsletter` |
| Kategori / Marka / Arama (PLP) | Ürünleri listeleme ve filtreleme | `ProductListSection` |
| Ürün Detay (PDP) | Ürün inceleme ve satın alma | `ProductDetail`, `ProductReviews`, `MultiTabProductSlider` (öneri) |
| Sepet | Ödeme öncesi sepet özeti | `Cart` |
| Hesabım | Hesap ana ekranı | `AccountDashboard` |
| Siparişlerim | Sipariş geçmişi ve detayları | `AccountOrders`, `AccountOrderDetail` |
| Adreslerim | Adres defteri yönetimi | `AccountAddresses` |
| Favorilerim | Favori ürünler listesi | `FavoriteProducts` |
| Giriş Yap | Üye girişi | `Login` |
| Kayıt Ol | Yeni üyelik oluşturma | `Register` |
| Şifremi Unuttum | Şifre sıfırlama e-postası talebi | `ForgotPassword` |
| Şifre Sıfırlama | E-postadaki link ile yeni şifre belirleme | `RecoverPassword` |
| Sipariş Takibi (Özel Sayfa) | Misafir sipariş sorgulama | `GuestOrderTracking` |
| Blog | Blog yazıları ve detayları | `BlogList`, `BlogDetail` |
| İletişim (Özel Sayfa) | İletişim formu | `Contact` |
| 404 | Sayfa bulunamadı durumu | `NotFound` |

## Proje Yapısı

```
congara/
├── src/
│   ├── components/        # ikas.config.json'a kayıtlı section ve component'lar
│   ├── sub-components/    # Section'ların içinde kullanılan yardımcı bileşenler
│   ├── global.css         # Scope dışı global stiller
│   └── global-types.ts    # Otomatik üretilen ortak enum tipleri
├── ikas.config.json       # Bileşen kayıtları (CLI tarafından yönetilir)
└── CLAUDE.md              # AI yardımcı kuralları
```
