// Validation middleware

const validateRegistration = (req, res) => {
  // Validation logic here
};

const validateLogin = (req, res) => {
   
  const token = localStorage.getItem('token');
  if (!token) {
    return res.status(401).json({ message: "Erişim sona erdi." });
  }
  try {
    res.status(200).json({ message: "Token geçerli." }); 
  } catch (err) {
    res.status(400).json({ message: "Token Hatası" });
  }
};

const validateTransaction = (req, res) => {
  // Validation logic here
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateTransaction
};
