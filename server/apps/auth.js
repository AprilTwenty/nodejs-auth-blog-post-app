import { Router } from "express";
import { db } from "../utils/db.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้

//1 select collection
const collection = db.collection("user");
authRouter.post("/register", async (req, res) => {
    //2 access req and body
    const user = {
        "username": req.body.username,
        "password": req.body.password,
        "firstname": req.body.firstname,
        "lastname": req.body.lastname 
    };
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    //3 execute
    try {
        await collection.insertOne(user);
        //4 res section 
        return res.status(200).json({
            "message": "User has been created successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            "message": "Internal Server Error"
        });
    }
});
// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
//1
authRouter.post("/login", async (req, res) => {
    //2 access body and req
    const dataFromClient = {
        "username": req.body.username,
        "password": req.body.password
    };
    try {
    //3 execute
    //extra check username and password
    const user = await collection.findOne(
        {
            "username": dataFromClient.username
        }
    );
    if (!user) {
        return res.status(401).json({
            "message": "Invalid username or password"
        });
    }
    const isValidPassword = await bcrypt.compare(dataFromClient.password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({
            "message": "Invalid username or password"
        });
    }
    const token = jwt.sign(
        {
            "id": user._id,
            "firstname": user.firstname,
            "lastname": user.lastname
        },
        process.env.SECRET_KEY,
        {
            expiresIn: '900000'
        }
    );
    //4 res section
    return res.status(200).json({
        "message": "login successfully",
        token
    });
    } catch (error) {
        return res.status(500).json({
            "message": "Internal Server Error"
        })
    }
});