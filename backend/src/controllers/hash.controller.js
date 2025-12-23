const bcrypt = require('bcryptjs');

const hash = async (req, res) => {
  try {
      const { data } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashdata = await bcrypt.hash(data, salt);
      res.status(200).json({ hashdata }); }
    catch (error) {
      res.status(500).json({ message: 'Data Hashlemede Hata!' });
    }
}; 

const checkhash = async (req, res) => {
  try {
        const { value, data } = req.body;
        const kontrolislemi = await bcrypt.compare(value, data);
        res.status(200).json({ kontrolislemi });  
  } catch (error) {
        console.error('CheckHash Error:', error);
        res.status(500).json({ message: 'Hash Doğrulama Hatası!' });
  }
}; 

  module.exports = {
    hash,
    checkhash
  };
