import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI!); // "!" asserts that the value is not null or undefined
        console.log(`MongoDB connected!: ${conn.connection.host}`);
    } catch (error:any) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // exit with failure
    }
};

export default connectDB;