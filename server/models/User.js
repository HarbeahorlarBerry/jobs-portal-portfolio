import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    resume: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;




// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     clerkId: {
//       type: String,
//       required: true,
//       unique: true, // must be unique to identify Clerk users
//       immutable: true, // prevent modification of clerkId after creation
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       index: true, // optional if you want email uniqueness enforced
//     },
//     image: {
//       type: String,
//       default: "", // optional, can be empty initially
//     },
//     resume: {
//       type: String,
//       default: "", // optional, empty until uploaded
//     },
//     // password: {
//     //   type: String,
//     //   default: "CLERK", // placeholder, not used for Clerk auth
//     // },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);

// export default User;
