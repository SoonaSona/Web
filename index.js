const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const mysql = require("mysql2"); // 1. เรียกใช้ mysql
const session = require("express-session"); // 2. เรียกใช้ session
const util = require("util"); // เพิ่มบรรทัดนี้

const app = express();

// 3. เชื่อมต่อฐานข้อมูล (เปลี่ยน password เป็นของคุณเอง)
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // <--- ใส่รหัสผ่าน MySQL ของคุณตรงนี้ (ถ้าไม่มีให้เว้นว่าง)
  database: "hospital_project",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to MySQL Database as id " + connection.threadId);
});

// ตั้งค่า Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));

// 4. ตั้งค่า Session (เพื่อให้จำว่าใครล็อกอินอยู่)
app.use(
  session({
    secret: "hospital_secret_key", // คีย์ลับ (ตั้งอะไรก็ได้)
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, // อายุ session 1 ชั่วโมง
  }),
);

app.set("views", path.join(__dirname, "ejs"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layout/main");

// ===== LOGIN (ด่านที่ 1: ตรวจสอบ User) =====
app.get("/", (req, res) => {
  // ถ้า login เสร็จหมดแล้ว ให้ข้ามไปหน้า main เลย
  if (req.session.loggedin && req.session.roomVerified) {
    return res.redirect("/main");
  }
  res.render("login", { layout: false, error: null });
});

app.post("/login", (req, res) => {
  const { username, password, room } = req.body;

  // เช็ค User/Pass จากตาราง users
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  connection.query(sql, [username, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      // เจอ User: เก็บข้อมูลลง Session
      req.session.loggedin = true;
      req.session.username = username;
      req.session.role = results[0].role;
      req.session.selectedRoomId = room; // จำห้องที่เลือกไว้ เพื่อไปเช็คในด่าน 2

      // ไปด่านต่อไป (Room Login)
      res.redirect("/room");
    } else {
      // ไม่เจอ: แจ้งเตือน
      res.render("login", {
        layout: false,
        error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
      });
    }
  });
});

// ===== ROOM (ด่านที่ 2: ตรวจสอบรหัสห้อง) =====
app.get("/room", (req, res) => {
  // ต้องผ่านด่าน 1 มาก่อน
  if (!req.session.loggedin) {
    return res.redirect("/");
  }
  res.render("room", { layout: false, error: null });
});

app.post("/room", (req, res) => {
  const { roomPassword } = req.body;
  const roomId = req.session.selectedRoomId; // เอา ID ห้องที่เลือกมาจาก Session

  // เช็ค Pass ของห้อง จากตาราง rooms
  const sql = "SELECT * FROM rooms WHERE id = ? AND password = ?";
  connection.query(sql, [roomId, roomPassword], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      // รหัสห้องถูก: ผ่านฉลุย!
      req.session.roomVerified = true;
      req.session.roomName = results[0].name;

      console.log(
        `User: ${req.session.username} entered Room: ${results[0].name}`,
      );
      res.redirect("/main");
    } else {
      // รหัสห้องผิด
      res.render("room", {
        layout: false,
        error: "รหัสห้องไม่ถูกต้อง (กรุณาตรวจสอบกับหัวหน้าแผนก)",
      });
    }
  });
});

// ===== LOGOUT =====
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// ===== MAIN =====
// Middleware เช็คความปลอดภัย (ต้อง Login + รหัสห้องผ่าน ถึงจะเข้าได้)
const checkAuth = (req, res, next) => {
  if (req.session.loggedin && req.session.roomVerified) {
    next();
  } else {
    res.redirect("/");
  }
};

app.get("/main", checkAuth, (req, res) => {
  // ส่งข้อมูล user ไปให้หน้าเว็บแสดงผลด้วย
  res.render("pages/main", {
    user: req.session.username,
    room: req.session.roomName,
    role: req.session.role,
  });
});

// ===== SUB PAGES =====
// ... (โค้ดเดิม) ...

// ... (โค้ดส่วนอื่นเหมือนเดิม)

