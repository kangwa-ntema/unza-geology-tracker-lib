// 17_Dashboard.gs

// ==============================================
// ENHANCED DASHBOARD WITH PROFILE
// ==============================================

function showUNZADashboard() {
  const gpa = calculateUNGPA();
  const progress = calculateUNZAProgress();
  const profile = ProfileManager.getProfileSummary();

  const total = gpa.totalCredits;
  const percent = ((total / 160) * 100).toFixed(1);
  const bar = createProgressBar(percent, 30);

  let message = '🏛️ UNZA GEOLOGY DASHBOARD\n\n';
  message += `👤 ${profile.display}\n`;
  message += `${'═'.repeat(40)}\n\n`;
  message += `📊 ACADEMIC PROGRESS:\n`;
  message += `Progress: ${bar} ${percent}%\n`;
  message += `Credits: ${total}/160\n`;
  message += `GPA: ${gpa.overall}/5.0\n\n`;
  message += `📈 CATEGORY BREAKDOWN:\n`;

  for (let data of Object.values(progress)) {
    const catBar = createProgressBar(parseFloat(data.percent), 20);
    message += `${data.name.substring(0, 12)}: ${catBar} ${data.percent}%\n`;
    message += `   ${data.earned}/${data.required} credits\n`;
  }

  message += `\n⚡ QUICK STATS:\n`;
  message += `• 📚 ${getCourseCount()} courses\n`;
  message += `• 📝 ${getAssessmentCount()} assessments\n`;
  message += `• 📊 ${getGradeCount()} grades recorded\n`;
  message += `• ⏱️ Year ${profile.yearOfStudy} of 5 (${profile.progress}% complete)\n`;

  // Add motivational message based on GPA
  message += `\n${getMotivationalMessage(gpa.overall)}`;

  SpreadsheetApp.getUi().alert(message);
}

// Make sure these helper functions are GLOBAL (not inside any object)
function getCourseCount() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_courses');
  return sheet ? sheet.getLastRow() - 1 : 0;
}

function getAssessmentCount() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_assessments');
  return sheet ? sheet.getLastRow() - 1 : 0;
}

function getGradeCount() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_grades');
  return sheet ? sheet.getLastRow() - 1 : 0;
}

function getMotivationalMessage(gpa) {
  const gpaNum = parseFloat(gpa);
  if (gpaNum >= 4.0) return '🌟 Excellent work! Keep it up!';
  if (gpaNum >= 3.0) return '📚 Good job! Aim higher!';
  if (gpaNum >= 2.0) return "💪 You're on track! Keep pushing!";
  return '🎯 Time to focus! You can do this!';
}

function createProgressBar(percent, length) {
  const filled = Math.round((percent / 100) * length);
  return '█'.repeat(filled) + '░'.repeat(length - filled);
}
