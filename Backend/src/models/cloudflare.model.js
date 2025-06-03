import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

const cloudflareAccountSchema = new Schema(
  {
    accountName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      required: true,
    },
    apiToken: {
      type: String,
      required: true,
    },
    tokenIV: {
      type: String,
    },
    tokenTag: {
      type: String,
    },
    zoneId: {
      type: String,
      required: true,
    },
    owner: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const algorithm = "aes-256-gcm";
const secret = Buffer.from(process.env.CLOUDFLARE_TOKEN_SECRET, "base64");

function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, secret, iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  const tag = cipher.getAuthTag();

  return {
    data: encrypted,
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

cloudflareAccountSchema.pre("save", function (next) {
  if (!this.isModified("apiToken") || !this.apiToken) return next();

  const { data, iv, tag } = encrypt(this.apiToken);
  this.apiToken = data;
  this.tokenIV = iv;
  this.tokenTag = tag;

  next();
});

export const Cloudflare = mongoose.model("Cloudflare", cloudflareAccountSchema);