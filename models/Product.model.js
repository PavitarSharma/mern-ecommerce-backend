import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Plese enter product name."],
      trim: true,
    },

    description: {
      type: String,
      reuired: [true, "Plaese enter product description."],
    },

    price: {
      type: Number,
      required: [true, "Please enter product price."],
    },

    discount: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      required: [true, "Please enter product stock."],
      default: 1,
    },

    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please select a category."],
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Please select a brand."],
    },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      red: "Store",
      required: [true, "Please select a store."],
    },

    localShipmentPolicy: {
      type: String,
      required: [true, "Please select a local shipment policy."],
      default: "standard",
      enum: ["free", "standard", "custom"],
    },

    customLocalShipmentPolicy: {
      type: Number,
    },

    internationalShipmentPolicy: {
      type: String,
      required: [true, "Please select a international shipment policy."],
      default: "standard",
      enum: ["free", "standard", "custom"],
    },

    customInternationalShipmentPolicy: {
      type: Number,
    },

    color: {
      type: String,
    },

    size: {
      type: String,
    },

    ratings: {
      type: Number,
      default: 0,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
        },
        time: {
          type: Date,
          default: Date.now(),
        },
      },
    ],

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
   
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
