import mongoose from "mongoose";

export default async function dbConnect() {
    mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/reon").then((connection) => {
        console.log(`Successfully connected to ${process.env.MONGO_URI ? process.env.MONGO_URI : 'local database'}`);
        return connection;
    }).catch((reason) => {
        throw new Error(reason);
    });
};