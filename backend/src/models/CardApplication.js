const mongoose = require('mongoose');

const cardApplicationSchema = new mongoose.Schema({
  tc: { type: String, required: true },
  kart_ismi: { type: String, required: true },
  limit_request: { type: Number, required: true },
  aylik_gelir: { type: Number, required: true },
  calisma_durumu: { type: String, required: true },
  status: { 
      type: String, 
      enum: ['Beklemede', 'Onaylandı', 'Reddedildi'], 
      default: 'Beklemede' 
  }, 
  rejection_reason: { type: String }
},
{
  timestamps: true
});

module.exports = mongoose.model('CardApplication', cardApplicationSchema);
