const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data.json");

function initStorage() {
  if (fs.existsSync(DATA_FILE)) return;
  fs.writeFileSync(DATA_FILE, JSON.stringify({ courses: [] }, null, 2), "utf-8");
}

function loadStorage() {
  initStorage();

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const data = JSON.parse(raw);

    if (!data || typeof data !== "object") return { courses: [] };
    if (!Array.isArray(data.courses)) data.courses = [];

    return data;
  } catch {
    const safe = { courses: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(safe, null, 2), "utf-8");
    return safe;
  }
}

function saveStorage(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function nextId(items) {
  let max = 0;
  for (const it of items) {
    if (typeof it.id === "number" && it.id > max) max = it.id;
  }
  return max + 1;
}

module.exports = { loadStorage, saveStorage, nextId };
