// 14_StudySessions.gs

// ==============================================
// STUDY SESSIONS MODULE
// ==============================================

function viewStudySessions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_study_sessions');

  if (!sheet || sheet.getLastRow() < 2) {
    showAlert('No study sessions found. Add your first study session!', 'info');
    return;
  }

  const sessions = sheet.getDataRange().getValues().slice(1);
  const coursesSheet = ss.getSheetByName('_courses');
  const courses = coursesSheet.getDataRange().getValues().slice(1);

  const courseMap = {};
  courses.forEach((c) => {
    courseMap[c[0]] = { code: c[1], name: c[2] };
  });

  let tableRows = '';
  let totalStudyHours = 0;
  let completedCount = 0;

  sessions.forEach((s) => {
    const course = courseMap[s[2]] || { code: 'Unknown', name: '' };
    totalStudyHours += s[6] || 0;
    if (s[8] === 'Yes') completedCount++;

    const completed =
      s[8] === 'Yes'
        ? '<span class="badge badge-success">✓ Completed</span>'
        : '<span class="badge badge-warning">Pending</span>';

    tableRows += `
      <tr>
        <td>${course.code}</td>
        <td>${s[3]}</td>
        <td>${s[4]}</td>
        <td>${s[5]}</td>
        <td>${s[6]} hrs</td>
        <td>${s[7] || '—'}</td>
        <td>${completed}</td>
        <td>
          <button onclick="markCompleted(${s[0]})" style="background:none; border:none; color:#1a73e8; cursor:pointer;" title="Mark as completed">✓</button>
          <button onclick="deleteSession(${s[0]})" style="background:none; border:none; color:#d93025; cursor:pointer;" title="Delete">🗑️</button>
        </td>
      </tr>
    `;
  });

  const content = getBaseHTML(`
    <div class="header">
      <h2>📚 Study Sessions</h2>
      <p>Total Study Hours: <strong>${totalStudyHours}</strong> | Completed: <strong>${completedCount}/${sessions.length}</strong></p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <button class="btn btn-primary" onclick="addSession()">➕ Add Study Session</button>
      <button class="btn btn-secondary" onclick="showStudyStats()">📊 View Stats</button>
    </div>
    
    <table class="table">
      <thead>
        <tr>
          <th>Course</th>
          <th>Day</th>
          <th>Start</th>
          <th>End</th>
          <th>Duration</th>
          <th>Activity</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    
    <script>
      function addSession() {
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .addStudySession();
      }
      
      function markCompleted(id) {
        if (confirm('Mark this study session as completed?')) {
          google.script.run
            .withSuccessHandler(() => {
              alert('Session marked as completed!');
              google.script.host.close();
            })
            .markStudySessionCompleted(id);
        }
      }
      
      function deleteSession(id) {
        if (confirm('Delete this study session?')) {
          google.script.run
            .withSuccessHandler(() => {
              alert('Study session deleted');
              google.script.host.close();
            })
            .deleteStudySession(id);
        }
      }
      
      function showStudyStats() {
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .showStudyStats();
      }
    </script>
  `);

  showModal('📚 Study Sessions', content, 1000, 600);
}

function addStudySession() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const coursesSheet = ss.getSheetByName('_courses');

  if (!coursesSheet || coursesSheet.getLastRow() < 2) {
    showAlert('No courses found. Add courses first.', 'info');
    return;
  }

  const courses = coursesSheet.getDataRange().getValues().slice(1);

  let courseOptions = '';
  courses.forEach((c) => {
    courseOptions += `<option value="${c[0]}">${c[1]} - ${c[2]}</option>`;
  });

  const content = getBaseHTML(`
    <div class="header">
      <h2>➕ Add Study Session</h2>
      <p>Schedule your personal study time</p>
    </div>
    
    <form id="studyForm">
      <div class="form-group">
        <label>Course *</label>
        <select class="form-control" id="courseId" required>
          <option value="">Select a course...</option>
          ${courseOptions}
        </select>
      </div>
      
      <div class="form-group">
        <label>Day *</label>
        <select class="form-control" id="day" required>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Start Time *</label>
        <input type="time" class="form-control" id="startTime" required>
      </div>
      
      <div class="form-group">
        <label>Duration (hours) *</label>
        <input type="number" class="form-control" id="duration" min="0.5" max="8" step="0.5" value="2" required>
      </div>
      
      <div class="form-group">
        <label>Activity</label>
        <input type="text" class="form-control" id="activity" placeholder="e.g., Review notes, Practice problems">
      </div>
      
      <div class="btn-group">
        <button type="button" class="btn btn-primary" onclick="saveSession()">Add Session</button>
        <button type="button" class="btn btn-secondary" onclick="google.script.host.close()">Cancel</button>
      </div>
    </form>
    
    <script>
      function saveSession() {
        const data = {
          courseId: parseInt(document.getElementById('courseId').value),
          day: document.getElementById('day').value,
          startTime: document.getElementById('startTime').value,
          duration: parseFloat(document.getElementById('duration').value),
          activity: document.getElementById('activity').value
        };
        
        if (!data.courseId || !data.day || !data.startTime) {
          alert('Please fill all required fields');
          return;
        }
        
        google.script.run
          .withSuccessHandler(() => {
            alert('✅ Study session added!');
            google.script.host.close();
          })
          .saveStudySession(data);
      }
    </script>
  `);

  showModal('➕ Add Study Session', content, 500, 600);
}

