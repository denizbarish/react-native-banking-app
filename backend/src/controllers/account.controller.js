const Account = require('../models/Account');


const register = async (req, res) => {
  try {
    let { ad, soyad, tc_kimlik, sifre, telefon, hesap_turu, aylik_gelir, mal_varlik, islem_hacmi, egitim_durumu, calisma_durumu, calisma_sektoru } = req.body;

    
    if (!sifre) {
        
        
        sifre = tc_kimlik ? tc_kimlik.slice(-6) : '123456';
        console.log('ℹ️ Şifre parametresi eksik. Otomatik şifre atandı:', sifre);
    }


    const existingAccount = await Account.findOne({ tc_kimlik });
    if (existingAccount) {
      return res.status(400).json({ message: 'Bu TC Kimlik numarası ile kayıtlı bir hesap zaten var.' });
    }


    const PORT = process.env.PORT || 3000;
    const fetchUrl = `http://127.0.0.1:${PORT}/api/hash/hash`;
    console.log('🔗 Fetching hash from:', fetchUrl);
    
    
    let hashResponse;
    try {
        hashResponse = await fetch(fetchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data: sifre })
        });
    } catch (err) {
        console.error('❌ Hash service fetch network error:', err);
        throw new Error('Şifreleme serivisine erişilemedi: ' + err.message);
    }

    if (!hashResponse.ok) {
      console.error('❌ Hash service returned error:', hashResponse.status, await hashResponse.text());
      throw new Error('Şifreleme servisinde hata oluştu');
    }

    const hashData = await hashResponse.json();
    const hashedPassword = hashData.hashdata;

    const newAccount = new Account({
      ad,
      soyad,
      tc_kimlik,
      sifre: hashedPassword,
      telefon,
      hesap_turu,
      aylik_gelir,
      mal_varlik,
      islem_hacmi,
      egitim_durumu,
      calisma_durumu,
      calisma_durumu,
      calisma_sektoru,
      bakiye: 0,
      iban: `TR${Math.floor(100000000000000000000000 + Math.random() * 900000000000000000000000)}`
    });

    await newAccount.save();

    res.status(201).json({ message: 'Hesap başarıyla oluşturuldu.', account: newAccount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAccountByTC = async (req, res) => {
  try {
    const account = await Account.findOne({ tc_kimlik: req.body.tc });
    if (!account) {
      return res.status(404).json({ message: 'Hesap bulunamadı' });
    }
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAccount = async (req, res) => {
  try {
    const account = await Account.findOneAndUpdate(
      { tc_kimlik: req.params.tc },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({ message: 'Hesap bulunamadı' });
    }

    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({ tc_kimlik: req.body.tc });
    if (!account) {
      return res.status(404).json({ message: 'Hesap bulunamadı' });
    }
    res.status(200).json({ message: 'Hesap başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  getAccounts,
  getAccountByTC,
  updateAccount,
  deleteAccount
};

