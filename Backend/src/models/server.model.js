import mongoose, { Schema } from "mongoose";
import crypto from 'crypto'

const serverSchema = new Schema(
  {
    serverName: {
      type: String,
      required: true
    },
    hostName: {
      type: String,
      required: true
    },
    sshPort: {
      type: Number,
      default: 22
    },
    serverLocation: {
      type: String,
      required: true
    },
    sshUsername: {
      type: String,
      required: true
    },
    sshKey: {
      type: String,
      default: null
    },
    sshPassword: {
      type: String,
      default: null
    },
    tokenIV: {
      type: String,
    },
    tokenTag: {
      type: String,
    },
    owner: [{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }]
  },
  {
    timestamps: true
  }
);

// Validate that either sshKey or sshPassword is provided, but not both
serverSchema.pre('validate', function(next) {
  if (!this.sshKey && !this.sshPassword) {
    next(new Error('Either SSH key or password is required'));
    return;
  }
  if (this.sshKey && this.sshPassword) {
    next(new Error('Cannot provide both SSH key and password'));
    return;
  }
  next();
});

const algorithm = "aes-256-gcm";
const secret = Buffer.from(process.env.CLOUDFLARE_TOKEN_SECRET, "base64");

function encrypt(text) {
  if (!text) return null;

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

// Modified pre-save middleware to encrypt either sshKey or sshPassword
serverSchema.pre("save", function(next) {
  // Check which field is being used and if it was modified
  const fieldToEncrypt = this.sshKey ? "sshKey" : "sshPassword";
  
  if (!this.isModified(fieldToEncrypt)) {
    return next();
  }

  try {
    const valueToEncrypt = this[fieldToEncrypt];
    const { data, iv, tag } = encrypt(valueToEncrypt);
    
    // Store encrypted data
    this[fieldToEncrypt] = data;
    this.tokenIV = iv;
    this.tokenTag = tag;
    
    next();
  } catch (error) {
    next(error);
  }
});

export const Server = mongoose.model("Server", serverSchema);