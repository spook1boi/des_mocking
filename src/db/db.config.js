import mongoose from "mongoose";
import config from '../config/config.js';

mongoose.connect(config.mongoURI)
    .then(() => {
        console.log("Connected to Mongo");
    })
    .catch(error => {
        console.error("Error connecting to Mongo, error" + error);
    });