import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Plese enter brand name."],
      trim: true,
    },

    description: {
      type: String,
      reuired: [true, "Plaese enter brand description."],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    discontinued: { Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
