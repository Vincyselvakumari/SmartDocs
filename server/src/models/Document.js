import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    embedding: {
      type: [Number],
      default: [],
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    summary: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    versions: [
      {
        content: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);