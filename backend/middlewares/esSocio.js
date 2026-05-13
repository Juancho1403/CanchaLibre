const esSocio = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "Debe estar logueado" });
  }
  if (req.user.rol !== "socio") {
    return res.status(403).json({ message: "Debe tener el rol de socio!" });
  }
  next();
};

module.exports = esSocio;