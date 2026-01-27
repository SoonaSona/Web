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

// ===== MAIN (หน้าโล่ง) =====
app.get("/main", (req, res) => {
  res.render("pages/main");
});

// ===== SUB PAGES =====
app.get("/main/admit", (req, res) => {
  res.render("pages/admit");
});

app.get("/main/nurse", (req, res) => {
  res.render("pages/nurse");
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
