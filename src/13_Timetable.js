// 13_Timetable.gs

// ==============================================
// TIMETABLE MODULE
// ==============================================

function showTodaysSchedule() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_timetable');

  if (!sheet || sheet.getLastRow() < 2) {
    showAlert('No timetable found. Run Initialize System first.', 'info');
    return;
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];

  const data = sheet.getDataRange().getValues().slice(1);
  const todayClasses = data.filter((row) => row[2] === today);

  if (todayClasses.length > 0) {
    let message = `📅 ${today}'s Schedule\n\n`;
    todayClasses.forEach((c) => {
      message += `• ${c[3]} - ${c[5]} (Course: ${getCourseCode(c[1])})\n`;
    });
    SpreadsheetApp.getUi().alert(message);
  } else {
    SpreadsheetApp.getUi().alert(`📅 No classes scheduled for ${today}`);
  }
}

function showWeeklySchedule() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_timetable');

  if (!sheet || sheet.getLastRow() < 2) {
    showAlert('No timetable found. Run Initialize System first.', 'info');
    return;
  }

  const data = sheet.getDataRange().getValues().slice(1);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  let message = '📚 WEEKLY SCHEDULE\n\n';

  days.forEach((day) => {
    const dayClasses = data.filter((row) => row[2] === day);
    if (dayClasses.length > 0) {
      message += `${day}:\n`;
      dayClasses.forEach((c) => {
        message += `  • ${c[3]} - ${c[5]} (Location: ${c[6]})\n`;
      });
      message += '\n';
    }
  });

  SpreadsheetApp.getUi().alert(message);
}

function viewFullTimetable() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_timetable');
  const coursesSheet = ss.getSheetByName('_courses');

  if (!sheet || sheet.getLastRow() < 2) {
    showAlert('No timetable found', 'info');
    return;
  }

  const timetable = sheet.getDataRange().getValues().slice(1);
  const courses = coursesSheet.getDataRange().getValues().slice(1);

  const courseMap = {};
  courses.forEach((c) => (courseMap[c[0]] = c[1]));

  let tableRows = '';
  timetable.forEach((t) => {
    tableRows += `
      <tr>
        <td>${courseMap[t[1]] || 'Unknown'}</td>
        <td>${t[2]}</td>
        <td>${t[3]}</td>
        <td>${t[4]}</td>
        <td>${t[5]}</td>
        <td>${t[6]}</td>
        <td>${t[7]}</td>
      </tr>
    `;
  });

  const content = getBaseHTML(`
    <div class="header">
      <h2>📅 Full Timetable</h2>
      <p>Your complete class schedule</p>
    </div>
    
    <table class="table">
      <thead>
        <tr>
          <th>Course</th>
          <th>Day</th>
          <th>Start</th>
          <th>End</th>
          <th>Type</th>
          <th>Location</th>
          <th>Semester</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    
    <div style="margin-top:20px">
      <button class="btn btn-secondary" onclick="google.script.host.close()">Close</button>
    </div>
  `);

  showModal('📅 Full Timetable', content, 900, 600);
}

function getCourseCode(courseId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_courses');
  if (!sheet) return 'Unknown';

  const courses = sheet.getDataRange().getValues().slice(1);
  for (let c of courses) {
    if (c[0] === courseId) return c[1];
  }
  return 'Unknown';
}
