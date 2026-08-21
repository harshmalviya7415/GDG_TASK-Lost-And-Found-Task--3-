const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log("Server Connected:::::");
    } catch (error) {
        console.log("MONGO_URI:", process.env.MONGO_URI);
        console.log(`Have Some Error ${error}`);
    }
};

module.exports = connectDb;
