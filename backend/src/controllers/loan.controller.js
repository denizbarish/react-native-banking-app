const Account = require('../models/Account');
const Card = require('../models/Card');

const gelirHaritasi = {
    '0 - 10.000 TL': 5000,
    '10.000 - 25.000 TL': 17500,
    '25.000 - 50.000 TL': 37500,
    '50.000 - 100.000 TL': 75000,
    '100.000 TL üzeri': 100000
};

const checkloan = async (req, res) => {
    const { tc } = req.body;
    const account = await Account.findOne({ tc_kimlik: tc });

    if (account.mevcut_kredi_tutari > 0) {
        res.json({ durum: "Var", mesaj: "Ödenmemiş krediniz var." });
    } else {
        res.json({ durum: "Yok", mesaj: "Kredi çekebilirsiniz." });
    }
};
const testloan = async (req, res) => {
    const { tc } = req.body;
    
    const account = await Account.findOne({ tc_kimlik: tc });
    const card = await Card.findOne({ tc: tc });
    const maas = gelirHaritasi[account.aylik_gelir]; 
    let skor = 0;
    if (maas > 0) {
        skor = card.kullanilabilir_limit / maas;
    }
    account.mevcut_kredi_notu = skor;
    await account.save();

    res.json({ mesaj: "Skor hesaplandı", skor: skor });
};
const giveloan = async (req, res) => {
    const { tc } = req.body;
    const account = await Account.findOne({ tc_kimlik: tc });

    if (account.mevcut_kredi_tutari > 0) {
        return res.json({ mesaj: "Zaten krediniz var!" });
    }
    const krediMiktari = account.mevcut_kredi_notu * 100000;
    account.bakiye += krediMiktari;
    account.mevcut_kredi_tutari = krediMiktari;
    await account.save();
    res.json({ mesaj: "Kredi verildi", miktar: krediMiktari, yeniBakiye: account.bakiye });
};
const deleteloan = async (req, res) => {
    const { tc } = req.body;
    await Account.updateOne({ tc_kimlik: tc }, { mevcut_kredi_tutari: 0 }, { upsert: true });
    res.json({ mesaj: "Kredi borcu silindi." });
};
module.exports = 
{ checkloan, 
    testloan, 
    giveloan, 
    deleteloan };