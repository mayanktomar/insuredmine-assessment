# 🚀 Node.js & MongoDB Assessment Project

## 📌 Overview
This project is a **Node.js** and **MongoDB**-based application that performs various operations including **batch CSV data import, search APIs, aggregation, CPU monitoring, and scheduled job execution** using **worker threads and Agenda.js**.

## 🏗️ Features Implemented

### **1️⃣ Batch CSV Upload (Worker Threads)**
- Uploads a CSV/XLSX file and inserts data into multiple MongoDB collections using **worker threads** for parallel processing.
- Uses **batch inserts** to optimize database performance.

### **2️⃣ Search & Aggregation APIs**
- **Search API**: Fetch policy information by **username**.
- **Aggregation API**: Retrieve aggregated policy data grouped by **users**.

### **3️⃣ CPU Monitoring & Auto Restart**
- Continuously monitors **CPU utilization**.
- Restarts the server automatically if CPU usage exceeds **70%** using **PM2**.

### **4️⃣ Scheduled Message Insertion (Agenda.js)**
- Allows users to schedule messages for a specific **date and time**.
- Uses **Agenda.js** to insert messages into MongoDB at the scheduled time.

---

## 🛠️ Tech Stack
- **Node.js** (Express.js)
- **MongoDB & Mongoose**
- **Worker Threads** (For batch processing)
- **Agenda.js** (For scheduling jobs)
- **PM2** (For process monitoring & auto-restart)
- **Moment.js** (For date-time handling)

---

## 🏃‍♂️ Getting Started

### **1️⃣ Clone the Repository**

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Setup MongoDB**
Make sure MongoDB is running locally or use a **MongoDB Atlas** connection. Update `.env`:
```env
MONGO_URI=mongodb://localhost:27017/yourDB
PORT=3001
```

### **4️⃣ Run the Application**
#### **Using Node.js**
```bash
node app.js
```

#### **Using PM2 (For Auto-Restart on CPU Threshold)**
```bash
npm install -g pm2
pm2 start app.js --name my-node-app
```

---

## 🔥 API Endpoints

### **1️⃣ Upload CSV (Batch Processing)**
```http
POST /api/uploadData
```
**Payload**: Attach CSV/XLSX file as `multipart/form-data`.

### **2️⃣ Search Policy by Username**
```http
POST /api/searchByUser (BODY: username)
```

### **3️⃣ Aggregate Policies by User**
```http
GET /api/aggregateData
```

### **4️⃣ Schedule a Message (Agenda.js)**
```http
POST /api/scheduleMessage
```
**Payload:**
```json
{
  "message": "Reminder: Meeting at 5 PM",
  "day": "2025-03-23",
  "time": "15:30"
}
```

## 🛠️ How the Key Features Are Implemented

### **📌 1. Worker Thread for CSV Processing**
- Uses **worker threads** to process CSV uploads without blocking the main thread.
- Performs **batch inserts** to optimize MongoDB operations.

### **📌 2. PM2 Auto-Restart on High CPU Usage**
- Uses **Node.js `os` module** to monitor CPU usage.
- If CPU usage > **70%**, the server restarts automatically.

### **📌 3. Agenda.js for Scheduled Messages**
- Jobs are stored in MongoDB, ensuring persistence.
- Jobs run even after server restarts.

---

