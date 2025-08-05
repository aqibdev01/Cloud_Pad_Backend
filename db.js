import mongoose from "mongoose";
const mongoURI = "mongodb://localhost:27017/cloudPad"

const connectToMongo = async ()=>{
    await mongoose.connect(mongoURI)
    console.log("Connected To Mongoose")
}

export default connectToMongo