// GET: หน้า Admit Dashboard
// index.js (แก้ไขทับส่วนเดิม)
app.get("/main/admit", checkAuth, (req, res) => {
  // Query 1: รายชื่อคนไข้ (เหมือนเดิม)
  const sqlPatients = "SELECT * FROM patients ORDER BY hn ASC";

  // Query 2: แก้ตรงนี้! ดึงข้อมูล admissions มาให้หมด (a.*) เพื่อเอาไปใส่กลับในฟอร์ม
  const sqlAdmitted = `
        SELECT a.*, p.first_name, p.last_name, p.age 
        FROM admissions a
        JOIN patients p ON a.hn = p.hn 
        WHERE a.status = 'admitted'
        ORDER BY a.an DESC
    `;

  connection.query(sqlPatients, (err, patientsResult) => {
    if (err) throw err;
    connection.query(sqlAdmitted, (err2, admittedResult) => {
      if (err2) throw err2;

      // ส่งข้อมูลไปหน้าเว็บ
      res.render("pages/admit", {
        patients: patientsResult,
        admittedList: admittedResult,
        user: req.session.username,
      });
    });
  });
});

// ... (โค้ดเดิม)

// index.js

app.post("/main/add-patient", checkAuth, (req, res) => {
  // รับค่าจากฟอร์ม
  let { hn, first_name, last_name, age, weight, height } = req.body;

  // --- แก้ไขตรงนี้: แปลงค่าว่างให้เป็น NULL ก่อนบันทึก ---
  if (age === "") age = null;
  if (weight === "") weight = null;
  if (height === "") height = null;
  // ------------------------------------------------

  const sql =
    "INSERT INTO patients (hn, first_name, last_name, age, weight, height) VALUES (?, ?, ?, ?, ?, ?)";

  connection.query(
    sql,
    [hn, first_name, last_name, age, weight, height],
    (err, result) => {
      if (err) {
        console.error(err); // ดู Error จริงได้ที่นี่

        // แยกข้อความแจ้งเตือนให้ชัดเจนขึ้น
        if (err.code === "ER_DUP_ENTRY") {
          res.send(
            `<script>alert('HN ${hn} มีในระบบอยู่แล้ว!'); window.history.back();</script>`,
          );
        } else {
          // แจ้ง Error จริงๆ ออกไปเลย จะได้รู้ว่าผิดตรงไหน
          res.send(
            `<script>alert('บันทึกไม่ได้: ${err.sqlMessage}'); window.history.back();</script>`,
          );
        }
      } else {
        res.redirect("/main/admit");
      }
    },
  );
});

// POST: บันทึกการ Admit (ส่วนที่ขาดหายไป)
app.post("/main/admit", checkAuth, (req, res) => {
  // 1. รับค่าจากฟอร์ม (ชื่อ name ใน EJS ต้องตรงกับตรงนี้)
  const { hn, admit_date, room_bed, doctor, diagnosis } = req.body;

  // 2. สร้างเลข AN (Admit Number) อัตโนมัติ โดยใช้วันเวลาปัจจุบัน
  const an = "AN" + Math.floor(Date.now() / 1000);

  // 3. แยกเลขห้องกับเตียง (เพราะในฟอร์มส่งมาเป็น "101-1")
  let room_no = "";
  let bed_no = "";

  // กัน Error กรณีไม่ได้เลือกเตียงมา
  if (room_bed && room_bed.includes("-")) {
    [room_no, bed_no] = room_bed.split("-");
  } else {
    room_no = "Wait";
    bed_no = "0";
  }

  // 4. คำสั่ง SQL บันทึกข้อมูล
  // ต้องใส่ status = 'admitted' เพื่อให้ query ในหน้า GET มองเห็น
  const sql = `INSERT INTO admissions 
                 (an, hn, admit_date, room_no, bed_no, main_doctor, diagnosis, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'admitted')`;

  connection.query(
    sql,
    [an, hn, admit_date, room_no, bed_no, doctor, diagnosis],
    (err, result) => {
      if (err) {
        console.error("Save Error:", err);
        // ถ้า Error ให้แจ้งเตือนแล้วเด้งกลับ
        res.send(
          `<script>alert('เกิดข้อผิดพลาด: ${err.sqlMessage}'); window.history.back();</script>`,
        );
      } else {
        console.log(`Saved Admit: ${an} for HN: ${hn}`);
        // บันทึกเสร็จ ให้รีเฟรชหน้าเดิม ข้อมูลจะไปโผล่ด้านขวา
        res.redirect("/main/admit");
      }
    },
  );
});

