import crypto from "crypto";

const ENCRYPTION_KEY = process.env.CLOUDFLARE_TOKEN_SECRET;

export function decrypt(encryptedText) {
  const textParts = encryptedText.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encrypted = Buffer.from(textParts.join(":"), "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
