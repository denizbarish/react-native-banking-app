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
        console.error('Hash servisi hatası:', netErr);
        throw new Error('Şifre kontrol servisine erişilemiyor');
    }

    if (!hashResponse.ok) {
        const errText = await hashResponse.text();
        console.error('❌ Hash Service Error:', hashResponse.status, errText);
        throw new Error('Hash servisi hata döndürdü: ' + hashResponse.status + ' ' + errText);
    }

    const data = await hashResponse.json();
    
    
    console.log('Password check for:', tcNo, 'Result:', data.kontrolislemi);

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
        user: {
            ad: hesap.ad,
            soyad: hesap.soyad,
            tcNo: hesap.tc_kimlik
        }
    }); 
  } catch (err) {
    console.error('Login error:', err);
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

const sendSMS = async (phoneNumber, message) => {
  const { phone } = req.body;
  
  res.status(200).json({ message: `SMS gönderildi: ${phone}` });
}

module.exports = {
  login,
  logout,
  verifyFace,
  sendSMS
};