// ==========================================
//  NURSE STATION (เชื่อมต่อ Database เต็มรูปแบบ)
// ==========================================
app.get("/main/nurse", checkAuth, async (req, res) => {
  // แปลง connection.query ให้เป็น Promise เพื่อใช้ await ได้
  const query = util.promisify(connection.query).bind(connection);

  try {
    // 1. ดึงผู้ป่วยที่ Admit อยู่ (Join ตาราง admissions + patients)
    const sqlPatients = `
            SELECT a.an, a.hn, a.room_no, a.bed_no, a.main_doctor, a.diagnosis, a.admit_date, a.latest_vitals,
                   p.first_name, p.last_name, p.age, p.weight, p.height
            FROM admissions a
            JOIN patients p ON a.hn = p.hn
            WHERE a.status = 'admitted'
            ORDER BY a.room_no ASC, a.bed_no ASC
        `;

    const patientsList = await query(sqlPatients);

    if (patientsList.length === 0) {
      return res.render("pages/nurse", {
        patients: [],
        user: req.session.username,
      });
    }

    // 2. ดึงข้อมูลย่อย (Orders, Notes, Labs) มาเตรียมไว้
    const sqlMedOrders = "SELECT * FROM med_orders ORDER BY created_at DESC";
    const sqlNurseNotes = "SELECT * FROM nurse_notes ORDER BY created_at DESC";
    const sqlLabs = "SELECT * FROM lab_results ORDER BY report_date DESC";

    const [medOrders, nurseNotes, labResults] = await Promise.all([
      query(sqlMedOrders),
      query(sqlNurseNotes),
      query(sqlLabs),
    ]);

    // 3. Map ข้อมูลจัดรูปแบบส่งให้ frontend
    const readyData = patientsList.map((p) => {
      return {
        hn: p.hn,
        an: p.an, // ต้องส่ง AN ไปด้วย เพื่อใช้ตอนอัปเดต
        name: `${p.first_name} ${p.last_name}`,
        bed: `${p.room_no}-${p.bed_no}`,
        doctor: p.main_doctor,
        dx: p.diagnosis,
        age: p.age,
        admitDate: new Date(p.admit_date).toLocaleDateString("th-TH"),

        // --- ส่วนที่ต้องแก้เพื่อให้เข้ากับ Modal แก้ไข ---
        rawWeight: p.weight, // ส่งค่าดิบไปใส่ใน input type="number"
        rawHeight: p.height, // ส่งค่าดิบไปใส่ใน input type="number"

        // ถ้ามี latest_vitals ให้โชว์ ถ้าไม่มีให้สร้าง String จาก BW/HT
        vitals:
          p.latest_vitals ||
          `BW: ${p.weight || "-"} kg, HT: ${p.height || "-"} cm`,
        // ---------------------------------------------

        // Tab 2: Orders
        orders: medOrders
          .filter((m) => m.hn === p.hn)
          .map((m) => ({
            date: new Date(m.created_at).toLocaleDateString("th-TH"),
            type: m.type,
            item: m.med_list,
            status: m.status,
          })),

        // Tab 3: Notes
        nurseNotes: nurseNotes
          .filter((n) => n.hn === p.hn)
          .map((n) => ({
            time: n.note_time,
            focus: n.focus,
            text: n.note_text,
            recorder: n.recorder,
          })),

        // Tab 4: Medication (Admin Record) - จำลองข้อมูล
        medication: medOrders
          .filter((m) => m.hn === p.hn)
          .map((m) => ({
            name: m.med_list,
            dose: "ตามแพทย์สั่ง",
            route: "Oral/IV",
            time: "tid/bid",
            last_given: "-",
          })),

        // Tab 5: Lab Results
        lab: Object.values(
          labResults
            .filter((l) => l.hn === p.hn)
            .reduce((acc, curr) => {
              if (!acc[curr.lab_name]) {
                acc[curr.lab_name] = { name: curr.lab_name, items: [] };
              }
              acc[curr.lab_name].items.push({
                test: curr.test_name,
                result: curr.result_value,
                unit: curr.unit,
                flag: curr.flag,
              });
              return acc;
            }, {}),
        ),
      };
    });

    res.render("pages/nurse", {
      patients: readyData,
      user: req.session.username,
    });
  } catch (err) {
    console.error(err);
    res.send("Error Database: " + err.message);
  }
});

