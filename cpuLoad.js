import os from "os";
import { exec } from "child_process";

const CHECK_INTERVAL = 10000; 
const CPU_THRESHOLD = 70;

const getCPUUsage = () => {
    return new Promise((resolve) => {
        const cpus = os.cpus();
        let totalIdle = 0, totalTick = 0;

        cpus.forEach((cpu) => {
            for (let type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        });

        setTimeout(() => {
            const cpusAfter = os.cpus();
            let totalIdleAfter = 0, totalTickAfter = 0;

            cpusAfter.forEach((cpu) => {
                for (let type in cpu.times) {
                    totalTickAfter += cpu.times[type];
                }
                totalIdleAfter += cpu.times.idle;
            });

            const idle = totalIdleAfter - totalIdle;
            const total = totalTickAfter - totalTick;
            const usage = 100 - (idle / total) * 100;

            resolve(usage.toFixed(2));
        }, 1000);
    });
};

const monitorCPU = async () => {
    const usage = await getCPUUsage();
    console.log(`⚡ CPU Usage: ${usage}%`);

    if (usage > CPU_THRESHOLD) {
        console.log("🚨 CPU usage exceeded 70%! Restarting server...");
        exec("pm2 restart all", (error, stdout, stderr) => {
            if (error) console.error(`Error restarting server: ${error.message}`);
            if (stderr) console.error(`Stderr: ${stderr}`);
            console.log(`✅ Server Restarted: ${stdout}`);
        });
    }
};

setInterval(monitorCPU, CHECK_INTERVAL);
