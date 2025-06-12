import mongoose , {Schema} from "mongoose";

const domainSchema = new Schema(
  {
    domainName:{
      type:String
    },
    cloudflareAccount:{
      type:Schema.Types.ObjectId,
      ref:"Cloudflare",
    },
    cloudflareZoneId:{
      type:String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    server:{
      type: Schema.Types.ObjectId,
      ref: "Server",
    },
    cloudflareStatus:{
      type:String,
      default:"pending"
    },
    serverStatus:{
      type:String,
      default: function (){
        return this.server ?"pending" : "not configured"
      }
    },
    lastValidityChecked:{
      type:String
    }
  }
)

export const Domain = mongoose.model("Domain", domainSchema);