// ==========================================
//  NURSE ACTIONS (บันทึกข้อมูล)
// ==========================================

// 1. บันทึก Nurse Note ใหม่
app.post("/main/save-nurse-note", checkAuth, (req, res) => {
  const { hn, note_time, focus, note_text } = req.body;
  const recorder = req.session.username || "Unknown Nurse";

  const sql =
    "INSERT INTO nurse_notes (hn, note_time, focus, note_text, recorder) VALUES (?, ?, ?, ?, ?)";

  connection.query(sql, [hn, note_time, focus, note_text, recorder], (err) => {
    if (err) {
      console.error("Save Note Error:", err);
      return res.send(
        "<script>alert('Error saving note'); window.history.back();</script>",
      );
    }
    // บันทึกเสร็จ กลับไปหน้า Nurse Station
    res.redirect("/main/nurse");
  });
});

// 2. อัปเดต Vitals และ ข้อมูลร่างกาย (Weight/Height)
app.post("/main/update-vitals", checkAuth, (req, res) => {
  // รับค่า an มาด้วย เพื่อระบุว่าจะอัปเดต admit รอบไหน
  const { hn, an, weight, height, latest_vitals } = req.body;

  // A. อัปเดตข้อมูลถาวร (น้ำหนัก/ส่วนสูง) ลงตาราง patients
  // แปลงค่าว่างเป็น null เพื่อไม่ให้ error
  const w = weight ? weight : null;
  const h = height ? height : null;

  const sqlPatient = "UPDATE patients SET weight = ?, height = ? WHERE hn = ?";

  // B. อัปเดตข้อมูล Vitals text เฉพาะรอบ Admit นี้ ลงตาราง admissions
  const sqlAdmit = "UPDATE admissions SET latest_vitals = ? WHERE an = ?";

  // ทำการ Query ต่อกัน (Chain)
  connection.query(sqlPatient, [w, h, hn], (err) => {
    if (err) {
      console.error("Error update patient:", err);
      return res.send(err.message);
    }

    connection.query(sqlAdmit, [latest_vitals, an], (err2) => {
      if (err2) {
        console.error("Error update admit:", err2);
        return res.send(err2.message);
      }

      // เสร็จแล้วรีเฟรชหน้า
      res.redirect("/main/nurse");
    });
  });
});

// Route สำหรับหน้า Pre-Admit
// ==========================================
//  PRE-ADMIT SYSTEM
// ==========================================

// 1. GET: แสดงหน้า Pre-Admit
// ==========================================
//  PRE-ADMIT ROUTES
// ==========================================

// ==========================================
//  PRE-ADMIT SYSTEM (แก้ไขสมบูรณ์)
// ==========================================

// 1. GET: แสดงหน้า Pre-Admit (เพิ่ม checkAuth เพื่อความปลอดภัย)
app.get("/main/preadmit", checkAuth, (req, res) => {
  // ดึงข้อมูลเรียงตามวันที่ Admit ล่าสุดขึ้นก่อน
  const sql = "SELECT * FROM preadmissions ORDER BY admit_date ASC";

  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.send("Database Error: " + err.message);
    }

    // ส่งข้อมูลไปที่หน้า pages/preadmit.ejs
    res.render("pages/preadmit", {
      preAdmits: results,
      user: req.session.username, // ส่งชื่อ user ไปโชว์มุมขวาบน
      role: req.session.role, // ส่ง role เผื่อใช้ซ่อนปุ่ม
    });
  });
});

