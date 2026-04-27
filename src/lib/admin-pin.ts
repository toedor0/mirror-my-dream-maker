// Client-side PIN hashing via Web Crypto (SHA-256)
// Not a replacement for server auth; just an extra gate on top of admin role.

export async function hashPin(pin: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${pin}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const SESSION_KEY = "admin_pin_ok";

export function markPinVerified() {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function isPinVerified(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function clearPinVerified() {
  sessionStorage.removeItem(SESSION_KEY);
}
