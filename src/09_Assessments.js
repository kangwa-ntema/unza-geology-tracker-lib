// 09_Assessments.gs

// ==============================================
// ASSESSMENTS MODULE - COMPLETE
// ==============================================

function viewAssessments() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const assessmentsSheet = ss.getSheetByName('_assessments');
  const coursesSheet = ss.getSheetByName('_courses');

  if (!assessmentsSheet || assessmentsSheet.getLastRow() < 2) {
    showAlert('No assessments found', 'info');
    return;
  }

  const courses = coursesSheet.getDataRange().getValues().slice(1);
  const courseMap = {};
  courses.forEach((c) => (courseMap[c[0]] = c[1] + ' - ' + c[2]));

  const assessments = assessmentsSheet.getDataRange().getValues().slice(1);

  let tableRows = '';
  assessments.forEach((ass) => {
    const courseInfo = courseMap[ass[1]] || 'Unknown Course';
    tableRows += `
      <tr>
        <td>${courseInfo}</td>
        <td>${ass[2]}</td>
        <td>${ass[3]}</td>
        <td>${ass[4]}%</td>
        <td>${ass[5]}</td>
        <td>${ass[6] || 'No due date'}</td>
        <td>
          <button onclick="editAssessment(${ass[0]})" style="background:none; border:none; color:#1a73e8; cursor:pointer;">✏️</button>
          <button onclick="deleteAssessment(${ass[0]})" style="background:none; border:none; color:#d93025; cursor:pointer;">🗑️</button>
        </td>
      </tr>
    `;
  });

  const content = getBaseHTML(`
    <div class="header">
      <h2>📝 Assessments</h2>
      <p>All assignments, tests, and exams</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <button class="btn btn-primary" onclick="addAssessment()">➕ Add Assessment</button>
    </div>
    
    <table class="table">
      <thead>
        <tr>
          <th>Course</th>
          <th>Type</th>
          <th>Name</th>
          <th>Weight</th>
          <th>Max Score</th>
          <th>Due Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    
    <script>
      function addAssessment() {
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .showAddAssessmentModal();
      }
      
      function editAssessment(id) {
        alert('Edit feature coming soon');
      }
      
      function deleteAssessment(id) {
        if (confirm('Delete this assessment?')) {
          google.script.run
            .withSuccessHandler(() => {
              alert('Assessment deleted');
              google.script.host.close();
            })
            .deleteAssessment(id);
        }
      }
    </script>
  `);

  showModal('📝 Assessments', content, 1000, 600);
}

function showAddAssessmentModal() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const coursesSheet = ss.getSheetByName('_courses');
  const courses = coursesSheet.getDataRange().getValues().slice(1);

  let courseOptions = '';
  courses.forEach((c) => {
    courseOptions += `<option value="${c[0]}">${c[1]} - ${c[2]}</option>`;
  });

  const content = getBaseHTML(`
    <div class="header">
      <h2>➕ Add Assessment</h2>
      <p>Add a new assignment, test, or exam</p>
    </div>
    
    <form id="assessmentForm">
      <div class="form-group">
        <label>Course *</label>
        <select class="form-control" id="courseId" required>
          <option value="">Select a course...</option>
          ${courseOptions}
        </select>
      </div>
      
      <div class="form-group">
        <label>Assessment Type *</label>
        <select class="form-control" id="type" required>
          <option value="Assignment">Assignment</option>
          <option value="Test">Test</option>
          <option value="Quiz">Quiz</option>
          <option value="Lab">Lab</option>
          <option value="Project">Project</option>
          <option value="Exam">Exam</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Assessment Name *</label>
        <input type="text" class="form-control" id="name" placeholder="e.g., Final Exam" required>
      </div>
      
      <div class="form-group">
        <label>Weight (%) *</label>
        <input type="number" class="form-control" id="weight" min="0" max="100" value="10" required>
      </div>
      
      <div class="form-group">
        <label>Max Score *</label>
        <input type="number" class="form-control" id="maxScore" min="1" value="100" required>
      </div>
      
      <div class="form-group">
        <label>Due Date</label>
        <input type="date" class="form-control" id="dueDate">
      </div>
      
      <div class="form-group">
        <label>Academic Year</label>
        <input type="text" class="form-control" id="academicYear" value="${new Date().getFullYear()}">
      </div>
      
      <div class="form-group">
        <label>Notes</label>
        <textarea class="form-control" id="notes" rows="2"></textarea>
      </div>
      
      <div class="btn-group">
        <button type="button" class="btn btn-primary" onclick="saveAssessment()">Save Assessment</button>
        <button type="button" class="btn btn-secondary" onclick="google.script.host.close()">Cancel</button>
      </div>
    </form>
    
    <script>
      function saveAssessment() {
        const data = {
          courseId: parseInt(document.getElementById('courseId').value),
          type: document.getElementById('type').value,
          name: document.getElementById('name').value,
          weight: parseFloat(document.getElementById('weight').value),
          maxScore: parseFloat(document.getElementById('maxScore').value),
          dueDate: document.getElementById('dueDate').value,
          academicYear: document.getElementById('academicYear').value,
          notes: document.getElementById('notes').value
        };
        
        if (!data.courseId || !data.name) {
          alert('Please fill all required fields');
          return;
        }
        
        google.script.run
          .withSuccessHandler(() => {
            alert('✅ Assessment added successfully!');
            google.script.host.close();
          })
          .saveAssessment(data);
      }
    </script>
  `);

  showModal('➕ Add Assessment', content, 500, 700);
}

function saveAssessment(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_assessments');

  const lastRow = sheet.getLastRow();
  const newId = lastRow;

  sheet.appendRow([
    newId,
    data.courseId,
    data.type,
    data.name,
    data.weight,
    data.maxScore,
    data.dueDate,
    data.academicYear,
    data.notes,
  ]);

  showToast(`Assessment ${data.name} added`, 'Success');
}

function deleteAssessment(assessmentId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const assessmentsSheet = ss.getSheetByName('_assessments');
  const gradesSheet = ss.getSheetByName('_grades');

  const grades = gradesSheet.getDataRange().getValues();
  for (let i = grades.length - 1; i >= 1; i--) {
    if (grades[i][2] === assessmentId) {
      gradesSheet.deleteRow(i + 1);
    }
  }

  for (let i = assessmentsSheet.getLastRow(); i >= 2; i--) {
    if (assessmentsSheet.getRange(i, 1).getValue() === assessmentId) {
      assessmentsSheet.deleteRow(i);
      break;
    }
  }

  showToast('Assessment deleted', 'Success');
}