// 2. POST: บันทึกข้อมูล Pre-Admit ใหม่
app.post("/main/save-preadmit", checkAuth, (req, res) => {
  // รับค่าจากฟอร์ม
  const { hn, admitDate, patientName, phone, doctor, note } = req.body;

  const sql = `INSERT INTO preadmissions (hn, admit_date, patient_name, phone, doctor_name, note) 
               VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(
    sql,
    [hn, admitDate, patientName, phone, doctor, note],
    (err) => {
      if (err) {
        console.error(err);
        return res.send(
          "<script>alert('บันทึกไม่สำเร็จ: " +
            err.message +
            "'); window.history.back();</script>",
        );
      }
      // บันทึกเสร็จ กลับไปหน้าเดิม (/main/preadmit)
      res.redirect("/main/preadmit");
    },
  );
});

// 3. DELETE: ลบรายการ Pre-Admit
app.get("/main/delete-preadmit/:id", checkAuth, (req, res) => {
  connection.query(
    "DELETE FROM preadmissions WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) console.error(err);
      // ลบเสร็จ กลับไปหน้าเดิม
      res.redirect("/main/preadmit");
    },
  );
});
// index.js

// ---------------------------------------------
// 1. GET: แสดงหน้า Food (ดึงรายชื่อคนไข้ + เมนูอาหาร)
// ---------------------------------------------
// ----------------------------------------------------
// 1. GET: หน้า Food (ดึงรายชื่อคนไข้ + เมนูอาหาร)
// ----------------------------------------------------
// แก้ไข Route /main/food เดิม
app.get("/main/food", checkAuth, (req, res) => {
  // 1. ดึงคนไข้ Admit (สำหรับ Dropdown)
  const sqlPatients = `
        SELECT a.hn, p.first_name, p.last_name, a.room_no, a.bed_no
        FROM admissions a JOIN patients p ON a.hn = p.hn
        WHERE a.status = 'admitted' ORDER BY a.room_no ASC`;

  // 2. ดึงเมนูอาหาร (สำหรับ Dropdown)
  const sqlFood = `SELECT * FROM food_menus ORDER BY type, name`;

  // 3. [เพิ่มใหม่] ดึงประวัติการสั่งอาหารล่าสุด (พร้อมข้อมูลละเอียดจาก Patients)
  const sqlOrders = `
        SELECT d.*, p.gender, p.age, p.weight, p.height, p.phone
        FROM diet_orders d
        LEFT JOIN patients p ON d.hn = p.hn
        ORDER BY d.created_at DESC LIMIT 20
    `;

  connection.query(sqlPatients, (err, patients) => {
    if (err) return res.send(err);

    connection.query(sqlFood, (err2, foods) => {
      if (err2) return res.send(err2);

      connection.query(sqlOrders, (err3, orders) => {
        if (err3) return res.send(err3);

        // ส่งตัวแปร orderList เพิ่มเข้าไป
        res.render("pages/food", {
          admittedList: patients,
          foodList: foods,
          orderList: orders, // ส่งรายการที่สั่งไปแสดงฝั่งขวา
          user: req.session.username,
          role: req.session.role,
        });
      });
    });
  });
});
// ----------------------------------------------------
// 2. POST: บันทึกการสั่งอาหาร
// ----------------------------------------------------
app.post("/main/save-food", checkAuth, (req, res) => {
  const {
    order_date,
    hn,
    patient_name,
    ward,
    bed,
    food_type,
    menu_item,
    quantity,
    supplement,
    supplement_qty,
    calories,
    disease_specific,
    allergies,
    additional_notes,
  } = req.body;

  const sql = `INSERT INTO diet_orders 
    (order_date, hn, patient_name, ward, bed, food_type, menu_item, quantity, 
     supplement, supplement_qty, calories, disease_specific, allergies, additional_notes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    order_date,
    hn,
    patient_name,
    ward,
    bed,
    food_type,
    menu_item,
    quantity,
    supplement,
    supplement_qty,
    calories,
    disease_specific,
    allergies,
    additional_notes,
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.send("Save Error: " + err.sqlMessage);
    } else {
      console.log("บันทึกข้อมูลเรียบร้อย!");
      res.redirect("/main/food"); // บันทึกเสร็จ รีเฟรชหน้าเดิม
    }
  });
});

