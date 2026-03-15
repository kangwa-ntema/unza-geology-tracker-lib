// 10_Grades.gs

// ==============================================
// GRADE MANAGEMENT MODULE - COMPLETE
// ==============================================

function enterGrades() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const assessmentsSheet = ss.getSheetByName('_assessments');
  const coursesSheet = ss.getSheetByName('_courses');

  if (!assessmentsSheet || assessmentsSheet.getLastRow() < 2) {
    showAlert('No assessments found. Add assessments first.', 'info');
    return;
  }

  const courses = coursesSheet.getDataRange().getValues().slice(1);
  const courseMap = {};
  courses.forEach((c) => (courseMap[c[0]] = c[1] + ' - ' + c[2]));

  const assessments = assessmentsSheet.getDataRange().getValues().slice(1);

  let assessmentOptions = '';
  assessments.forEach((ass) => {
    const courseInfo = courseMap[ass[1]] || 'Unknown';
    assessmentOptions += `<option value="${ass[0]}">${courseInfo} - ${ass[3]} (${ass[2]})</option>`;
  });

  const content = getBaseHTML(`
    <div class="header">
      <h2>📊 Enter Grades</h2>
      <p>Record your assessment scores</p>
    </div>
    
    <form id="gradeForm">
      <div class="form-group">
        <label>Select Assessment *</label>
        <select class="form-control" id="assessmentId" required>
          <option value="">Choose an assessment...</option>
          ${assessmentOptions}
        </select>
      </div>
      
      <div class="form-group">
        <label>Score *</label>
        <input type="number" class="form-control" id="score" min="0" step="0.5" required>
      </div>
      
      <div class="form-group">
        <label>Max Score</label>
        <input type="number" class="form-control" id="maxScore" readonly>
      </div>
      
      <div class="form-group">
        <label>Percentage</label>
        <input type="text" class="form-control" id="percentage" readonly>
      </div>
      
      <div class="form-group">
        <label>Grade Date</label>
        <input type="date" class="form-control" id="gradeDate" value="${new Date().toISOString().split('T')[0]}">
      </div>
      
      <div class="form-group">
        <label>Status</label>
        <select class="form-control" id="status">
          <option value="Graded">Graded</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      
      <div class="btn-group">
        <button type="button" class="btn btn-primary" onclick="saveGrade()">Save Grade</button>
        <button type="button" class="btn btn-secondary" onclick="viewAllGrades()">View All Grades</button>
        <button type="button" class="btn btn-secondary" onclick="google.script.host.close()">Cancel</button>
      </div>
    </form>
    
    <script>
      document.getElementById('assessmentId').addEventListener('change', function() {
        const assessmentId = this.value;
        if (assessmentId) {
          google.script.run
            .withSuccessHandler(function(assessment) {
              document.getElementById('maxScore').value = assessment.maxScore;
              calculatePercentage();
            })
            .getAssessmentDetails(parseInt(assessmentId));
        }
      });
      
      document.getElementById('score').addEventListener('input', calculatePercentage);
      
      function calculatePercentage() {
        const score = parseFloat(document.getElementById('score').value) || 0;
        const maxScore = parseFloat(document.getElementById('maxScore').value) || 100;
        const percentage = ((score / maxScore) * 100).toFixed(1);
        document.getElementById('percentage').value = percentage + '%';
      }
      
      function saveGrade() {
        const data = {
          assessmentId: parseInt(document.getElementById('assessmentId').value),
          score: parseFloat(document.getElementById('score').value),
          maxScore: parseFloat(document.getElementById('maxScore').value),
          percentage: parseFloat(document.getElementById('percentage').value),
          gradeDate: document.getElementById('gradeDate').value,
          status: document.getElementById('status').value
        };
        
        if (!data.assessmentId || isNaN(data.score)) {
          alert('Please select an assessment and enter a score');
          return;
        }
        
        google.script.run
          .withSuccessHandler(() => {
            alert('✅ Grade saved successfully!');
            document.getElementById('score').value = '';
          })
          .saveGrade(data);
      }
      
      function viewAllGrades() {
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .viewGrades();
      }
    </script>
  `);

  showModal('📊 Enter Grades', content, 500, 600);
}

function getAssessmentDetails(assessmentId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_assessments');

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === assessmentId) {
      return {
        maxScore: data[i][5],
      };
    }
  }
  return { maxScore: 100 };
}

