import express from "express";
import multer from "multer";
import { Worker } from "worker_threads";
import path from "path";
import User from "./models/User.js";
import Policy from "./models/Policy.js";
import Account from "./models/Account.js";
import Agent from "./models/Agent.js";
import Carrier from "./models/Carrier.js";
import LOB from "./models/LOB.js";
import agenda from "./agenda.js";
import moment from "moment";
import Message from "./models/Message.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, callback) => {
        callback(null, `upload_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

router.post('/uploadData', upload.single("file"), (req,res)=>{
    try {
        if (!req.file) {
            return res.status(400).send({message:"No file passed in body!"})
        }

        const worker = new Worker("./workers/dataUploadWorker.js", {
            workerData: { filePath: req.file.path }
        });

        worker.on("message", (msg) => res.status(200).send({ message: msg }));
        worker.on("error", (err) => res.status(500).send({ message: err.message }));
    } catch (err) {
        return res.status(500).send({message: 'Some error occured!'})
    }
})

router.post("/searchByUser", async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).send({ message: "Username is required" });

        const user = await User.findOne({ first_name: username });
        if (!user) return res.status(404).send({ message: "User not found" });

        const policies = await Policy.find({ user: user._id })
            .populate("category", "category_name") 
            .populate("company", "company_name") 
            .populate("agent", "name") 
            .populate("account", "account_name");

        res.send({ user, policies });
    } catch (error) {
        console.error("Error searching policy by username:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get("/aggregateData", async (req, res) => {
    try {
        const aggregatedData = await Policy.aggregate([
            {
                $group: {
                    _id: "$user",
                    total_policies: { $sum: 1 },
                    policies: { $push: "$policy_number" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user_info"
                }
            },
            { $unwind: "$user_info" },
            {
                $project: {
                    _id: 0,
                    user: "$user_info.first_name",
                    total_policies: 1,
                    policies: 1
                }
            }
        ]);

        res.send(aggregatedData);
    } catch (error) {
        console.error("Error aggregating policies by user:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.post("/scheduleMessage", async (req, res) => {
    try {
        const { message, day, time } = req.body;

        if (!message || !day || !time) {
            return res.status(400).send({ message: "Message, day, and time are required." });
        }
        const scheduleTime = moment(`${day} ${time}`, "YYYY-MM-DD HH:mm").toDate();

        await agenda.schedule(scheduleTime, "insert_message", { message });


        res.json({ message: "Message scheduled successfully!", scheduledAt: scheduleTime });
    } catch (error) {
        console.error("Error scheduling message:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;

