const Account = require('../models/Account');

const register = async (req, res) => {

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

