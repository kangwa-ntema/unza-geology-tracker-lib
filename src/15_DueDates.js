// 15_DueDates.gs

// ==============================================
// DUE DATES MODULE
// ==============================================

function showUpcomingDeadlines() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_due_dates');

  if (!sheet || sheet.getLastRow() < 2) {
    showAlert('No due dates found. Run Initialize System first.', 'info');
    return;
  }

  const data = sheet.getDataRange().getValues().slice(1);
  const today = new Date();

  let overdue = [];
  let today_urgent = [];
  let thisWeek = [];
  let upcoming = [];

  data.forEach((row) => {
    const dueDate = new Date(row[2]);
    const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    const assessmentId = row[1];
    const assessment = getAssessmentDetails(assessmentId);

    const desc = assessment ? `${assessment.courseCode} - ${assessment.name}` : 'Unknown';

    if (daysUntil < 0) {
      overdue.push(`🔴 ${desc} (Due: ${row[2]})`);
    } else if (daysUntil === 0) {
      today_urgent.push(`🟡 ${desc} (DUE TODAY!)`);
    } else if (daysUntil <= 3) {
      today_urgent.push(`🟠 ${desc} (${daysUntil} days left)`);
    } else if (daysUntil <= 7) {
      thisWeek.push(`🟢 ${desc} (${daysUntil} days left)`);
    } else {
      upcoming.push(`⚪ ${desc} (${daysUntil} days left)`);
    }
  });

  let message = '⏰ UPCOMING DEADLINES\n\n';

  if (overdue.length > 0) {
    message += '🔴 OVERDUE:\n' + overdue.slice(0, 5).join('\n') + '\n\n';
  }
  if (today_urgent.length > 0) {
    message += '⚠️ URGENT:\n' + today_urgent.slice(0, 5).join('\n') + '\n\n';
  }
  if (thisWeek.length > 0) {
    message += '📅 THIS WEEK:\n' + thisWeek.slice(0, 5).join('\n') + '\n\n';
  }
  if (upcoming.length > 0) {
    message += '📌 UPCOMING:\n' + upcoming.slice(0, 5).join('\n');
  }

  SpreadsheetApp.getUi().alert(message);
}

function addDueDate() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const assessmentsSheet = ss.getSheetByName('_assessments');

  if (!assessmentsSheet || assessmentsSheet.getLastRow() < 2) {
    showAlert('No assessments found. Add assessments first.', 'warning');
    return;
  }

  const assessments = assessmentsSheet.getDataRange().getValues().slice(1);
  const coursesSheet = ss.getSheetByName('_courses');
  const courses = coursesSheet.getDataRange().getValues().slice(1);

  const courseMap = {};
  courses.forEach((c) => (courseMap[c[0]] = c[1]));

  let assessmentOptions = '';
  assessments.forEach((a) => {
    const courseCode = courseMap[a[1]] || 'Unknown';
    assessmentOptions += `<option value="${a[0]}">${courseCode} - ${a[3]} (${a[2]})</option>`;
  });

  const content = getBaseHTML(`
    <div class="header">
      <h2>📝 Add Due Date</h2>
      <p>Set deadline for an assessment</p>
    </div>
    
    <form id="dueDateForm">
      <div class="form-group">
        <label>Assessment *</label>
        <select class="form-control" id="assessmentId" required>
          <option value="">Select an assessment...</option>
          ${assessmentOptions}
        </select>
      </div>
      
      <div class="form-group">
        <label>Due Date *</label>
        <input type="date" class="form-control" id="dueDate" required>
      </div>
      
      <div class="form-group">
        <label>Due Time</label>
        <input type="time" class="form-control" id="dueTime" value="23:59">
      </div>
      
      <div class="form-group">
        <label>Priority</label>
        <select class="form-control" id="priority">
          <option value="High">High</option>
          <option value="Medium" selected>Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Notes</label>
        <textarea class="form-control" id="notes" rows="2"></textarea>
      </div>
      
      <div class="btn-group">
        <button type="button" class="btn btn-primary" onclick="saveDueDate()">Save Due Date</button>
        <button type="button" class="btn btn-secondary" onclick="google.script.host.close()">Cancel</button>
      </div>
    </form>
    
    <script>
      function saveDueDate() {
        const data = {
          assessmentId: parseInt(document.getElementById('assessmentId').value),
          dueDate: document.getElementById('dueDate').value,
          dueTime: document.getElementById('dueTime').value,
          priority: document.getElementById('priority').value,
          notes: document.getElementById('notes').value
        };
        
        if (!data.assessmentId || !data.dueDate) {
          alert('Please select an assessment and due date');
          return;
        }
        
        google.script.run
          .withSuccessHandler(() => {
            alert('✅ Due date added!');
            google.script.host.close();
          })
          .saveDueDate(data);
      }
    </script>
  `);

  showModal('📝 Add Due Date', content, 500, 600);
}

function saveDueDate(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_due_dates');

  if (!sheet) {
    showAlert('Database not initialized. Run Initialize System first.', 'error');
    return;
  }

  const lastRow = sheet.getLastRow();
  const newId = lastRow;

  sheet.appendRow([
    newId,
    data.assessmentId,
    data.dueDate,
    data.dueTime || '23:59',
    false,
    'Pending',
    data.priority || 'Medium',
    data.notes || '',
  ]);

  showToast('Due date added', 'Success');
}

function getAssessmentDetails(assessmentId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const assessmentsSheet = ss.getSheetByName('_assessments');
  const coursesSheet = ss.getSheetByName('_courses');

  if (!assessmentsSheet || !coursesSheet) return null;

  const assessments = assessmentsSheet.getDataRange().getValues().slice(1);
  const courses = coursesSheet.getDataRange().getValues().slice(1);

  const courseMap = {};
  courses.forEach((c) => (courseMap[c[0]] = c[1]));

  for (let a of assessments) {
    if (a[0] === assessmentId) {
      return {
        name: a[3],
        courseCode: courseMap[a[1]] || 'Unknown',
      };
    }
  }
  return null;
}
