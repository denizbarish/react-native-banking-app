const Card = require('../models/Card.model');

const checklimit = async (req, res) => {
  const {tcNo,cardNo,istenilenlimit} = req.body;
    if(!tcNo || !cardNo){
      return res.status(400).json({message: 'GEÇERSİZ TCNO VEYA KART NO!!'});
  }; 
  try{
    const cardLimit = await Card.findOne({tc : tcNo, kart_num: cardNo},{kullanilabilir_limit:1,_id:0});
    console.log(cardLimit);
    if(!cardLimit){
      return res.status(404).json({message: 'KART BULUNAMADI!!'});
    }
    if(cardLimit.kullanilabilir_limit >= istenilenlimit){
      cardlimit.kullanilabilir_limit -= istenilenlimit;
      await Card.findOneAndUpdate(
        {tc : tcNo, kart_num: cardNo},
        {$set: {kullanilabilir_limit: cardlimit.kullanilabilir_limit} },
        {new: true}
      );
      res.status(200).json({message: 'İŞLEM BAŞARILI!! KALAN LİMİT: ' + cardlimit});
    }
    }
  catch(error){
     console.error('Kart bilgileri alınırken hata oluştu:', error);
    res.status(500).json({message: 'Sunucu hatası. Lütfen daha sonra tekrar deneyiniz.'});
  }
};

const checkskt = async (req, res) => {
  const {tcNo,cardNo,cardSkt} = req.body;
    if(!tcNo || !cardNo || !cardSkt){
      return res.status(400).json({message: 'GEÇERSİZ TCNO , KART NO VEYA SKT!!'});
    };
    try{
      const card = await Card.findOne({tc : tcNo, kart_num: cardNo}, {skt:1,_id:0});
      if(!card){
        return res.status(404).json({message: 'KART BULUNAMADI!!'});
      }
      if(card.skt === cardSkt){
        res.status(200).json({message: 'SKT DOĞRU!!'});
      }
      else
        res.status(400).json({message: 'SKT YANLIŞ!!'});
    }
    catch(error) {
       console.error('Kart bilgileri alınırken hata oluştu:', error);
      res.status(500).json({message: 'Sunucu hatası. Lütfen daha sonra tekrar deneyiniz.'});
    }
}; 

const checkinfo = async (req, res) => {
    const {tcNo} = req.body;
   
      if(!tcNo){
        return res.status(400).json({message: 'GEÇERSİZ TCNO!!'});
      }
         try{
        const cards = await Card.find({tc: tcNo});
        if(cards.length === 0 ){
          return res.status(404).json({message: 'KART BULUNAMADI!!'});
        }
        console.log(cards);
        res.status(200).json({cards});
      }    
    catch(error){
      console.error('Kart bilgileri alınırken hata oluştu:', error);
      res.status(500).json({message: 'Sunucu hatası. Lütfen daha sonra tekrar deneyiniz.'});
    }
};

const checkdou = async (req, res) => {
  const {tcNo,cardNo} = req.body;
  if(!tcNo || !cardNo)
  {
    return res.status(400).json({message: 'GEÇERSİZ TCNO VEYA KART NO!!'});
  }
  try{
    const card = await Card.findOne({tc : tcNo, kart_num: cardNo}, {dou_para :1,_id:0});
     if(!card){
        return res.status(404).json({message: 'KART BULUNAMADI!!'});
      }
      res.status(200).json({message:card.dou_para});
  }
  catch(error){
      console.error('Kart bilgileri alınırken hata oluştu:', error);
      res.status(500).json({message: 'Sunucu hatası. Lütfen daha sonra tekrar deneyiniz.'});
    }
  
  
};

const getharcamalar = async (req, res) => {
  const {tcNo,cardNo} = req.body;
    if(!tcNo || !cardNo){
      return res.status(400).json({message: 'GEÇERSİZ TCNO VEYA KART NO!!'});
    }
    try{
      const card = await Card.find({tc : tcNo, kart_num: cardNo}, {harcamalar:1,_id:0});
      if(!card){
        return res.status(404).json({message: 'KART BULUNAMADI!!'});
      }
      console.log(card.harcamalar);
      res.status(200).json({Harcamalar: card.harcamalar});
        }
    catch(error){
       console.error('Kart bilgileri alınırken hata oluştu:', error);
      res.status(500).json({message: 'Sunucu hatası. Lütfen daha sonra tekrar deneyiniz.'});
    }
};

const checkesktre =  async (req, res) => {
  const {tcNo,cardNo} = req.body;
    if(!tcNo || !cardNo){
      return res.status(400).json({message: 'GEÇERSİZ TCNO VEYA KART NO!!'});
    }
    try {
      const card = await Card.findOne({tc: tcNo, kart_num: cardNo}, {ekstre_kesim_tarihi:1, son_odeme_tarihi:1,donem_ici_harcama:1, _id:0});
      if(!card){
        return res.status(404).json({message: 'KART BULUNAMADI!!'});
      }
      const today = new Date();
      if(card.son_odeme_tarihi < today){
        return res.status(200).json({  message: 'ÖDEME TARİHİ GEÇMİŞ!',  son_odeme_tarihi: card.son_odeme_tarihi,  donem_ici_harcama: card.donem_ici_harcama});
      }
      res.status(200).json({son_odeme_tarihi:card.son_odeme_tarihi, donem_ici_harcama: card.donem_ici_harcama})
        }
    catch(error){
       console.error('Kart bilgileri alınırken hata oluştu:', error);
      res.status(500).json({message: 'Sunucu hatası. Lütfen daha sonra tekrar deneyiniz.'});  
    }
};


  module.exports = {
    checklimit,
    checkskt,
    checkinfo,
    checkdou,
    getharcamalar,
    checkesktre
  };