// ----------------------------------------------------
// Route: หน้า Medicine (ระบบสั่งยา)
// ----------------------------------------------------
// ==========================================
//  MEDICINE SYSTEM (ระบบสั่งยา)
// ==========================================

app.get("/main/medicine", checkAuth, (req, res) => {
  // Query 1: ดึง Order ยา + JOIN เอาชื่อคนไข้และเตียงมาโชว์
  // (เราบันทึกแค่ hn แต่ตอนโชว์ต้องไปดึงชื่อจาก patients และเตียงจาก admissions)
  const sqlOrders = `
        SELECT m.*, p.first_name, p.last_name, a.room_no, a.bed_no
        FROM med_orders m
        LEFT JOIN patients p ON m.hn = p.hn
        LEFT JOIN admissions a ON m.hn = a.hn AND a.status = 'admitted'
        ORDER BY m.created_at DESC
    `;

  // Query 2: ดึงรายชื่อคนไข้ Admit สำหรับใส่ Dropdown
  const sqlPatients = `
        SELECT a.hn, p.first_name, p.last_name, a.room_no, a.bed_no 
        FROM admissions a 
        JOIN patients p ON a.hn = p.hn 
        WHERE a.status = 'admitted'
    `;

  connection.query(sqlOrders, (err, orders) => {
    if (err) {
      console.error(err);
      return res.send("Error fetching orders");
    }

    connection.query(sqlPatients, (err2, patients) => {
      if (err2) {
        console.error(err2);
        return res.send("Error fetching patients");
      }

      res.render("pages/medicine", {
        orders: orders,
        patients: patients,
        user: req.session.username,
        role: req.session.role,
      });
    });
  });
});

// Save (Insert / Update)
// index.js (แก้ทับส่วน POST เดิม)

app.post("/main/save-medicine", checkAuth, (req, res) => {
  // รับค่าจาก Form
  const { id, hn, type, doctor_name, med_list, qty, total_price } = req.body;
  const recorder_name = req.session.username || "System";

  // เช็คว่าเป็นการ "แก้ไข" หรือ "เพิ่มใหม่"
  // ถ้ามี id และ id ไม่ใช่ค่าว่าง "" แปลว่าเป็นการแก้ไข
  if (id && id.trim() !== "") {
    // --- UPDATE (แก้ไข) ---
    console.log(`Updating Order ID: ${id}`);

    const sqlUpdate = `
      UPDATE med_orders 
      SET hn=?, type=?, doctor_name=?, med_list=?, qty=?, total_price=?, recorder_name=?
      WHERE id=?`;

    connection.query(
      sqlUpdate,
      [hn, type, doctor_name, med_list, qty, total_price, recorder_name, id],
      (err) => {
        if (err) {
          console.error("Update Error:", err);
          return res.send(
            "<script>alert('แก้ไขไม่สำเร็จ'); window.history.back();</script>",
          );
        }
        res.redirect("/main/medicine");
      },
    );
  } else {
    // --- INSERT (เพิ่มใหม่) ---
    console.log("Inserting New Order");

    // สร้างเลข Order No.
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const order_no = `RX-${dateStr}-${randomSuffix}`;

    const sqlInsert = `
      INSERT INTO med_orders (order_no, hn, type, doctor_name, med_list, qty, total_price, recorder_name, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'รอจัดยา')`;

    connection.query(
      sqlInsert,
      [
        order_no,
        hn,
        type,
        doctor_name,
        med_list,
        qty,
        total_price,
        recorder_name,
      ],
      (err) => {
        if (err) {
          console.error("Insert Error:", err);
          return res.send(
            "<script>alert('บันทึกไม่สำเร็จ'); window.history.back();</script>",
          );
        }
        res.redirect("/main/medicine");
      },
    );
  }
});

