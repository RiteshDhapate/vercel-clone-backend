import mongoose from "mongoose";

export async function dbConnection() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB connection established");
  } catch (error) {
    console.error(error);
  }
}
