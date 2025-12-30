const axios = require('axios');
const Account = require('../models/Account');

const getExchangeRates = async (req, res) => {
    try {
        const response = await axios.get('https://api.frankfurter.app/latest?to=USD,GBP,JPY,TRY');
        const data = response.data.rates;
        
        const tryRate = data.TRY;

        const calculatedRates = {
            USD: tryRate / data.USD,
            EUR: tryRate,
            GBP: tryRate / data.GBP,
            JPY: tryRate / data.JPY
        };

        res.status(200).json(calculatedRates);
    } catch (err) {
        console.error('Exchange API Error:', err.message);
        res.status(500).json({ message: "Döviz kurları alınamadı." });
    }
};

const getRatesInternal = async () => {
    try {
        const response = await axios.get('https://api.frankfurter.app/latest?to=USD,GBP,JPY,TRY');
        const data = response.data.rates;
        const tryRate = data.TRY;
        return {
            USD: tryRate / data.USD,
            EUR: tryRate,
            GBP: tryRate / data.GBP,
            JPY: tryRate / data.JPY
        };
    } catch (e) {
        throw new Error('Kur bilgisi alınamadı');
    }
};

const buyCurrency = async (req, res) => {
    try {
        const { tcNo, currency, amount } = req.body;
        if (!tcNo || !currency || !amount || amount <= 0) {
            return res.status(400).json({ message: "Geçersiz işlem verileri" });
        }

        const account = await Account.findOne({ tc_kimlik: tcNo });
        if (!account) return res.status(404).json({ message: "Hesap bulunamadı" });

        const rates = await getRatesInternal();
        const rate = rates[currency];
        
        if (!rate) return res.status(400).json({ message: "Desteklenmeyen para birimi" });

        const costInTry = amount * rate;

        if (account.bakiye < costInTry) {
            return res.status(400).json({ message: "Yetersiz bakiye (TRY)" });
        }

        account.bakiye -= costInTry;
        
        if (!account.doviz_varliklari) account.doviz_varliklari = {};
        if (!account.doviz_varliklari[currency]) account.doviz_varliklari[currency] = 0;

        account.doviz_varliklari[currency] += Number(amount);

        await account.save();

        res.status(200).json({ 
            message: `${amount} ${currency} satın alındı.`, 
            newBalance: account.bakiye,
            newAsset: account.doviz_varliklari[currency]
        });

    } catch (err) {
        res.status(500).json({ message: "İşlem hatası: " + err.message });
    }
};

const sellCurrency = async (req, res) => {
    try {
        const { tcNo, currency, amount } = req.body;
        
        if (!tcNo || !currency || !amount || amount <= 0) {
            return res.status(400).json({ message: "Geçersiz işlem verileri" });
        }

        const account = await Account.findOne({ tc_kimlik: tcNo });
        if (!account) return res.status(404).json({ message: "Hesap bulunamadı" });

        if (!account.doviz_varliklari || !account.doviz_varliklari[currency] || account.doviz_varliklari[currency] < amount) {
             return res.status(400).json({ message: `Yetersiz ${currency} bakiyesi` });
        }

        const rates = await getRatesInternal();
        const rate = rates[currency];
        
        if (!rate) return res.status(400).json({ message: "Desteklenmeyen para birimi" });

        const gainInTry = amount * rate;

        account.doviz_varliklari[currency] -= Number(amount);
        account.bakiye += gainInTry;

        await account.save();

        res.status(200).json({ 
            message: `${amount} ${currency} satıldı.`, 
            newBalance: account.bakiye,
            newAsset: account.doviz_varliklari[currency]
        });

    } catch (err) {
         res.status(500).json({ message: "İşlem hatası: " + err.message });
    }
};

module.exports = {
    getExchangeRates,
    buyCurrency,
    sellCurrency
};
