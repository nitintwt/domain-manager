import mongoose , {Schema} from "mongoose";
import { type } from "os";

const domainSchema = new Schema(
  {
    domainName:{
      type:String
    },
    cloudflareAccountId:[{
      type:Schema.Types.ObjectId,
      ref:"Cloudflare",
      required:true
    }
    ],
    owner: [{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }]
  }
)

export const Domain = mongoose.model("Domain", domainSchema);