import mongoose , {Schema} from "mongoose";

const domainSchema = new Schema(
  {
    domainName:{
      type:String
    },
    cloudflareAccountId:[{
      type:Schema.Types.ObjectId,
      ref:"Cloudflare",
      required:true
    }],
    owner: [{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }],
    serverId:[{
      type: Schema.Types.ObjectId,
      ref: "Server",
      required: true
    }],
    isCloudflareValid:{
      type:Boolean,
    },
    isCloudpanelValid:{
      type:Boolean,
    }
  }
)

export const Domain = mongoose.model("Domain", domainSchema);