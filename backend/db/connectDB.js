import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`DB Error : ${error.message}`)
    process.exit(1) // 1 means exit with failure , 0 means exit with success
  }
}