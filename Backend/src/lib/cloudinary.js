import {v2 as cloudinary} from "cloudinary";

import '../config.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINAR_CLOUD_NAME,
    api_key: process.env.CLOUDINAR_API_KEY,
    api_SECRET: process.env.CLOUDINAR_SECRET_KEY
}) 

export default cloudinary;