// Delete
app.get("/main/delete-medicine/:id", checkAuth, (req, res) => {
  connection.query(
    "DELETE FROM med_orders WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) console.error(err);
      res.redirect("/main/medicine");
    },
  );
});

// ==========================================
//  ADMIN USER MANAGEMENT (อัปเดตล่าสุด)
// ==========================================

// Middleware: เช็คว่าเป็น Admin เท่านั้น
// ==========================================
//  ADMIN USER MANAGEMENT
// ==========================================

const checkAdmin = (req, res, next) => {
  if (req.session.loggedin && req.session.role === "admin") {
    next();
  } else {
    res.send(
      "<script>alert('เข้าถึงได้เฉพาะ Admin เท่านั้น'); window.history.back();</script>",
    );
  }
};

// ถ้าเข้า /main/admin เฉยๆ ให้เด้งไปหน้า users
app.get("/main/admin", checkAuth, (req, res) => {
  res.redirect("/main/admin/users");
});

// 1. GET: แสดงรายชื่อ User
app.get("/main/admin/users", checkAuth, checkAdmin, (req, res) => {
  const sql = "SELECT * FROM users ORDER BY role ASC, id ASC";

  connection.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.send("Database Error");
    }

    // ✅ แก้ไขตรงนี้: เรียกไฟล์ "pages/admin" ให้ตรงกับชื่อไฟล์จริงของคุณ
    res.render("pages/admin", {
      usersList: results,
      user: req.session.username,
      role: req.session.role,
    });
  });
});

// 2. POST: เพิ่ม User ใหม่ (รองรับ fullname)
app.post("/main/admin/add-user", checkAuth, checkAdmin, (req, res) => {
  // รับค่า fullname มาด้วย
  const { username, password, fullname, role } = req.body;

  // เช็คว่า User ซ้ำไหม
  const sqlCheck = "SELECT * FROM users WHERE username = ?";
  connection.query(sqlCheck, [username], (err, results) => {
    if (results.length > 0) {
      return res.send(
        "<script>alert('Username นี้มีคนใช้แล้ว!'); window.history.back();</script>",
      );
    }

    // Insert ข้อมูลรวมถึง fullname
    const sqlInsert =
      "INSERT INTO users (username, password, fullname, role) VALUES (?, ?, ?, ?)";
    connection.query(sqlInsert, [username, password, fullname, role], (err) => {
      if (err) {
        console.error("Add User Error:", err);
        return res.send(
          "<script>alert('บันทึกไม่สำเร็จ'); window.history.back();</script>",
        );
      }
      res.redirect("/main/admin/users");
    });
  });
});

// 3. DELETE: ลบ User
app.get("/main/admin/delete-user/:id", checkAuth, checkAdmin, (req, res) => {
  const idToDelete = req.params.id;
  const myUsername = req.session.username;

  // ป้องกันการลบตัวเอง
  const sqlCheckSelf = "SELECT * FROM users WHERE id = ?";
  connection.query(sqlCheckSelf, [idToDelete], (err, result) => {
    if (result.length > 0 && result[0].username === myUsername) {
      return res.send(
        "<script>alert('ไม่สามารถลบบัญชีตัวเองขณะล็อกอินอยู่ได้'); window.history.back();</script>",
      );
    }

    const sqlDelete = "DELETE FROM users WHERE id = ?";
    connection.query(sqlDelete, [idToDelete], (err) => {
      if (err) console.error(err);
      res.redirect("/main/admin/users");
    });
  });
});
app.listen(3000, () => {
  console.log("server running → http://localhost:3000");
});
