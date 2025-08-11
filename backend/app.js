import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './utils/dbConnect.js';
import authRoute from './routes/authRoute.js';
dotenv.config({quiet: true});
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}))


const PORT = process.env.PORT || 5000;

app.use("/api/auth",authRoute)

app.listen(PORT,async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});


