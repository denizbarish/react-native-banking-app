const Account = require('../models/Account');


const register = async (req, res) => {
  try {
    const { tc_kimlik, sifre, telefon, hesap_turu, aylik_gelir, mal_varlik, islem_hacmi, egitim_durumu, calisma_durumu, calisma_sektoru } = req.body;

    const existingAccount = await Account.findOne({ tc_kimlik });
    if (existingAccount) {
      return res.status(400).json({ message: 'Bu TC Kimlik numarası ile kayıtlı bir hesap zaten var.' });
    }

    // Call hash service
    const PORT = process.env.PORT || 3000;
    const hashResponse = await fetch(`http://localhost:${PORT}/api/hash/hash`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: sifre })
    });

    if (!hashResponse.ok) {
      throw new Error('Şifreleme servisinde hata oluştu');
    }

    const hashData = await hashResponse.json();
    const hashedPassword = hashData.hashdata;

    const newAccount = new Account({
      tc_kimlik,
      sifre: hashedPassword,
      telefon,
      hesap_turu,
      aylik_gelir,
      mal_varlik,
      islem_hacmi,
      egitim_durumu,
      calisma_durumu,
      calisma_sektoru
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

