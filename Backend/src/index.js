import express from "express";
const app = express();
import { connectDB } from "./lib/db.js";
import passport from "passport";
import cookieParser from "cookie-parser"

import "./lib/passport.js";
import './config.js';

const PORT = process.env.PORT;

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

app.use("/api/auth",authRoutes);
app.use("/api/auth",messageRoutes);

app.listen(PORT,()=>{
    console.log(`app is listening on PORT : ${PORT}`);
    connectDB();
});
