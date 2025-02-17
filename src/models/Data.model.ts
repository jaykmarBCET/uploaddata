import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    dataUrl: {
      type: String,
      required: true,
      trim: true, 
    },
    dataId:{
      type:String,
    },
    type: {
      type: String,
      default: "unknown", 
    },
    message: {
      type: String,
      default: "", 
    },
  },
  { timestamps: true }
);


const Data = mongoose.models.Data || mongoose.model("Data", DataSchema);

export { Data };
