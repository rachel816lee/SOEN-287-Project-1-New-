const courses = [
  { id: 1, name: "Course 1", progress: 62 },
  { id: 2, name: "Course 2", progress: 48 },
  { id: 3, name: "Course 3", progress: 71 },
  { id: 4, name: "Course 4", progress: 36 },
  { id: 5, name: "Course 5", progress: 83 },
  { id: 6, name: "Course 6", progress: 55 },
  { id: 7, name: "Course 7", progress: 40 },
  { id: 8, name: "Course 8", progress: 66 },
  { id: 9, name: "Course 9", progress: 22 },
];

const categories = ["Assignments", "Labs", "Quizzes", "Exams"];

const pageSelect = document.getElementById("pageSelect");
const pageStudent = document.getElementById("page-student");
const pageAdmin = document.getElementById("page-admin");

const roleToggle = document.getElementById("roleToggle");
const themeToggle = document.getElementById("themeToggle");

const courseGrid = document.getElementById("courseGrid");

const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const drawerClose = document.getElementById("drawerClose");
const drawerTitle = document.getElementById("drawerTitle");
const drawerName = document.getElementById("drawerName");
const structureList = document.getElementById("structureList");
const addMore = document.getElementById("addMore");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");

/* Admin page elements */
const adminStructureList = document.getElementById("adminStructureList");
const adminAddMore = document.getElementById("adminAddMore");
const adminCancel = document.getElementById("adminCancel");
const adminSave = document.getElementById("adminSave");


const mainTitle = document.getElementById("main-title");
const navStu = document.getElementById("nav-student");
const navAdm = document.getElementById("nav-admin");
const footStu = document.getElementById("footer-student");
const footAdm = document.getElementById("footer-admin");


function switchPage(page) {
  if (page === "admin") {
    pageStudent.classList.add("hidden");
    pageAdmin.classList.remove("hidden");
    
    document.body.classList.replace("role-student", "role-admin");
    if (mainTitle) mainTitle.innerText = "Smart Course Companion - Admin Panel";
    
    if (navStu) navStu.classList.add("hidden");
    if (navAdm) navAdm.classList.remove("hidden");
    if (footStu) footStu.classList.add("hidden");
    if (footAdm) footAdm.classList.remove("hidden");
    
  } else {
    pageAdmin.classList.add("hidden");
    pageStudent.classList.remove("hidden");
    
    document.body.classList.replace("role-admin", "role-student");
    if (mainTitle) mainTitle.innerText = "Smart Course Companion";
    
    if (navAdm) navAdm.classList.add("hidden");
    if (navStu) navStu.classList.remove("hidden");
    if (footAdm) footAdm.classList.add("hidden");
    if (footStu) footStu.classList.remove("hidden");
  }
}


function toggleTheme() {
  const isLight = document.body.classList.contains("theme-light");
  if (isLight) {
    document.body.classList.replace("theme-light", "theme-dark");
    themeToggle.innerText = "Dark/Light";
  } else {
    document.body.classList.replace("theme-dark", "theme-light");
    themeToggle.innerText = "Light/Dark";
  }
}

function openDrawer(courseName) {
  drawerTitle.innerText = `Edit: ${courseName}`;
  drawerName.value = courseName;
  resetStructureList(structureList);
  drawer.setAttribute("aria-hidden", "false");
  overlay.classList.remove("hidden");
}

function closeDrawer() {
  drawer.setAttribute("aria-hidden", "true");
  overlay.classList.add("hidden");
}

function resetStructureList(container) {
  container.innerHTML = "";
  createStructureRow(1, container);
}

function createStructureRow(index, container) {
  const row = document.createElement("div");
  row.className = "structure-row";
  
  const idx = document.createElement("div");
  idx.className = "idx";
  idx.innerText = index;
  
  const sel = document.createElement("select");
  sel.className = "input";
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.innerText = cat;
    sel.appendChild(opt);
  });
  
  const weight = document.createElement("input");
  weight.type = "number";
  weight.className = "input weight-input";
  weight.placeholder = "%";
  
  row.appendChild(idx);
  row.appendChild(sel);
  row.appendChild(weight);
  container.appendChild(row);
}

function collectWeights(container) {
  const inputs = container.querySelectorAll(".weight-input");
  let sum = 0;
  inputs.forEach(i => {
    sum += parseFloat(i.value || 0);
  });
  return { sum };
}

/* Initialize grid */
courses.forEach(c => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${c.name}</h2>
    <p>Overall Progress: ${c.progress}%</p>
  `;
  card.addEventListener("click", () => openDrawer(c.name));
  courseGrid.appendChild(card);
});

/* Listeners */
pageSelect.addEventListener("change", (e) => switchPage(e.target.value));

roleToggle.addEventListener("click", () => {
  const now = pageSelect.value === "student" ? "admin" : "student";
  pageSelect.value = now;
  switchPage(now);
});

themeToggle.addEventListener("click", toggleTheme);
drawerClose.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);
cancelBtn.addEventListener("click", closeDrawer);

addMore.addEventListener("click", () => {
  const nextIndex = structureList.querySelectorAll(".structure-row").length + 1;
  createStructureRow(nextIndex, structureList);
});

saveBtn.addEventListener("click", () => {
  const { sum } = collectWeights(structureList);
  alert(`Saved (prototype). Total weighting = ${sum}%.`);
  closeDrawer();
});

/* Admin page behaviors */
resetStructureList(adminStructureList);

adminAddMore.addEventListener("click", () => {
  const nextIndex = adminStructureList.querySelectorAll(".structure-row").length + 1;
  createStructureRow(nextIndex, adminStructureList);
});

adminCancel.addEventListener("click", () => {
  resetStructureList(adminStructureList);
  alert("Canceled (prototype).");
});

adminSave.addEventListener("click", () => {
  const { sum } = collectWeights(adminStructureList);
  if (sum !== 100) {
    alert(`Warning: Total weighting is ${sum}%. Usually it should be 100%.`);
  } else {
    alert("Saved assessment structure.");
  }
});