function saveStudySession(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_study_sessions');

  if (!sheet) {
    showAlert('Database not initialized. Run Initialize System first.', 'error');
    return;
  }

  const lastRow = sheet.getLastRow();
  const newId = lastRow;

  const [hours, minutes] = data.startTime.split(':');
  const startMinutes = parseInt(hours) * 60 + parseInt(minutes);
  const endMinutes = startMinutes + data.duration * 60;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

  sheet.appendRow([
    newId,
    1,
    data.courseId,
    data.day,
    data.startTime,
    endTime,
    data.duration,
    data.activity || 'Study session',
    'No',
  ]);

  showToast('Study session added', 'Success');
}

function markStudySessionCompleted(sessionId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_study_sessions');

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === sessionId) {
      sheet.getRange(i + 1, 9).setValue('Yes');
      break;
    }
  }

  showToast('Study session marked as completed', 'Success');
}

function deleteStudySession(sessionId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_study_sessions');

  for (let i = sheet.getLastRow(); i >= 2; i--) {
    if (sheet.getRange(i, 1).getValue() === sessionId) {
      sheet.deleteRow(i);
      break;
    }
  }

  showToast('Study session deleted', 'Success');
}

function showStudyStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_study_sessions');
  const coursesSheet = ss.getSheetByName('_courses');

  if (!sheet || sheet.getLastRow() < 2) {
    showAlert('No study sessions to analyze', 'info');
    return;
  }

  const sessions = sheet.getDataRange().getValues().slice(1);
  const courses = coursesSheet.getDataRange().getValues().slice(1);

  const courseMap = {};
  courses.forEach((c) => (courseMap[c[0]] = c[1]));

  const byCourse = {};
  const byDay = {};
  let totalHours = 0;
  let completedHours = 0;

  sessions.forEach((s) => {
    const courseId = s[2];
    const courseCode = courseMap[courseId] || 'Unknown';
    const hours = s[6] || 0;
    const completed = s[8] === 'Yes';

    totalHours += hours;
    if (completed) completedHours += hours;

    if (!byCourse[courseCode]) {
      byCourse[courseCode] = { hours: 0, completed: 0 };
    }
    byCourse[courseCode].hours += hours;
    if (completed) byCourse[courseCode].completed += hours;

    const day = s[3];
    byDay[day] = (byDay[day] || 0) + hours;
  });

  let courseHtml = '';
  Object.keys(byCourse)
    .sort()
    .forEach((code) => {
      const data = byCourse[code];
      const percent = data.hours > 0 ? Math.round((data.completed / data.hours) * 100) : 0;
      courseHtml += `<div>${code}: ${data.hours} hrs (${percent}% completed)</div>`;
    });

  let dayHtml = '';
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  days.forEach((day) => {
    if (byDay[day]) {
      dayHtml += `<div>${day}: ${byDay[day]} hrs</div>`;
    }
  });

  const content = getBaseHTML(`
    <div class="header">
      <h2>📊 Study Statistics</h2>
      <p>Total Study Time: <strong>${totalHours} hours</strong></p>
      <p>Completed: <strong>${completedHours} hours</strong> (${Math.round((completedHours / totalHours) * 100)}%)</p>
    </div>
    
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:20px">
      <div style="background:#f8f9fa; padding:20px; border-radius:8px">
        <h3 style="margin:0 0 15px 0">📚 By Course</h3>
        ${courseHtml || '<p>No course data</p>'}
      </div>
      
      <div style="background:#f8f9fa; padding:20px; border-radius:8px">
        <h3 style="margin:0 0 15px 0">📅 By Day</h3>
        ${dayHtml || '<p>No day data</p>'}
      </div>
    </div>
    
    <div style="margin-top:20px">
      <button class="btn btn-secondary" onclick="google.script.host.close()">Close</button>
    </div>
  `);

  showModal('📊 Study Statistics', content, 700, 500);
}

function getWeeklyStudySummary() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_study_sessions');

  if (!sheet || sheet.getLastRow() < 2) return 'No study sessions planned';

  const sessions = sheet.getDataRange().getValues().slice(1);
  const coursesSheet = ss.getSheetByName('_courses');
  const courses = coursesSheet.getDataRange().getValues().slice(1);

  const courseMap = {};
  courses.forEach((c) => (courseMap[c[0]] = c[1]));

  const byDay = {};
  sessions.forEach((s) => {
    if (s[8] !== 'Yes') {
      const day = s[3];
      const courseCode = courseMap[s[2]] || 'Unknown';
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(`${courseCode} (${s[4]})`);
    }
  });

  let summary = '';
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  days.forEach((day) => {
    if (byDay[day]) {
      summary += `\n${day}: ${byDay[day].join(', ')}`;
    }
  });

  return summary || 'No upcoming study sessions';
}
