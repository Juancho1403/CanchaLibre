const esPropietario = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "Debe estar logueado" });
  }
  if (req.user.rol !== "propietario") {
    return res.status(403).json({ message: "Debe tener el rol de propietario!" });
  }
  next();
};

module.exports = esPropietario;
