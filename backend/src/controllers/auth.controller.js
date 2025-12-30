const Account = require("../models/Account");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { tcNo, password } = req.body;
    
    if (!tcNo || !password) {
        return res.status(400).json({ message: "TC No ve şifre gerekli" });
    }

    const hesap = await Account.findOne({ tc_kimlik: tcNo });
    if (!hesap) {
      return res.status(404).json({ message: "Hesap bulunamadı" });
    }

    const PORT = process.env.PORT || 3000;
    const fetchUrl = `http://127.0.0.1:${PORT}/api/hash/check`;
    
    let hashResponse;
    try {
        hashResponse = await fetch(fetchUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: password, data: hesap.sifre })
        });
    } catch (netErr) {

        throw new Error('Şifre kontrol servisine erişilemiyor');
    }

    if (!hashResponse.ok) {
        const errText = await hashResponse.text();

        throw new Error('Hash servisi hata döndürdü: ' + hashResponse.status + ' ' + errText);
    }

    const data = await hashResponse.json();
    

    if (!data.kontrolislemi) {
      return res.status(401).json({ message: "Geçersiz şifre" });
    }

    const token = jwt.sign(
        { id: hesap._id, tc: hesap.tc_kimlik, role: 'user' }, 
        process.env.JWT_SECRET || 'secret_key', 
        { expiresIn: '1d' }
    );

    res.status(200).json({ 
        message: 'Giriş başarılı', 
        token,
        user: hesap
    }); 
  } catch (err) {

    res.status(500).json({ message: "Sunucu hatası: " + err.message });
  }
}

const logout = async (req, res) => {
 try {
  res.status(200).json({ message: "Çıkış başarılı" });  
 } catch (err) {
  res.status(500).json({ message: "Sunucu hatası" });
 }
};

const verifyFace = async (req, res) => {
 
};

const sendSMS = async (req, res) => {
    try {
        const { phone } = req.body;
        
        const user = await Account.findOne({ telefon: phone });
        if (!user) {
            return res.status(404).json({ message: "Bu telefon numarası ile kayıtlı kullanıcı bulunamadı" });
        }

        const code = Math.floor(100000 + Math.random() * 900000);
        
        user.smsCode = code.toString();
        user.smsCodeExpires = Date.now() + 3 * 60 * 1000;
        await user.save();

        
        res.status(200).json({ message: "SMS gönderildi" });
    } catch (err) {

        res.status(500).json({ message: "SMS gönderilemedi: " + err.message });
    }
}

const verifySMS = async (req, res) => {
    try {
        const { phone, code } = req.body;

        const user = await Account.findOne({ telefon: phone });
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }

        if (!user.smsCode || !user.smsCodeExpires) {
            return res.status(400).json({ message: "Doğrulama kodu bulunamadı veya süresi dolmuş" });
        }

        if (Date.now() > user.smsCodeExpires) {
            user.smsCode = undefined;
            user.smsCodeExpires = undefined;
            await user.save();
            return res.status(400).json({ message: "Kodun süresi dolmuş" });
        }

        if (user.smsCode !== code) {
            return res.status(400).json({ message: "Geçersiz kod" });
        }

        user.smsCode = undefined;
        user.smsCodeExpires = undefined;
        user.sms_onay = true; 
        await user.save();

        res.status(200).json({ message: "SMS doğrulama başarılı" });
    } catch (err) {

        res.status(500).json({ message: "Sunucu hatası: " + err.message });
    }
};



module.exports = {
  login,
  logout,
  verifyFace,
  sendSMS,
  verifySMS
};
