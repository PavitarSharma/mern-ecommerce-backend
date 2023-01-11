import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter the username"],
      trim: true,
      minlength: [3, "Please enter a name atleast 3 characters"],
      maxlength: [15, "Name can not big than 15 characters"],
    },

    email: {
      type: String,
      validate: [validator.isEmail, "Please enter the valid email"],
      required: [true, "Please enter the email"],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Please enter the password"],
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },

    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    roles: {
      type: [String],
      default: "user",
      enum: ["admin", "seller", "user"],
    },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },

    updatedBy: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    resetPasswordToken: String,

    resetPasswordTime: Date,

    address: {
      type: String,
      default: "",
    },

    phone: {
      type: Number,
    },

    status: {
      type: String,
    },

    gender: {
      type: String,
    },

    githubLink: {
      type: String,
    },

    twitterLink: {
      type: String,
    },

    linkedinLink: {
      type: String,
    },

    facebookLink: {
      type: String,
    },

    fromGoogle: {
      type: Boolean,
      default: false,
    },

    fromGitHub: {
      type: Boolean,
      default: false,
    },

    fromTwitter: {
      type: Boolean,
      default: false,
    },

    blocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", userSchema);

export default User;
