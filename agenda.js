import Agenda from "agenda";
import Message from "./models/Message.js";
import dotenv from 'dotenv';
dotenv.config();

const mongoConnectionString = process.env.MONGO_URI; 

const agenda = new Agenda({ db: { address: mongoConnectionString, collection: "jobs" } });

agenda.define("insert_message", async (job) => {
    const { message } = job.attrs.data;
    console.log(`✅ Inserting scheduled message: ${message}`);
    

    await Message.create({ message, scheduledAt: new Date(), status: "sent" });
});

await agenda.start();

export default agenda;
