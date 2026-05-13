function b64url(obj) {
  const s = JSON.stringify(obj);
  const b64 = btoa(unescape(encodeURIComponent(s)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** JWT decodificable con jwt-decode (sin verificación de firma). */
export function encodeLocalJwt(payload) {
  const header = b64url({ alg: "HS256", typ: "JWT" });
  const body = b64url({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
  });
  return `${header}.${body}.local`;
}

/** Decodifica el payload del token local (Authorization Bearer). */
export function decodeLocalJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4;
    if (pad) b64 += "====".slice(0, 4 - pad);
    const json = JSON.parse(decodeURIComponent(escape(atob(b64))));
    return json;
  } catch {
    return null;
  }
}
