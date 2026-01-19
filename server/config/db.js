import mongoose from "mongoose";

//Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/job-portal`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB