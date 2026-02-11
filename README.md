# 🏥 Hospital IPD System

ระบบจัดการผู้ป่วยใน (Inpatient Department - IPD)

## 👨‍💻 ผู้จัดทำ

| รหัสนักศึกษา | ชื่อ-นามสกุล        | ตำแหน่ง (Role)        |
| :----------- | :------------------ | :-------------------- |
| **67022467** | นายเอกภพ จิโนคำ     | ⚙️ Backend Developer  |
| **67021668** | นายณัฐนันท์ หวังดี  | ⚙️ Backend Developer  |
| **67026292** | นายวนันชัย กิจพินิจ | 🎨 Frontend Developer |
| **67022085** | นายภูบดี แช่มวงษ์   | 🎨 Frontend Developer |

---

## 📌 Project Description

ระบบ IPD สำหรับจัดการข้อมูลผู้ป่วยในโรงพยาบาล  
พัฒนาโดยใช้ Node.js, Express, EJS และ MySQL

---

## Quick Start

1. Clone the repository

```bash
git clone https://github.com/SoonaSona/Web.git
cd Web
```

2. Initialize / install dependencies

```bash
npm init -y
```

3. Install nodemon for development

```bash
npm install express ejs nodemon
```

4.Install layouts for development

```bash
npm install express-ejs-layouts
```

5. Install sql2

```bash
npm install mysql2 express-session
```

6. Import Database (.sql)

```bash
เปิด XAMPP → Start MySQL
เปิด MySQL Workbench
เพิ่ม new schema
เข้าเมนู
Server → Data Import → เลือก schema ที่ต้องการ
เลือกไฟล์
mysql.sql
กด Start Import
**หมายเหตุสำคัญ อย่าลืมคลิกขวาเเล้วกด Reflesh all เเละเปลี่ยนชื่อ database ใน index.js ให้เป็นชื่อเดียวกับที่เชื่อม schema ไว้
```

7. Run the app

```bash
npm run dev
```

8. Open the app in your browser

```
http://localhost:3000
```

---

📂 Project Structure

```bash
Web/
│── index.js
│── package.json
│── hospital_project.sql
│── views/
│   ├── pages/
│   │   ├── preadmit.ejs
│   │   ├── admit.ejs
│   │   └── ...
│── public/
│   ├── css/
│   └── js/
```

## 🔧 Available Scripts

- `npm run dev` — Start the app in development with auto-reload

You can add a `dev` script in `package.json` for convenience:

```json
"scripts": {
  "dev": "nodemon --ext js,html,css,ejs index.js"
}
```

---

## 👤 Default Login (Example)

- Username: `admin`
- Password: `1234`
- Room: `1111`
