const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

let isConnected = false;

const connectDb = async () => {
    if (isConnected) {
        return;
    }
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        isConnected = !!connect.connections[0].readyState;
        console.log("Server Connected:::::");
    } catch (error) {
        console.log("MONGO_URI:", process.env.MONGO_URI);
        console.log(`Have Some Error ${error}`);
    }
};

module.exports = connectDb;
