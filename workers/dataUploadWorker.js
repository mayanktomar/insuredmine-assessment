import { parentPort, workerData } from "worker_threads";
import xlsx from "xlsx";
import mongoose from "mongoose";
import User from "../models/User.js";
import Policy from "../models/Policy.js";
import Carrier from "../models/Carrier.js";
import LOB from "../models/LOB.js";
import Account from "../models/Account.js";
import Agent from "../models/Agent.js";
import dotenv from "dotenv";

const BATCH_SIZE = 100;

dotenv.config();

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Worker: MongoDB Connected!");
    } catch (error) {
        console.error("Worker: MongoDB Connection Error:", error);
        process.exit(1);
    }
};

const excelDateToJSDate = (excelSerialDate) => {
    return new Date((excelSerialDate - 25569) * 86400000);
};

let upload = async () => {
    try {
        console.log('here1...');
        await connectDB();
        console.log('here2...')
        const workbook = xlsx.readFile(workerData.filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        console.log(`Processing ${jsonData.length} records in batches of ${BATCH_SIZE}...`);

        for (let i = 0; i < jsonData.length; i += BATCH_SIZE) {
            console.log(`Processing for index: ${i}`)
            const batch = jsonData.slice(i, i + BATCH_SIZE); // Get batch of records

            const userOps = [];
            const agentOps = [];
            const accountOps = [];
            const carrierOps = [];
            const lobOps = [];
            const policyOps = [];

            batch.forEach(row => {
                userOps.push({
                    updateOne: {
                        filter: { email: row.email },
                        update: {
                            first_name: row.firstname,
                            dob: excelDateToJSDate(row.dob),
                            address: row.address,
                            phone: row.phone,
                            state: row.state,
                            zip: row.zip,
                            gender: row.gender,
                            user_type: row.userType
                        },
                        upsert: true
                    }
                });

                agentOps.push({
                    updateOne: {
                        filter: { agent_name: row.agent },
                        update: { agent_name: row.agent },
                        upsert: true
                    }
                });

                accountOps.push({
                    updateOne: {
                        filter: { account_name: row.account_name },
                        update: { account_name: row.account_name },
                        upsert: true
                    }
                });

                carrierOps.push({
                    updateOne: {
                        filter: { company_name: row.company_name },
                        update: { company_name: row.company_name },
                        upsert: true
                    }
                });

                lobOps.push({
                    updateOne: {
                        filter: { category_name: row.category_name },
                        update: { category_name: row.category_name },
                        upsert: true
                    }
                });
            });

            await Promise.all([
                User.bulkWrite(userOps),
                Agent.bulkWrite(agentOps),
                Account.bulkWrite(accountOps),
                Carrier.bulkWrite(carrierOps),
                LOB.bulkWrite(lobOps)
            ]);


            const users = await User.find({ email: { $in: batch.map(r => r.email) } });
            const agents = await Agent.find({ agent_name: { $in: batch.map(r => r.agent) } });
            const accounts = await Account.find({ account_name: { $in: batch.map(r => r.account_name) } });
            const carriers = await Carrier.find({ company_name: { $in: batch.map(r => r.company_name) } });
            const lobs = await LOB.find({ category_name: { $in: batch.map(r => r.category_name) } });

            const userMap = new Map(users.map(user => [user.email, user._id]));
            const agentMap = new Map(agents.map(a => [a.agent_name, a._id]));
            const accountMap = new Map(accounts.map(acc => [acc.account_name, acc._id]));
            const carrierMap = new Map(carriers.map(c => [c.company_name, c._id]));
            const lobMap = new Map(lobs.map(lob => [lob.category_name, lob._id]));

            
            batch.forEach(row => {
                policyOps.push({
                    policy_number: row.policy_number,
                    policy_start_date: excelDateToJSDate(row.policy_start_date),
                    policy_end_date: excelDateToJSDate(row.policy_end_date),
                    category: lobMap.get(row.category_name),
                    company: carrierMap.get(row.company_name),
                    user: userMap.get(row.email),
                    agent: agentMap.get(row.agent),
                    account: accountMap.get(row.account_name)
                });
            });

            await Policy.insertMany(policyOps);

            console.log(`Inserted batch ${i / BATCH_SIZE + 1}`);
        }

        parentPort.postMessage("Data uploaded successfully in batches!");
    } catch (error) {
        parentPort.postMessage(`Error: ${error.message}`);
    }
}

upload();