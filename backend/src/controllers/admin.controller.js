const Account = require('../models/Account');
const SystemSetting = require('../models/SystemSetting');

const getApplications = async (req, res) => {
  try {
    const accounts = await Account.find({}).sort({ createdAt: -1 });
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Beklemede', 'Onaylandı', 'Reddedildi'].includes(status)) {
        return res.status(400).json({ message: 'Geçersiz durum' });
    }

    const account = await Account.findByIdAndUpdate(
      id,
      { basvuru_durumu: status },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ message: 'Hesap bulunamadı' });
    }

    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSystemSettings = async (req, res) => {
    try {
        let settings = await SystemSetting.findOne({ key: 'interest_rates' });
        if (!settings) {
            
            settings = await SystemSetting.create({
                key: 'interest_rates',
                value: {
                    vadeli_mevduat: 45,
                    kredi_karti_gecikme: 3.66,
                    ihtiyac_kredisi: 4.19
                }
            });
        }
        res.json(settings.value);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSystemSettings = async (req, res) => {
    try {
        const settings = await SystemSetting.findOneAndUpdate(
            { key: 'interest_rates' },
            { value: req.body },
            { new: true, upsert: true }
        );
        res.json(settings.value);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const CardApplication = require('../models/CardApplication');
const Card = require('../models/Card');


const getCardApplications = async (req, res) => {
    try {
        const applications = await CardApplication.find({ status: 'Beklemede' }).sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const approveCardApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const app = await CardApplication.findById(id);
        
        if (!app) return res.status(404).json({ message: 'Başvuru bulunamadı' });
        if (app.status !== 'Beklemede') return res.status(400).json({ message: 'Başvuru zaten sonuçlanmış' });


        const kart_num = '4' + Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0');
        const cvv = Math.floor(Math.random() * 900 + 100).toString(); 
        
        const today = new Date();
        const expiryYear = today.getFullYear() + 3;
        const expiryMonth = (today.getMonth() + 1).toString().padStart(2, '0');
        const skt = `${expiryMonth}/${expiryYear.toString().slice(-2)}`;

        const ekstre_kesim = new Date();
        ekstre_kesim.setDate(1); 
        const son_odeme = new Date();
        son_odeme.setDate(10); 

        const newCard = new Card({
            tc: app.tc,
            kart_num,
            cvv,
            skt,
            kart_ismi: app.kart_ismi,
            toplam_limit: app.limit_request,
            kullanilabilir_limit: app.limit_request,
            donem_ici_harcama: 0,
            dou_para: 0,
            ekstre_kesim_tarihi: ekstre_kesim,
            son_odeme_tarihi: son_odeme,
            sonraki_ekstre_kesim_tarihi: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            sonraki_son_odeme_tarihi: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            harcamalar: []
        });

        await newCard.save();

        app.status = 'Onaylandı';
        await app.save();

        res.status(200).json({ message: 'Başvuru onaylandı ve kart oluşturuldu.', card: newCard });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const rejectCardApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const app = await CardApplication.findById(id);
        
        if (!app) return res.status(404).json({ message: 'Başvuru bulunamadı' });
        
        app.status = 'Reddedildi';
        await app.save();
        
        res.status(200).json({ message: 'Başvuru reddedildi.' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

module.exports = {
  getApplications,
  updateApplicationStatus,
  getSystemSettings,
  updateSystemSettings,
  getCardApplications,
  approveCardApplication,
  rejectCardApplication
};
