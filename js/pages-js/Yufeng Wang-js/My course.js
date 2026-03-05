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

// Admin page elements
const adminStructureList = document.getElementById("adminStructureList");
const adminAddMore = document.getElementById("adminAddMore");
const adminCancel = document.getElementById("adminCancel");
const adminSave = document.getElementById("adminSave");

function renderCourses() {
  courseGrid.innerHTML = "";
  courses.forEach((c) => {
    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = `
      <div class="course-title">
        <span class="badge">${c.id}</span>
        <span>${c.name}</span>
      </div>
      <div class="sub-label">Usage Statistics</div>
      <div class="progress-wrap">
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${c.progress}">
          <div class="bar" style="width:${c.progress}%"></div>
        </div>
      </div>
    `;
    card.addEventListener("click", () => openDrawerForCourse(c));
    courseGrid.appendChild(card);
  });
}

function createStructureRow(index, container) {
  const row = document.createElement("div");
  row.className = "structure-row";

  const idx = document.createElement("div");
  idx.className = "idx";
  idx.textContent = String(index);

  const select = document.createElement("select");
  select.className = "select";
  select.style.borderRadius = "12px";
  select.style.padding = "12px";
  select.innerHTML = `<option value="" selected>-- enter the categories here --</option>` +
    categories.map((c) => `<option value="${c}">${c}</option>`).join("");

  const weight = document.createElement("input");
  weight.className = "input";
  weight.type = "number";
  weight.min = "0";
  weight.max = "100";
  weight.placeholder = "-- enter the weighting here --";

  row.appendChild(idx);
  row.appendChild(select);
  row.appendChild(weight);

  container.appendChild(row);
}

function resetStructureList(container) {
  container.innerHTML = "";
  createStructureRow(1, container);
  createStructureRow(2, container);
  createStructureRow(3, container);
}

function openDrawerForCourse(course) {
  drawerTitle.textContent = `Edit Course Assessment — ${course.name}`;
  drawerName.value = course.name;

  resetStructureList(structureList);

  drawer.classList.add("open");
  overlay.classList.remove("hidden");
  drawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  drawer.classList.remove("open");
  overlay.classList.add("hidden");
  drawer.setAttribute("aria-hidden", "true");
}

function switchPage(value) {
  if (value === "student") {
    pageStudent.classList.remove("hidden");
    pageAdmin.classList.add("hidden");
  } else {
    pageAdmin.classList.remove("hidden");
    pageStudent.classList.add("hidden");
  }
}

function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.contains("theme-dark");
  body.classList.toggle("theme-dark", !isDark);
  body.classList.toggle("theme-light", isDark);
}

function collectWeights(container) {
  const rows = [...container.querySelectorAll(".structure-row")];
  const items = rows.map((r) => {
    const sel = r.querySelector("select")?.value || "";
    const w = Number(r.querySelector("input")?.value || 0);
    return { category: sel, weight: w };
  });
  const sum = items.reduce((acc, it) => acc + (Number.isFinite(it.weight) ? it.weight : 0), 0);
  return { items, sum };
}

/* Events */
pageSelect.addEventListener("change", (e) => switchPage(e.target.value));

roleToggle.addEventListener("click", () => {
  // For Deliverable 1 prototype: just toggles the select page to match role
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
  alert(`Saved (prototype). Total weighting = ${sum}%.`);
});

renderCourses();
switchPage("student");



