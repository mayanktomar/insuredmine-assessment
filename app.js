import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes.js';
import "./cpuLoad.js"; // Start CPU monitoring

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then((res)=>{
    console.log("Database connected!");
})
.catch((err)=>{
    console.log("Some error occured while connecting to DB.",err);
    process.exit(1);
})


app.use('/api',routes);
app.listen((process.env.PORT), () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
