import mongoose , {Schema} from "mongoose";
import crypto from 'crypto'

const serverSchema = new Schema(
  {
    serverName:{
      type:String
    },
    hostName:{
      type:String
    },
    sshPort:{
      type:Number
    },
    serverLocation:{
      type:String
    },
    sshUsername:{
      type:String
    },
    sshKey:{
      type:String
    },
    sshPassword:{
      type:String
    },
    tokenIV: {
      type: String,
    },
    tokenTag: {
      type: String,
    },
    owner:[
      {
        type:Schema.Types.ObjectId,
        ref:"User"
      }
    ]
  },
  {
    timestamps:true
  }
)

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

serverSchema.pre("save", function (next) {
  if (!this.isModified("sshKey")) return next();

  const { data, iv, tag } = encrypt(this.sshKey);
  this.sshKey = data;
  this.tokenIV = iv;
  this.tokenTag = tag;

  next();
});

export const Server = mongoose.model("Server" , serverSchema)