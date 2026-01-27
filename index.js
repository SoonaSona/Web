const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));

app.set("views", path.join(__dirname, "ejs"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layout/main");

// ==========================================
// 1. สร้าง Mock Data (ข้อมูลจำลอง HOSxP)
// ==========================================
const mockPatients = [
  {
    hn: "6732818224",
    bed: "324",
    name: "นายนัททนันท์ หวังตอก",
    age: 25,
    doctor: "นพ. ภูบดี แช่มช้อย",
    an: "67000123",
    admitDate: "30 ม.ค. 68",
    dx: "Dengue Fever (ไข้เลือดออก)",
    vitals: "T:38.5 BP:110/70 P:98 R:20 SpO2:98%",
    orders: [
      {
        date: "30/01/68 09:00",
        type: "One Day",
        item: "5% D/N/2 1000 ml IV rate 80 ml/hr",
        status: "Verified",
      },
      {
        date: "30/01/68 09:00",
        type: "Continue",
        item: "Paracetamol 500mg 1 tab oral prn q 4 hr for fever > 38.0",
        status: "Verified",
      },
      {
        date: "30/01/68 09:00",
        type: "Continue",
        item: "Plasil 10 mg IV prn q 6 hr for N/V",
        status: "Verified",
      },
      {
        date: "30/01/68 14:00",
        type: "One Day",
        item: "Keep Platelet > 50,000 monitoring",
        status: "Verified",
      },
    ],
    nurseNotes: [
      {
        time: "08:00",
        focus: "Admission",
        text: "รับย้ายจาก ER รู้สึกตัวดี มีไข้สูง หน้าแดง บ่นปวดศีรษะ ปวดกระบอกตา BP 110/70 mmHg",
        recorder: "พยาบาล A",
      },
      {
        time: "10:00",
        focus: "Fever",
        text: "T=38.5 C ให้เช็ดตัวลดไข้ (Tepid sponge) และดูแลให้ยา Paracetamol ตามแผนการรักษา",
        recorder: "พยาบาล A",
      },
      {
        time: "12:00",
        focus: "Risk for Bleeding",
        text: "สังเกตอาการเลือดออกตามไรฟัน หรือจุดจ้ำเลือดตามตัว ยังไม่พบ",
        recorder: "พยาบาล B",
      },
    ],
    medication: [
      {
        name: "Paracetamol 500mg",
        dose: "1 tab",
        route: "Oral",
        time: "prn",
        last_given: "10:15 (30/01)",
      },
      {
        name: "Plasil 10 mg",
        dose: "1 amp",
        route: "IV",
        time: "prn",
        last_given: "-",
      },
    ],
    lab: [
      {
        name: "CBC (Complete Blood Count)",
        items: [
          { test: "Hb", result: "14.5", unit: "g/dL", flag: "Normal" },
          { test: "Hct", result: "43.5", unit: "%", flag: "Normal" },
          { test: "WBC", result: "3,500", unit: "cell/mm3", flag: "Low (L)" },
          { test: "Plt", result: "85,000", unit: "cell/mm3", flag: "Low (L)" },
        ],
      },
    ],
  },
  {
    hn: "6732818225",
    bed: "325",
    name: "นางสาวใจดี มีสุข",
    age: 42,
    doctor: "พญ. สมหญิง จริงใจ",
    an: "67000124",
    admitDate: "30 ม.ค. 68",
    dx: "Acute Gastroenteritis (ลำไส้อักเสบเฉียบพลัน)",
    vitals: "T:37.0 BP:100/60 P:82 R:18",
    orders: [
      {
        date: "30/01/68 10:20",
        type: "Continue",
        item: "NSS 1000 ml IV rate 100 ml/hr",
        status: "Verified",
      },
      {
        date: "30/01/68 10:20",
        type: "Continue",
        item: "Ciprofloxacin 500 mg 1 tab oral pc bid",
        status: "Verified",
      },
      {
        date: "30/01/68 10:20",
        type: "Continue",
        item: "ORS จิบเรื่อยๆ",
        status: "Verified",
      },
      {
        date: "30/01/68 10:25",
        type: "One Day",
        item: "Stool Exam, Stool Culture",
        status: "Pending",
      },
    ],
    nurseNotes: [
      {
        time: "11:00",
        focus: "Diarrhea",
        text: "ถ่ายเหลวเป็นน้ำ 3 ครั้ง ปริมาณรวมประมาณ 500 ml ไม่มีมูกเลือดปน",
        recorder: "พยาบาล C",
      },
      {
        time: "11:30",
        focus: "Pain",
        text: "บ่นปวดท้องบิดเกร็ง (Cramping pain) Pain score 6/10 ดูแลให้นอนพัก",
        recorder: "พยาบาล C",
      },
    ],
    medication: [
      {
        name: "Ciprofloxacin 500 mg",
        dose: "1 tab",
        route: "Oral",
        time: "08:00 - 20:00",
        last_given: "รอให้มื้อเย็น",
      },
      {
        name: "ORS",
        dose: "1 sa",
        route: "Oral",
        time: "prn",
        last_given: "10:30 (30/01)",
      },
    ],
    lab: [
      {
        name: "Electrolyte",
        items: [
          { test: "Na", result: "135", unit: "mmol/L", flag: "Normal" },
          { test: "K", result: "3.2", unit: "mmol/L", flag: "Low (L)" },
          { test: "Cl", result: "98", unit: "mmol/L", flag: "Normal" },
          { test: "CO2", result: "22", unit: "mmol/L", flag: "Normal" },
        ],
      },
    ],
  },
  {
    hn: "6732818299",
    bed: "326",
    name: "นายสมชาย แข็งแรง",
    age: 55,
    doctor: "นพ. ผ่าตัด เชี่ยวชาญ",
    an: "67000188",
    admitDate: "29 ม.ค. 68",
    dx: "Acute Appendicitis s/p Appendectomy (หลังผ่าตัดไส้ติ่ง)",
    vitals: "T:37.2 BP:130/80 P:78 R:20 Pain:4/10",
    orders: [
      {
        date: "29/01/68 18:00",
        type: "One Day",
        item: "Set OR for Appendectomy",
        status: "Done",
      },
      {
        date: "30/01/68 06:00",
        type: "Continue",
        item: "NPO until bowel sound active",
        status: "Verified",
      },
      {
        date: "30/01/68 06:00",
        type: "Continue",
        item: "Ceftriaxone 2 gm IV OD",
        status: "Verified",
      },
      {
        date: "30/01/68 06:00",
        type: "Continue",
        item: "Morphine 3 mg IV prn q 4 hr for pain > 5",
        status: "Verified",
      },
    ],
    nurseNotes: [
      {
        time: "06:00",
        focus: "Post-Op Day 1",
        text: "ผู้ป่วยรู้สึกตัวดี แผลผ่าตัดแห้งดี ไม่มีเลือดซึม (Dry dressing) ยังไม่ผายลม",
        recorder: "พยาบาลเวรดึก",
      },
      {
        time: "10:00",
        focus: "Pain Control",
        text: "บ่นปวดแผล Pain score 4/10 แนะนำท่านอน Semi-Fowler และสอนวิธีประคองแผลเมื่อไอ",
        recorder: "พยาบาล A",
      },
    ],
    medication: [
      {
        name: "Ceftriaxone 2g",
        dose: "2 g",
        route: "IV",
        time: "10:00",
        last_given: "10:00 (30/01)",
      },
      {
        name: "Morphine",
        dose: "3 mg",
        route: "IV",
        time: "prn",
        last_given: "04:00 (30/01)",
      },
    ],
    lab: [
      {
        name: "CBC (Pre-Op)",
        items: [
          { test: "WBC", result: "15,400", unit: "cell/mm3", flag: "High (H)" },
          { test: "Neutrophil", result: "85", unit: "%", flag: "High (H)" },
          { test: "Plt", result: "250,000", unit: "cell/mm3", flag: "Normal" },
        ],
      },
    ],
  },
  {
    hn: "6732818300",
    bed: "327",
    name: "นางสายใจ หายใจลำบาก",
    age: 72,
    doctor: "พญ. ปอด โปร่งใส",
    an: "67000190",
    admitDate: "28 ม.ค. 68",
    dx: "Pneumonia (ปอดอักเสบ)",
    vitals: "T:37.8 BP:140/90 P:92 R:24 SpO2:94% (On Cannula)",
    orders: [
      {
        date: "28/01/68 14:00",
        type: "Continue",
        item: "Oxygen Cannula 3 LPM keep SpO2 > 95%",
        status: "Verified",
      },
      {
        date: "28/01/68 14:00",
        type: "Continue",
        item: "Augmentin 1.2 g IV q 8 hr",
        status: "Verified",
      },
      {
        date: "29/01/68 09:00",
        type: "Continue",
        item: "Ventolin NB q 6 hr",
        status: "Verified",
      },
      {
        date: "30/01/68 08:00",
        type: "One Day",
        item: "CXR PA Upright (Portable)",
        status: "Pending",
      },
    ],
    nurseNotes: [
      {
        time: "08:00",
        focus: "Respiratory",
        text: "หายใจเหนื่อยเล็กน้อย R=24 bpm, lung sound: crepitation both lower lung. On O2 cannula 3 LPM",
        recorder: "พยาบาล A",
      },
      {
        time: "09:30",
        focus: "Treatment",
        text: "พ่นยา Ventolin ตามแผนการรักษา หลังพ่นยาผู้ป่วยแจ้งว่าหายใจสะดวกขึ้น",
        recorder: "พยาบาล A",
      },
    ],
    medication: [
      {
        name: "Augmentin 1.2g",
        dose: "1 vial",
        route: "IV",
        time: "06-14-22",
        last_given: "06:00 (30/01)",
      },
      {
        name: "Ventolin NB",
        dose: "1 nb",
        route: "Inhale",
        time: "09-15-21-03",
        last_given: "09:30 (30/01)",
      },
    ],
    lab: [
      {
        name: "Arterial Blood Gas",
        items: [
          { test: "pH", result: "7.35", unit: "", flag: "Normal" },
          { test: "pCO2", result: "45", unit: "mmHg", flag: "Normal" },
          { test: "pO2", result: "80", unit: "mmHg", flag: "Low (L)" },
          { test: "HCO3", result: "24", unit: "mEq/L", flag: "Normal" },
        ],
      },
      {
        name: "Sputum Culture",
        items: [
          {
            test: "Gram Stain",
            result: "G-ve Rods",
            unit: "",
            flag: "Positive",
          },
        ],
      },
    ],
  },
  {
    hn: "6732818312",
    bed: "328",
    name: "นายวิชัย ไตวาย",
    age: 60,
    doctor: "นพ. อายุรศาสตร์",
    an: "67000201",
    admitDate: "30 ม.ค. 68",
    dx: "CKD Stage 5 with Volume Overload (ไตวายเรื้อรัง)",
    vitals: "T:36.8 BP:160/95 P:88 R:22 SpO2:96%",
    orders: [
      {
        date: "30/01/68 08:30",
        type: "Continue",
        item: "Limit Water 800 ml/day",
        status: "Verified",
      },
      {
        date: "30/01/68 08:30",
        type: "Continue",
        item: "Furosemide (Lasix) 40 mg IV bid",
        status: "Verified",
      },
      {
        date: "30/01/68 08:30",
        type: "Continue",
        item: "Record Intake/Output strictly",
        status: "Verified",
      },
      {
        date: "30/01/68 09:00",
        type: "One Day",
        item: "Consult Kidney Specialist (Nephro)",
        status: "Pending",
      },
    ],
    nurseNotes: [
      {
        time: "09:00",
        focus: "Fluid Volume Excess",
        text: "ผู้ป่วยมีอาการบวมกดบุ๋มที่ขา 2 ข้าง (Pitting edema 2+) ฟังปอดมีเสียง Rhonchi เล็กน้อย",
        recorder: "พยาบาล A",
      },
      {
        time: "12:00",
        focus: "Output",
        text: "ปัสสาวะออก 150 ml สีเหลืองเข้ม หลังได้ยาขับปัสสาวะ",
        recorder: "พยาบาล B",
      },
    ],
    medication: [
      {
        name: "Furosemide 40mg",
        dose: "40 mg",
        route: "IV",
        time: "08-16",
        last_given: "08:45 (30/01)",
      },
      {
        name: "Amlodipine 5mg",
        dose: "1 tab",
        route: "Oral",
        time: "08:00",
        last_given: "08:00 (30/01)",
      },
    ],
    lab: [
      {
        name: "Kidney Function (Renal)",
        items: [
          { test: "BUN", result: "85", unit: "mg/dL", flag: "High (H)" },
          {
            test: "Creatinine",
            result: "5.4",
            unit: "mg/dL",
            flag: "High (H)",
          },
          { test: "GFR", result: "12", unit: "ml/min", flag: "Low (L)" },
        ],
      },
      {
        name: "Electrolyte",
        items: [{ test: "K", result: "5.8", unit: "mmol/L", flag: "High (H)" }],
      },
    ],
  },
];

// ===== LOGIN =====
app.get("/", (req, res) => {
  res.render("login", { layout: false });
});

app.post("/login", (req, res) => {
  res.redirect("/room");
});

// ===== ROOM =====
app.get("/room", (req, res) => {
  res.render("room", { layout: false, error: null });
});

app.post("/room", (req, res) => {
  const { roomPassword } = req.body;
  if (roomPassword === "1234") {
    res.redirect("/main");
  } else {
    res.render("room", {
      layout: false,
      error: "รหัสห้องไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
    });
  }
});

// ===== MAIN =====
app.get("/main", (req, res) => {
  res.render("pages/main");
});

// ===== SUB PAGES =====
app.get("/main/admit", (req, res) => {
  res.render("pages/admit");
});

// 2. แก้ไข Route Nurse ให้ส่งข้อมูล mockPatients ไปด้วย
app.get("/main/nurse", (req, res) => {
  // ส่ง object ชื่อ patients ไปที่หน้า view
  res.render("pages/nurse", { patients: mockPatients });
});

app.get("/main/preadmit", (req, res) => {
  res.render("pages/preadmit");
});

app.get("/main/food", (req, res) => {
  res.render("pages/food");
});

app.get("/main/medicine", (req, res) => {
  res.render("pages/medicine");
});

app.listen(3000, () => {
  console.log("server running → http://localhost:3000");
});
