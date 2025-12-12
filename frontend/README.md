# DOU BANK - Frontend

DOU Bank mobil bankacılık uygulaması - React Native ile geliştirilmiştir.

## Özellikler

- ✅ Profesyonel giriş ekranı
- ✅ Koyu kırmızı & beyaz tema
- ✅ React Native Paper UI kütüphanesi
- ✅ API servisleri hazır (Backend bağlantısı için)
- ✅ Responsive tasarım

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. iOS için (Mac gerekli):
```bash
cd ios && pod install && cd ..
```

3. Uygulamayı başlatın:
```bash
# Expo ile
npm start

# iOS
npm run ios

# Android
npm run android
```

## Proje Yapısı

```
frontend/
├── src/
│   ├── screens/
│   │   └── LoginScreen.js       # Giriş ekranı
│   ├── services/
│   │   └── authService.js       # API servisleri
│   └── theme/
│       ├── colors.js            # Renk paleti
│       └── theme.js             # Tema ayarları
├── App.js                        # Ana uygulama
└── package.json
```

## API Entegrasyonu

API servisleri `src/services/authService.js` dosyasında hazır durumda:

### Kullanılabilir Servisler:

**Authentication:**
- `authService.login(email, password)` - Giriş yap
- `authService.register(userData)` - Kayıt ol
- `authService.logout()` - Çıkış yap
- `authService.forgotPassword(email)` - Şifre sıfırlama

**Account:**
- `accountService.getAccounts()` - Hesapları getir
- `accountService.getAccountById(id)` - Hesap detayı
- `accountService.createAccount(data)` - Yeni hesap

**Transaction:**
- `transactionService.getTransactions(accountId)` - İşlemleri getir
- `transactionService.getTransactionById(id)` - İşlem detayı
- `transactionService.createTransaction(data)` - Para transferi

### Backend URL'i Değiştirme:

`src/services/authService.js` dosyasında:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## Renk Paleti

- **Primary (Koyu Kırmızı):** `#8B0000`
- **Secondary (Beyaz):** `#FFFFFF`
- **Background:** `#F5F5F5`
- **Text:** `#1A1A1A`

## Ekranlar

### 1. Login Screen (Giriş Ekranı)
- Email ve şifre girişi
- Form validasyonu
- Loading state
- Hata mesajları
- "Şifremi Unuttum" linki
- "Kayıt Ol" linki

## Yapılacaklar

- [ ] Navigation sistemi ekle
- [ ] AsyncStorage token yönetimi
- [ ] Register ekranı
- [ ] Dashboard ekranı
- [ ] Account ekranları
- [ ] Transaction ekranları
- [ ] Profil ekranı

## Teknolojiler

- React Native
- Expo
- React Native Paper
- Axios
- React Navigation (hazır)
