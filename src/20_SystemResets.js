// 20_SystemResets.gs

// ==============================================
// SYSTEM RESET & DESTRUCTIVE OPERATIONS
// ==============================================

function nukeSystem() {
  const ui = SpreadsheetApp.getUi();

  const response = ui.alert(
    '💣⚠️ DESTROY EVERYTHING? ⚠️💣',
    'This will:\n\n' +
      '• DELETE all sheets in this spreadsheet\n' +
      '• DELETE the entire folder structure in Google Drive\n' +
      '• DELETE all uploaded documents and files\n' +
      '• WIPE all settings and data\n\n' +
      '❗ THIS CANNOT BE UNDONE ❗\n\n' +
      'Type "NUKE" in the box below to confirm:',
    ui.ButtonSet.OK_CANCEL
  );

  if (response !== ui.Button.OK) return;

  const confirm = ui.prompt(
    '💣 FINAL CONFIRMATION',
    'Enter the word "NUKE" to permanently delete everything:',
    ui.ButtonSet.OK_CANCEL
  );

  if (confirm.getSelectedButton() !== ui.Button.OK || confirm.getResponseText() !== 'NUKE') {
    ui.alert('Nuke cancelled - incorrect confirmation code.');
    return;
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    showResetProgress('💣 Deleting Google Drive folders...');
    deleteDriveFolders();

    showResetProgress('💣 Deleting all sheets...');
    deleteAllSheets(ss);

    showResetProgress('💣 Clearing script properties...');
    PropertiesService.getScriptProperties().deleteAllProperties();

    ui.alert(
      '✅ SYSTEM COMPLETELY DESTROYED',
      'All data has been wiped.\n\n' +
        '• All sheets deleted\n' +
        '• All Drive folders deleted\n' +
        '• All settings cleared\n\n' +
        'Click "Initialize" to start fresh.',
      ui.ButtonSet.OK
    );
  } catch (error) {
    ui.alert('❌ Nuke Error', error.toString(), ui.ButtonSet.OK);
  }
}

function deleteDriveFolders() {
  const rootFolderName = 'UNZA Geology Tracker - Demo Student';
  const folders = DriveApp.getFoldersByName(rootFolderName);

  while (folders.hasNext()) {
    const folder = folders.next();

    const subFolders = folder.getFolders();
    while (subFolders.hasNext()) {
      const subFolder = subFolders.next();
      const files = subFolder.getFiles();
      while (files.hasNext()) {
        files.next().setTrashed(true);
      }
      subFolder.setTrashed(true);
    }

    const rootFiles = folder.getFiles();
    while (rootFiles.hasNext()) {
      rootFiles.next().setTrashed(true);
    }

    folder.setTrashed(true);
  }
}

function deleteAllSheets(ss) {
  const sheets = ss.getSheets();

  for (let i = 1; i < sheets.length; i++) {
    ss.deleteSheet(sheets[i]);
  }

  const firstSheet = sheets[0];
  firstSheet.clear();
  firstSheet.getRange(1, 1).setValue('NUKE COMPLETE - Ready for initialization');
  firstSheet.setName('Blank');

  PropertiesService.getScriptProperties().deleteAllProperties();
}

function softReset() {
  const ui = SpreadsheetApp.getUi();

  const response = ui.alert(
    '🧹 Soft Reset',
    'This will:\n\n' +
      '✓ CLEAR all grades and scores\n' +
      '✓ CLEAR all assessment data\n' +
      '✓ CLEAR all certifications, training, expenses\n' +
      '✗ KEEP all sheet structures\n' +
      '✗ KEEP all course names and headers\n' +
      '✗ KEEP folder structure in Drive\n\n' +
      'Continue?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    showResetProgress('🧹 Clearing normalized database...');
    clearNormalizedData(ss);

    ui.alert(
      '✅ Soft Reset Complete',
      'All data has been cleared.\n\n' +
        '• Database structures remain\n' +
        '• Headers and formatting kept\n' +
        '• Ready for fresh data entry',
      ui.ButtonSet.OK
    );
  } catch (error) {
    ui.alert('❌ Error during reset', error.toString(), ui.ButtonSet.OK);
  }
}

function clearNormalizedData(ss) {
  const normalizedSheets = [
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

  let totalRowsCleared = 0;

  normalizedSheets.forEach((sheetName) => {
    const sheet = ss.getSheetByName(sheetName);
    if (sheet && sheet.getLastRow() > 1) {
      const rowsToClear = sheet.getLastRow() - 1;
      sheet.getRange(2, 1, rowsToClear, sheet.getLastColumn()).clearContent();
      totalRowsCleared += rowsToClear;
      console.log(`Cleared ${rowsToClear} rows from ${sheetName}`);
    }
  });

  showToast(`Cleared ${totalRowsCleared} records from database`, 'Reset Complete');
}

function showResetProgress(message) {
  SpreadsheetApp.getUi().alert('⏳ Progress', message, SpreadsheetApp.getUi().ButtonSet.OK);
}
