import mongoose from "mongoose";
const mongoURI = "mongodb://localhost:27017/"

const connectToMongo = async ()=>{
    await mongoose.connect(mongoURI)
    console.log("Connected To Mongoose")
}

export default connectToMongo
