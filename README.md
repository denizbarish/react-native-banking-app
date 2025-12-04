# 🏦 DOU Mobile Banking (Next Generation Finance App)

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

> **Doğuş Üniversitesi - Bilgisayar Programcılığı 2. Sınıf Final Projesi**

Bu proje, modern finansal teknolojileri simüle etmek amacıyla geliştirilmiş, **MERN Stack** (MongoDB, Express, React Native, Node.js) mimarisini temel alan kapsamlı bir mobil bankacılık uygulamasıdır. Kullanıcıların hesap yönetimi, para transferi ve kredi hesaplama gibi işlemleri güvenli bir sunucu üzerinden gerçekleştirmesini sağlar.

---

## 📱 Proje Özellikleri ve Modüller

### 🔐 1. Kimlik Doğrulama & Güvenlik (Auth)
* **JWT (JSON Web Token):** Kullanıcı oturumlarının güvenli bir şekilde yönetilmesi.
* **Secure Storage:** Hassas verilerin cihaz üzerinde şifreli saklanması.
* Giriş ve Kayıt (Login/Register) süreçleri.

### 💳 2. Hesap ve Varlık Yönetimi
* **Dinamik IBAN Algoritması:** Her yeni kullanıcı için benzersiz ve geçerli formatta IBAN oluşturulması.
* **Bakiye Takibi:** Anlık hesap bakiyesi ve varlık görüntüleme.
* **Hesap Hareketleri:** Gelen ve giden tüm transferlerin zaman damgasıyla listelenmesi.

### 💸 3. Para Transferi Sistemi (Core)
* **Validasyonlar:** Bakiye yetersizliği, hatalı IBAN veya kendine transfer gibi durumların engellenmesi.
* **Transaction (İşlem) Kaydı:** Her transferin MongoDB veritabanında atomik bir işlem olarak kaydedilmesi (ACID prensipleri).
* Alıcı ismi sorgulama ve doğrulama.

### 📈 4. Finansal Araçlar
* **Kredi Hesaplama Motoru:** Girilen vade ve tutara göre faiz oranını ve aylık taksitleri hesaplayan algoritma.
* Döviz/Varlık grafiksel gösterimi (Opsiyonel).

---

## 🛠 Teknik Mimari

Proje **Client-Server** mimarisi ile geliştirilmiştir. Mobil uygulama doğrudan veritabanına erişmez, RESTful API aracılığıyla haberleşir.

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Frontend (Mobil)** | React Native | Kullanıcı arayüzü ve state yönetimi. |
| **Backend (API)** | Node.js & Express | İş mantığı, routing ve güvenlik kontrolleri. |
| **Veritabanı** | MongoDB (Atlas) | Kullanıcı, hesap ve işlem verilerinin tutulduğu NoSQL yapı. |
| **ODM** | Mongoose | Veri modelleme ve şema validasyonu. |

---

## 📸 Ekran Görüntüleri

*(Geliştirme süreci tamamlandığında güncel ekran görüntüleri eklenecektir)*

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için hem sunucuyu (Backend) hem de mobil uygulamayı (Frontend) ayağa kaldırmanız gerekir.

### Ön Gereksinimler
* Node.js (v14+)
* MongoDB Connection String (Atlas URI)
* React Native Geliştirme Ortamı (Android Studio / Xcode)

### 1. Backend Kurulumu (Server)
```bash
cd server
npm install
# .env dosyasını oluşturun ve MONGO_URI bilginizi girin.
npm start
# Server http://localhost:5000 adresinde çalışacaktır.
