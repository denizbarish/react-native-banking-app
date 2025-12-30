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
    try {
        const { tc } = req.body;
        const account = await Account.findOne({ tc_kimlik: tc });
        if (!account) return res.status(404).json({ message: "Hesap bulunamadı" });

        if (account.mevcut_kredi_tutari > 0) {
            res.json({ durum: "Var", mesaj: "Ödenmemiş krediniz var.", borc: account.mevcut_kredi_tutari });
        } else {
            res.json({ durum: "Yok", mesaj: "Kredi çekebilirsiniz.", limit: account.kredi_limiti });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const testloan = async (req, res) => {
    try {
        const { tc } = req.body;
        
        const account = await Account.findOne({ tc_kimlik: tc });
        if (!account) return res.status(404).json({ message: "Hesap bulunamadı" });

        const card = await Card.findOne({ tc: tc });
        
        const maas = gelirHaritasi[account.aylik_gelir] || 10000; 
        let skor = 0;
        
        if (maas > 0) {
             skor = (card && card.kullanilabilir_limit) ? (card.kullanilabilir_limit / maas) * 100 : 1200;
        }

        account.mevcut_kredi_notu = Math.floor(skor);
        await account.save();

        res.json({ mesaj: "Skor hesaplandı", skor: Math.floor(skor) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const giveloan = async (req, res) => {
    try {
        const { tc, amount } = req.body; 
        
        if (!amount || amount <= 0) return res.status(400).json({ message: "Geçersiz miktar" });

        const account = await Account.findOne({ tc_kimlik: tc });
        if (!account) return res.status(404).json({ message: "Hesap bulunamadı" });

        const currentDebt = account.mevcut_kredi_tutari || 0;
        const limit = account.kredi_limiti || 50000;

        if (currentDebt + Number(amount) > limit) {
             return res.status(400).json({ message: `Limit yetersiz. Kalan limit: ${limit - currentDebt} TL` });
        }

        account.bakiye += Number(amount);
        account.mevcut_kredi_tutari = currentDebt + Number(amount);
        await account.save();
        
        res.json({ mesaj: "Kredi hesabınıza tanımlandı", miktar: amount, yeniBakiye: account.bakiye, yeniBorc: account.mevcut_kredi_tutari });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const payLoan = async (req, res) => {
    try {
        const { tc, amount } = req.body;
        
        if (!amount || amount <= 0) return res.status(400).json({ message: "Geçersiz miktar" });

        const account = await Account.findOne({ tc_kimlik: tc });
        if (!account) return res.status(404).json({ message: "Hesap bulunamadı" });

        const currentDebt = account.mevcut_kredi_tutari || 0;
        
        if (currentDebt <= 0) {
            return res.status(400).json({ message: "Borcunuz bulunmamaktadır." });
        }

        if (Number(amount) > currentDebt) {
             return res.status(400).json({ message: "Ödeme tutarı borçtan fazla olamaz." });
        }

        if (account.bakiye < Number(amount)) {
            return res.status(400).json({ message: "Yetersiz bakiye" });
        }

        account.bakiye -= Number(amount);
        account.mevcut_kredi_tutari -= Number(amount);

        await account.save();

        res.status(200).json({ 
            message: "Ödeme başarıyla alındı.",
            newBalance: account.bakiye,
            newDebt: account.mevcut_kredi_tutari
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteloan = async (req, res) => {
    try {
        const { tc } = req.body;
        await Account.updateOne({ tc_kimlik: tc }, { mevcut_kredi_tutari: 0 });
        res.json({ mesaj: "Kredi borcu silindi." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLoanInfo = async (req, res) => {
    try {
        const { tcNo } = req.params;
        const account = await Account.findOne({ tc_kimlik: tcNo });
        if (!account) return res.status(404).json({ message: "Hesap bulunamadı" });

        res.status(200).json({
            creditScore: account.mevcut_kredi_notu || 1200, 
            limit: account.kredi_limiti || 50000,
            currentDebt: account.mevcut_kredi_tutari || 0,
            balance: account.bakiye
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    checkloan,
    testloan,
    giveloan,
    deleteloan,
    payLoan,
    getLoanInfo
};