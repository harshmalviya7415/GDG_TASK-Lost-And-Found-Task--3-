const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

let cachedConnection = null;

const connectDb = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (cachedConnection) {
        return cachedConnection;
    }

    console.log("Connecting to MongoDB...");
    cachedConnection = mongoose.connect(process.env.MONGO_URI)
        .then((conn) => {
            console.log("Server Connected:::::");
            return conn;
        })
        .catch((error) => {
            cachedConnection = null;
            console.error("MONGO_URI:", process.env.MONGO_URI);
            console.error(`Have Some Error ${error}`);
            throw error;
        });

    return cachedConnection;
};

module.exports = connectDb;
