// 21_NormalizedSheets.gs

// ==============================================
// NORMALIZED DATABASE UTILITIES
// ==============================================

function showNormalizedTables() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hiddenSheets = [
    '_students',
    '_courses',
    '_assessments',
    '_grades',
    '_timetable',
    '_study_sessions',
    '_certifications',
    '_industrial_training',
    '_expenses',
    '_due_dates',
  ];

  let message = '🗄️ Normalized Database Tables:\n\n';

  hiddenSheets.forEach((name) => {
    const sheet = ss.getSheetByName(name);
    if (sheet) {
      const rowCount = sheet.getLastRow() - 1;
      message += `• ${name}: ${rowCount} records\n`;
    } else {
      message += `• ${name}: NOT FOUND\n`;
    }
  });

  SpreadsheetApp.getUi().alert(message);
}

function showHiddenTables() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hiddenSheets = [
    '_students',
    '_courses',
    '_assessments',
    '_grades',
    '_timetable',
    '_study_sessions',
    '_certifications',
    '_industrial_training',
    '_expenses',
    '_due_dates',
  ];

  hiddenSheets.forEach((name) => {
    const sheet = ss.getSheetByName(name);
    if (sheet && sheet.isSheetHidden()) {
      sheet.showSheet();
    }
  });

  SpreadsheetApp.getUi().alert('✅ All database tables are now visible');
}

function hideDatabaseTables() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hiddenSheets = [
    '_students',
    '_courses',
    '_assessments',
    '_grades',
    '_timetable',
    '_study_sessions',
    '_certifications',
    '_industrial_training',
    '_expenses',
    '_due_dates',
  ];

  hiddenSheets.forEach((name) => {
    const sheet = ss.getSheetByName(name);
    if (sheet && !sheet.isSheetHidden()) {
      sheet.hideSheet();
    }
  });

  SpreadsheetApp.getUi().alert('✅ Database tables hidden');
}
