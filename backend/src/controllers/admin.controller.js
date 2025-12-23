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

module.exports = {
  getApplications,
  updateApplicationStatus,
  getSystemSettings,
  updateSystemSettings
};