function saveGrade(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_grades');

  const existingGrades = sheet.getDataRange().getValues();
  for (let i = 1; i < existingGrades.length; i++) {
    if (existingGrades[i][2] === data.assessmentId) {
      sheet.getRange(i + 1, 4).setValue(data.score);
      sheet.getRange(i + 1, 5).setValue(data.percentage);
      sheet.getRange(i + 1, 6).setValue(data.gradeDate);
      sheet.getRange(i + 1, 7).setValue(data.status);
      showToast('Grade updated', 'Success');
      return;
    }
  }

  const lastRow = sheet.getLastRow();
  const newId = lastRow;

  sheet.appendRow([
    newId,
    1,
    data.assessmentId,
    data.score,
    data.percentage,
    data.gradeDate,
    data.status,
  ]);

  showToast('Grade saved', 'Success');
}

function viewGrades() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gradesSheet = ss.getSheetByName('_grades');
  const assessmentsSheet = ss.getSheetByName('_assessments');
  const coursesSheet = ss.getSheetByName('_courses');

  if (!gradesSheet || gradesSheet.getLastRow() < 2) {
    showAlert('No grades recorded yet', 'info');
    return;
  }

  const assessments = assessmentsSheet.getDataRange().getValues().slice(1);
  const courses = coursesSheet.getDataRange().getValues().slice(1);

  const courseMap = {};
  courses.forEach((c) => (courseMap[c[0]] = { code: c[1], name: c[2] }));

  const assessmentMap = {};
  assessments.forEach((a) => {
    assessmentMap[a[0]] = {
      name: a[3],
      type: a[2],
      courseId: a[1],
      maxScore: a[5],
    };
  });

  const grades = gradesSheet.getDataRange().getValues().slice(1);

  let totalPercentage = 0;
  let gradeCount = 0;
  let tableRows = '';

  grades.forEach((grade) => {
    const assessment = assessmentMap[grade[2]];
    if (assessment) {
      const course = courseMap[assessment.courseId];
      const courseCode = course ? course.code : 'Unknown';
      const percentage = grade[4];

      totalPercentage += percentage;
      gradeCount++;

      const gradePoint = percentageToGradePoint(percentage);

      tableRows += `
        <tr>
          <td>${courseCode}</td>
          <td>${assessment.type}</td>
          <td>${assessment.name}</td>
          <td>${grade[3]}/${assessment.maxScore}</td>
          <td>${percentage}%</td>
          <td><span class="badge ${percentage >= 50 ? 'badge-success' : 'badge-danger'}">${gradePoint.toFixed(1)}</span></td>
          <td>${grade[6]}</td>
          <td>
            <button onclick="editGrade(${grade[0]})" style="background:none; border:none; color:#1a73e8; cursor:pointer;">✏️</button>
          </td>
        </tr>
      `;
    }
  });

  const averageGrade = gradeCount > 0 ? (totalPercentage / gradeCount).toFixed(1) : 0;
  const averageGPA = percentageToGradePoint(averageGrade).toFixed(2);

  const content = getBaseHTML(`
    <div class="header">
      <h2>📈 My Grades</h2>
      <p>Average: ${averageGrade}% (GPA: ${averageGPA}/5.0) from ${gradeCount} assessments</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <button class="btn btn-primary" onclick="enterGrades()">➕ Add Grades</button>
    </div>
    
    <table class="table">
      <thead>
        <tr>
          <th>Course</th>
          <th>Type</th>
          <th>Assessment</th>
          <th>Score</th>
          <th>%</th>
          <th>GPA</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    
    <script>
      function enterGrades() {
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .enterGrades();
      }
      
      function editGrade(id) {
        alert('Edit feature coming soon');
      }
    </script>
  `);

  showModal('📈 My Grades', content, 1000, 600);
}

function percentageToGradePoint(percentage) {
  if (percentage >= 75) return 5.0;
  if (percentage >= 70) return 4.5;
  if (percentage >= 65) return 4.0;
  if (percentage >= 60) return 3.5;
  if (percentage >= 55) return 3.0;
  if (percentage >= 50) return 2.5;
  if (percentage >= 45) return 2.0;
  if (percentage >= 40) return 1.5;
  return 0.0;
}
