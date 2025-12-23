const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

const getTransactions = async (req, res) => {
  try {
    // Assuming we want transactions for a specific user, identified by their IBAN provided in body or query
    // If not provided, maybe return all? But usually it's per user.
    // Let's check for 'iban' in body or query.
    const iban = req.body.iban || req.query.iban;

    let query = {};
    if (iban) {
      query = {
        $or: [
          { gonderici_ıban: iban },
          { alici_ıban: iban }
        ]
      };
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'İşlem bulunamadı' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { gonderici_ıban, alici_ıban, miktar } = req.body;

    // Validate inputs
    if (!gonderici_ıban || !alici_ıban || !miktar) {
      return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }

    if (gonderici_ıban === alici_ıban) {
        return res.status(400).json({ message: 'Kendinize para gönderemezsiniz.' });
    }

    if (miktar <= 0) {
        return res.status(400).json({ message: 'Geçersiz miktar.' });
    }


    // Find Sender
    const gonderici = await Account.findOne({ iban: gonderici_ıban });
    if (!gonderici) {
      return res.status(404).json({ message: 'Gönderici hesap bulunamadı.' });
    }

    // Find Receiver
    const alici = await Account.findOne({ iban: alici_ıban });
    if (!alici) {
      return res.status(404).json({ message: 'Alıcı hesap bulunamadı.' });
    }

    // Check Balance
    if (gonderici.bakiye < miktar) {
      return res.status(400).json({ message: 'Yetersiz bakiye.' });
    }

    // Perform Transfer
    gonderici.bakiye -= miktar;
    alici.bakiye += miktar;

    // Create Transaction Record
    const dekont_url = `DOC-${Date.now()}-${Math.floor(Math.random() * 1000)}`; // Simple fake dekont ID
    const kesinti_tutari = 0; // Free for now

    const newTransaction = new Transaction({
      dekont_url,
      alici_ıban,
      gonderici_ıban,
      gonderici_ad_soyad: `${gonderici.ad} ${gonderici.soyad}`,
      alici_ad_soyad: `${alici.ad} ${alici.soyad}`,
      miktar,
      kesinti_tutari,
      islem_tarihi: new Date()
    });

    // Save everything
    await gonderici.save();
    await alici.save();
    await newTransaction.save();

    res.status(201).json({ message: 'İşlem başarılı.', transaction: newTransaction });

  } catch (error) {
    // Determine if we need to rollback?
    // In a real app we'd use transactions (startSession).
    // For now, just return error.
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction
};
