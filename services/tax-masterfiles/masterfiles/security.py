import hashlib, hmac, os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

AAD = b"tax-masterfiles:v1"

def _key() -> bytes:
    raw = os.environ.get("TMF_MASTER_KEY_HEX", "")
    if len(raw) != 64:
        raise RuntimeError("TMF_MASTER_KEY_HEX must contain exactly 64 hexadecimal characters")
    try:
        return bytes.fromhex(raw)
    except ValueError as exc:
        raise RuntimeError("TMF_MASTER_KEY_HEX is not valid hexadecimal") from exc

def encrypt(value: str) -> bytes | None:
    if not value:
        return None
    nonce = os.urandom(12)
    return nonce + AESGCM(_key()).encrypt(nonce, value.encode(), AAD)

def decrypt(value: bytes | None) -> str | None:
    if value is None:
        return None
    return AESGCM(_key()).decrypt(value[:12], value[12:], AAD).decode()

def blind_index(tenant: str, value: str) -> str:
    return hmac.new(_key(), f"{tenant}|{value}".encode(), hashlib.sha256).hexdigest()

def last4(value: str) -> str:
    digits = "".join(c for c in (value or "") if c.isdigit())
    return digits[-4:] if len(digits) >= 4 else ""
