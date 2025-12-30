const Card = require('../models/Card');
const Account = require('../models/Account');

const CardApplication = require('../models/CardApplication');

const getCards = async (req, res) => {
  try {
    const { tc } = req.query;
    if (!tc) {
        return res.status(400).json({ message: 'TC Kimlik No gerekli.' });
    }

    const cards = await Card.find({ tc });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCardApplications = async (req, res) => {
    try {
        const { tc } = req.query;
        if(!tc) return res.status(400).json({ message: 'TC gerekli' });
        
        const applications = await CardApplication.find({ tc }).sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const applyForCard = async (req, res) => {
  try {
    const { tc, kart_ismi, limit_request, aylik_gelir, calisma_durumu } = req.body;

    if (!tc || !kart_ismi || !limit_request || !aylik_gelir || !calisma_durumu) {
        return res.status(400).json({ message: 'Tüm alanlar zorunludur (TC, İsim, Limit, Gelir, Çalışma).' });
    }

    const account = await Account.findOne({ tc_kimlik: tc });
    if (!account) {
        return res.status(404).json({ message: 'Banka hesabı bulunamadı.' });
    }

    const newApp = new CardApplication({
        tc,
        kart_ismi,
        limit_request,
        aylik_gelir,
        calisma_durumu
    });

    await newApp.save();
    res.status(201).json({ message: 'Kart başvurunuz alındı. Onay bekleniyor.', application: newApp });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCardDetail = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ message: 'Kart bulunamadı' });
        res.status(200).json(card);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getCards,
    applyForCard,
    getCardApplications,
    getCardDetail
};
