import mongoose from "mongoose";

const connect = async () => {
    try {
        console.log("connect to database");
        await mongoose.connect(process.env.MONGO_URL,{});
        console.log("connect to database..");
        
    } catch (error) {
        console.log("failed to connect database",error.message);
        process.exit(1);
    }
};
export default connect;