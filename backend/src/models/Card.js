const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
tc: { type: String, required: true },
kart_num : { type: String, required: true, unique: true },
cvv : { type: String, required: true },
skt : { type: String, required: true },
kart_ismi : { type: String, required: true },
toplam_limit: { type: Number, required: true },
kullanilabilir_limit: { type: Number, required: true },
donem_ici_harcama: {type: Number, required: true},
dou_para:{type: Number, required: true},
ekstre_kesim_tarihi:{type: Date, required: true},
son_odeme_tarihi:{type: Date, required: true},
sonraki_ekstre_kesim_tarihi:{type: Date, required: true},
sonraki_son_odeme_tarihi:{type: Date, required: true},
harcamalar:{type: Array, required: true},
},
{
  timestamps: true
});

module.exports = mongoose.model('Card', cardSchema);
