const bcrypt = require('bcryptjs');

const hash = async (req, res) => {
      const { data } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashdata = await bcrypt.hash(data, salt);
      res.status(200).json({ hashdata });
}; 

const checkhash = async (req, res) => {
        const { data, value } = req.body;
        const kontrolislemi = await bcrypt.compare(this.hash(value), data);
        res.status(200).json({ kontrolislemi });  
};

  module.exports = {
    hash,
    checkhash
  };
