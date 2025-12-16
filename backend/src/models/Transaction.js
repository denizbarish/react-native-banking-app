const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
dekont_url: { type: String, required: true, unique: true },
alici_ıban: { type: String, required: true, match: /^TR[0-9]{24}$/ },
gonderici_ıban: { type: String, required: true, match: /^TR[0-9]{24}$/ },
gonderici_ad_soyad: { type: String, required: true },
alici_ad_soyad: { type: String, required: true },
miktar: { type: Number, required: true, min: 0.01 },
islem_tarihi: { type: Date, default: Date.now},
kesinti_tutari: { type: Number, required: true, min: 0.00 },
<<<<<<< HEAD
}, {
=======
},
{
>>>>>>> def11cbb20072004c464e1d14753507cf5356fc6
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
