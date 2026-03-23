var courses = [
  {
    name: "SOEN 287",
    progress: 50,
    assessments: [
      { name: "Assignment 1", category: "pastDue" },
      { name: "Assignment 2", category: "upcoming" },
      { name: "Assignment 3", category: "upcoming" }
    ]
  },
  {
    name: "COMP 346",
    progress: 30,
    assessments: [
      { name: "Lab 1", category: "pastDue" },
      { name: "Project", category: "upcoming" }
    ]
  }
  
];

window.onload = function () {
  showCourses();
  closePanel();

  var cancelBtn = document.querySelector(".cancel_button");
  if (cancelBtn) {
    cancelBtn.onclick = closePanel;
  }

  var saveBtn = document.querySelector(".save_button");
  if (saveBtn) {
    saveBtn.onclick = closePanel;
  }
};

function showCourses() {
  var container = document.querySelector(".course_body");
  if (!container) return;

  container.innerHTML = "";

  for (var i = 0; i < courses.length; i++) {
    var course = courses[i];

    var div = document.createElement("div");
    div.className = "course course_" + (i + 1);
    div.id = "course_" + (i + 1);

    var past = "";
    var upcoming = "";

    for (var j = 0; j < course.assessments.length; j++) {
      var a = course.assessments[j];

      if (a.category === "pastDue") {
        past += "<li>" + a.name + "</li>";
      } else {
        upcoming += "<li>" + a.name + "</li>";
      }
    }

    div.innerHTML =
        "<h2>" + (i + 1) + "</h2>" +
        "<h2>" + course.name + "</h2>" +

        "<h3>Past Due</h3>" +
        "<ol>" + past + "</ol>" +

        "<h3>Upcoming</h3>" +
        "<ol>" + upcoming + "</ol>" +

        "<h3>Course Summary</h3>" +
        "<progress class='course_progress' id='course_progress_" + (i + 1) + 
        "' value='" + course.progress + "' max='100'>" +
        course.progress + "%</progress>";

    div.onclick = makeOpenPanelFunction(div);

    container.appendChild(div);
  }
}

function makeOpenPanelFunction(courseEl) {
  return function () {
    openPanel(courseEl);
  };
}

function buildAssessmentDropdown(courseEl) {
  var assessmentSelect = document.getElementById("assessment_select");
  if (!assessmentSelect) return;

  assessmentSelect.innerHTML = "";

  var items = courseEl.querySelectorAll("li");

  if (items.length === 0) {
    var opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No assessments found";
    assessmentSelect.appendChild(opt);
    return;
  }

  for (var i = 0; i < items.length; i++) {
    var text = items[i].textContent.trim();

    var opt = document.createElement("option");
    opt.value = text;
    opt.textContent = text;
    assessmentSelect.appendChild(opt);
  }
}

function openPanel(courseEl) {
  var panel = document.getElementById("edit_panel");
  if (!panel) return;

  var titleEl = panel.querySelector("h4");
  var h2s = courseEl.querySelectorAll("h2");
  var courseName = "";

  if (h2s.length > 1) {
    courseName = h2s[1].textContent;
  } else {
    courseName = "Course";
  }

  panel.classList.add("is-open");

  if (titleEl) {
    titleEl.textContent = "Edit Assessments - " + courseName;
  }

  buildAssessmentDropdown(courseEl);
}

function closePanel() {
  var panel = document.getElementById("edit_panel");
  if (!panel) return;

  panel.classList.remove("is-open");
}