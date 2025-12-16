const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  tc_kimlik: { type: String, required: true, unique: true, match: /^[1-9][0-9]{10}$/ },
  sifre: { type: String, required: true },
  telefon: { type: String, match: /^0[0-9]{10}$/, required: true },
  sms_onay: { type: Boolean, default: false },
  hesap_turu: {type: String,enum: [ 'Vadesiz Hesap' , 'Vadeli Hesap' , 'Yatırım / Döviz Hesabı' , 'Kredi Kartı' ],default: [], required: true },
  aylik_gelir: {type: String,enum: ['0 - 10.000 TL','10.000 - 25.000 TL','25.000 - 50.000 TL','50.000 - 100.000 TL','100.000 TL üzeri'],required: true},
  mal_varlik: {type: Array,enum: [ 'Maaş', 'Kira' , 'Araç' , 'Miras' ],default: [], required: true },
  islem_hacmi: {type: String,enum: ['0 - 50.000 TL','50.000 - 100.000 TL','100.000 - 500.000 TL','500.000 TL üzeri'],required: true},
  egitim_durumu: { type: String,enum: ['İlkokul','Ortaokul','Lise','Ön Lisans','Lisans','Yüksek Lisans','Doktora'],required: true},
  calisma_durumu: { type: String,enum: ['Çalışıyor','Çalışmıyor','Emekli','Öğrenci'],required: true},
  calisma_sektoru: { type: String,enum: ['Kamu','Özel Sektör','Serbest Meslek','Ticaret','Diğer'],required: true}
}, {
timestamps: true
});

module.exports = mongoose.model('Account', accountSchema);
