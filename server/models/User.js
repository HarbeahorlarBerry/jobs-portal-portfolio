import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true, // must be unique to identify Clerk users
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // optional if you want email uniqueness enforced
    },
    image: {
      type: String,
      default: "", // optional, can be empty initially
    },
    resume: {
      type: String,
      default: "", // optional, empty until uploaded
    },
    password: {
      type: String,
      default: "CLERK", // placeholder, not used for Clerk auth
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
