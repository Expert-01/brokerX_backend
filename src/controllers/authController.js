import bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

import { createUser, findUserByEmail } from "../models/userModel.js";


dotenv.config();

export const signup = async ( req, res ) => {
    try {
        const { name, email, password } = req.body;
         
        //Check if user already exists
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({message: 'Email already registered'});
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


           // Generate a short random user_id (e.g. 8 digits)
        const randomId = Math.floor(10000000 + Math.random() * 90000000).toString();

        //saved user
        const newUser = await createUser(name, email, hashedPassword, randomId);
        
        res.status(201).json({message: 'User registered successfully!', existingUser: newUser});
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
        console.log("Signup error:", error.message, req.body);
    }

};

export const login = async ( req, res ) => {
    try {
        const { email, password } = req.body;

        //Check user
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({message: 'Invalid email or password'}); 
        }
        console.log("Password:", password);
        console.log("User query:", user);
        
        //Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        // Compare plain text passwords (unhashed)
/*if (password !== user.password) {
  return res.status(400).json({ message: 'Invalid email or password' });
}*/

        //Create JWT Token
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, is_admin: user.is_admin, balance: user.balance, user_id: user.user_id, joined: user.created_at },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

                res.status(200).json({
                    message: 'Login successful',
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        is_admin: user.is_admin,
                        name: user.name,
                        balance: user.balance,
                        user_id: user.user_id,    //
                        created_at: user.created_at
                    }
                });
        console.log("JWT Token:", token);

    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}
