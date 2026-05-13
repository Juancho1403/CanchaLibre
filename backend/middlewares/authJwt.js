const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = require("../config/env");

function extractToken(req) {
  if (req.cookies && req.cookies.token) return req.cookies.token;
  const h = req.headers.authorization;
  if (h && typeof h === "string" && h.startsWith("Bearer ")) {
    return h.slice(7).trim();
  }
  return null;
}

/** Deja `req.user` con el payload del JWT (cookie o Authorization Bearer). */
function authJwt(req, res, next) {
  req.user = null;
  const token = extractToken(req);
  if (!token) return next();
  try {
    req.user = jwt.verify(token, TOKEN_KEY);
  } catch {
    req.user = null;
  }
  next();
}

function requireUser(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Debe iniciar sesión" });
  }
  next();
}

function requireSocio(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Debe iniciar sesión" });
  }
  if (req.user.rol !== "socio") {
    return res
      .status(403)
      .json({ success: false, message: "Solo socios pueden usar esta acción" });
  }
  next();
}

function requireAdministrador(req, res, next) {
  if (!req.user) {
    return res.status(403).json({ message: "Debe estar logueado" });
  }
  if (req.user.rol !== "administrador") {
    return res.status(403).json({ message: "Debe tener el rol de administrador!" });
  }
  next();
}

module.exports = {
  authJwt,
  extractToken,
  requireUser,
  requireSocio,
  requireAdministrador,
};
