const Account = require("../models/Account");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try{
    const hesap = await Account.findOne({tc_kimlik:tcNo});
    if(!hesap){
      return res.status(404).json({message:"Hesap bulunamadı"});
    }
    const response = await fetch ('/api/hash/check',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
    body:JSON.stringify({value:password,data:hesap.sifre})
    });
    const data = await response.json();
    if(!data.kontrolislemi){
      return res.status(401).json({message:"Geçersiz şifre"});
    }
    const token = jwt.sign({id:hesap._id},process.env.JWT_SECRET,{expiresIn:'1d'});
    localStorage.setItem('token',token);
    res.status(200).json({message:'Giriş başarılı',token}); 
  }
  catch(err){
    res.status(500).json({message:"Sunucu hatası"});
  }

}

const logout = async (req, res) => {
 try{
  localStorage.removeItem('token');
  res.status(200).json({message:"Çıkış başarılı"});  
 }
 catch(err){
  res.status(500).json({message:"Sunucu hatası"});
 }
};

const verifyFace = async (req, res) => {
 
};

module.exports = {
  login,
  logout,
  verifyFace
};
