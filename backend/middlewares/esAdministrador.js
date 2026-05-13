const esAdministrador = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "Debe estar logueado" });
  }
  if (req.user.rol !== "administrador") {
    return res.status(403).json({ message: "Debe tener el rol de administrador!" });
  }
  next();
};

module.exports = esAdministrador;