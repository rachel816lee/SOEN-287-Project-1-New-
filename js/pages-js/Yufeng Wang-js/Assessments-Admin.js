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

/* Elements */
const pageSelect = document.getElementById("pageSelect");
const roleToggle = document.getElementById("roleToggle");
const themeToggle = document.getElementById("themeToggle");
const courseGrid = document.getElementById("courseGrid");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const adminStructureList = document.getElementById("adminStructureList");

/* Redirection Logic */
function navigate(role) {
  if (role === "admin") {
    window.location.href = "Admin-Management-Assessments.html";
  } else {
    window.location.href = "Student-Assessments.html";
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("theme-dark");
  document.body.classList.toggle("theme-light", !isDark);
  themeToggle.innerText = isDark ? "Dark/Light" : "Light/Dark";
}

function createStructureRow(index, container) {
  const row = document.createElement("div");
  row.className = "structure-row";
  row.innerHTML = `
    <div class="idx">${index}</div>
    <select class="input">${categories.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
    <input type="number" class="input weight-input" placeholder="%" />
  `;
  container.appendChild(row);
}

/* Initialization for Student Page */
if (courseGrid) {
  courses.forEach(c => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h2>${c.name}</h2><p>Overall Progress: ${c.progress}%</p>`;
    card.onclick = () => {
      document.getElementById("drawerTitle").innerText = `Edit: ${c.name}`;
      document.getElementById("drawerName").value = c.name;
      const list = document.getElementById("structureList");
      list.innerHTML = "";
      createStructureRow(1, list);
      drawer.setAttribute("aria-hidden", "false");
      overlay.classList.remove("hidden");
    };
    courseGrid.appendChild(card);
  });

  document.getElementById("drawerClose").onclick = () => {
    drawer.setAttribute("aria-hidden", "true");
    overlay.classList.add("hidden");
  };
  
  document.getElementById("addMore").onclick = () => {
    const list = document.getElementById("structureList");
    createStructureRow(list.querySelectorAll(".structure-row").length + 1, list);
  };
}

/* Initialization for Admin Page */
if (adminStructureList) {
  createStructureRow(1, adminStructureList);
  document.getElementById("adminAddMore").onclick = () => {
    createStructureRow(adminStructureList.querySelectorAll(".structure-row").length + 1, adminStructureList);
  };
  
  document.getElementById("adminSave").onclick = () => {
    alert("Saved assessment structure successfully.");
  };
}

/* Listeners */
if (pageSelect) pageSelect.onchange = (e) => navigate(e.target.value);
if (roleToggle) roleToggle.onclick = () => {
  const next = document.body.classList.contains("role-student") ? "admin" : "student";
  navigate(next);
};
if (themeToggle) themeToggle.onclick = toggleTheme;