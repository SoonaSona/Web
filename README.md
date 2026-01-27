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

5. Run the app

```bash
npm run dev
```

6. Open the app in your browser

```
http://localhost:3000
```

---

## 🔧 Available Scripts

- `npm run dev` — Start the app in development with auto-reload

You can add a `dev` script in `package.json` for convenience:

```json
"scripts": {
  "dev": "nodemon --ext js,html,css,ejs index.js"
}
```

---
