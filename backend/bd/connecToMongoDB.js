import mongoose from "mongoose";

const connecToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI,)
        console.log("connected to MongoDB");
        
    } catch (error ) {
        console.log("Error connecting to MongoDB" , error.message);
        
    }
};

export default connecToMongoDB; 