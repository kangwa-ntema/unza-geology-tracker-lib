// 02_Init

// ==============================================
// GEOLOGY TRACKER INITIALIZATION
// Creates hidden normalized tables
// ==============================================

const INIT_CONFIG = {
  student: {
    id: 1,
    name: 'Demo Student',
    program: 'B.Sc. Geology',
    entryYear: 2024,
    gradYear: 2029,
    number: '2020XXXXXX',
  },
  training: {
    requiredHours: 240,
  },
  tables: [
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
  ],
};

/**
 * COMPLETE SYSTEM INITIALIZATION
 */
function initializeCompleteSystem(includeDemoData) {
  const ui = SpreadsheetApp.getUi();

  if (includeDemoData === undefined) {
    const response = ui.alert(
      '🚀 Complete Setup',
      'Create normalized database?\n\nInclude demo data?',
      ui.ButtonSet.YES_NO
    );
    if (response !== ui.Button.YES && response !== ui.Button.NO) return;
    includeDemoData = response === ui.Button.YES;
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    showProgress('🗄️ Creating pure normalized database...');
    setupPureNormalizedDatabase(ss, includeDemoData);

    // Ensure students table has all profile fields
    showProgress('👤 Setting up profile system...');
    upgradeStudentsTable();

    const allTablesExist = verifyAllTablesCreated(ss);
    if (!allTablesExist) {
      ui.alert(
        '⚠️ Warning',
        'Some tables were not created properly. Check the execution log.',
        ui.ButtonSet.OK
      );
    }

    showProgress('📁 Creating Google Drive folders...');
    const folderId = createCompleteFolderStructure();

    showProgress('📝 Creating README sheet...');
    createReadmeSheet(ss, folderId);

    showProgress('📊 Setting up changelog...');
    setupChangelogSheet();

    ui.alert(
      '✅ COMPLETE!',
      'Pure normalized database created.\n\n' +
        '• 10 hidden database tables with demo data\n' +
        '• Enhanced profile system with 11 fields\n' +
        '• 1 visible README sheet\n' +
        '• Google Drive folders created\n' +
        '• Access everything through the menu',
      ui.ButtonSet.OK
    );
  } catch (error) {
    ui.alert('❌ Error', error.toString(), ui.ButtonSet.OK);
  }
}

/**
 * Setup pure normalized database
 */
function setupPureNormalizedDatabase(ss, includeDemoData) {
  const sheets = ss.getSheets();
  sheets.forEach((sheet) => {
    try {
      ss.deleteSheet(sheet);
    } catch (e) {
      console.log('Could not delete sheet: ' + e);
    }
  });

  createLocalNormalizedTables(ss);

  if (includeDemoData) {
    setupAllDemoData(ss);
  }

  INIT_CONFIG.tables.forEach((name) => {
    const sheet = ss.getSheetByName(name);
    if (sheet) sheet.hideSheet();
  });
}

/**
 * Create normalized tables with enhanced students table
 */
function createLocalNormalizedTables(ss) {
  // _students (ENHANCED with 11 columns)
  createEnhancedStudentsTable(ss);

  // _courses
  let sheet = ss.insertSheet('_courses');
  sheet
    .getRange(1, 1, 1, 8)
    .setValues([
      [
        'course_id',
        'course_code',
        'course_name',
        'credits',
        'year_level',
        'semester',
        'category',
        'active',
      ],
    ]);
  sheet.getRange('A1:H1').setFontWeight('bold');

  // _assessments
  sheet = ss.insertSheet('_assessments');
  sheet
    .getRange(1, 1, 1, 9)
    .setValues([
      [
        'assessment_id',
        'course_id',
        'assessment_type',
        'name',
        'weight_percent',
        'max_score',
        'due_date',
        'academic_year',
        'notes',
      ],
    ]);
  sheet.getRange('A1:I1').setFontWeight('bold');

  // _grades
  sheet = ss.insertSheet('_grades');
  sheet
    .getRange(1, 1, 1, 7)
    .setValues([
      ['grade_id', 'student_id', 'assessment_id', 'score', 'percentage', 'graded_date', 'status'],
    ]);
  sheet.getRange('A1:G1').setFontWeight('bold');

  // _timetable
  sheet = ss.insertSheet('_timetable');
  sheet
    .getRange(1, 1, 1, 8)
    .setValues([
      [
        'schedule_id',
        'course_id',
        'day_of_week',
        'start_time',
        'end_time',
        'activity_type',
        'location',
        'semester',
      ],
    ]);
  sheet.getRange('A1:H1').setFontWeight('bold');

  // _study_sessions
  sheet = ss.insertSheet('_study_sessions');
  sheet
    .getRange(1, 1, 1, 9)
    .setValues([
      [
        'session_id',
        'student_id',
        'course_id',
        'day',
        'start_time',
        'end_time',
        'duration',
        'activity',
        'completed',
      ],
    ]);
  sheet.getRange('A1:I1').setFontWeight('bold');

  // _certifications
  sheet = ss.insertSheet('_certifications');
  sheet
    .getRange(1, 1, 1, 8)
    .setValues([
      [
        'cert_id',
        'student_id',
        'name',
        'issuing_body',
        'date_earned',
        'expiry_date',
        'status',
        'notes',
      ],
    ]);
  sheet.getRange('A1:H1').setFontWeight('bold');

  // _industrial_training
  sheet = ss.insertSheet('_industrial_training');
  sheet
    .getRange(1, 1, 1, 9)
    .setValues([
      [
        'training_id',
        'student_id',
        'company',
        'position',
        'start_date',
        'end_date',
        'hours',
        'supervisor',
        'verified',
      ],
    ]);
  sheet.getRange('A1:I1').setFontWeight('bold');

  // _expenses
  sheet = ss.insertSheet('_expenses');
  sheet
    .getRange(1, 1, 1, 8)
    .setValues([
      [
        'expense_id',
        'student_id',
        'date',
        'category',
        'description',
        'amount',
        'payment_method',
        'receipt_url',
      ],
    ]);
  sheet.getRange('A1:H1').setFontWeight('bold');

  // _due_dates
  sheet = ss.insertSheet('_due_dates');
  sheet
    .getRange(1, 1, 1, 8)
    .setValues([
      [
        'due_id',
        'assessment_id',
        'due_date',
        'due_time',
        'reminder_sent',
        'status',
        'priority',
        'notes',
      ],
    ]);
  sheet.getRange('A1:H1').setFontWeight('bold');

  console.log('✅ All 10 normalized tables created');
}

/**
 * Create enhanced students table with profile fields
 */
function createEnhancedStudentsTable(ss) {
  let sheet = ss.getSheetByName('_students');
  if (!sheet) {
    sheet = ss.insertSheet('_students');
  }

  const headers = [
    'student_id',
    'name',
    'program',
    'entry_year',
    'grad_year',
    'student_number',
    'created_at',
    'email',
    'phone',
    'supervisor',
    'notes',
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange('A1:K1').setFontWeight('bold');
  sheet.setFrozenRows(1);

  return sheet;
}

/**
 * Upgrade existing students table to include profile fields
 */
function upgradeStudentsTable() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_students');

  if (!sheet) return;

  const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const requiredHeaders = [
    'student_id',
    'name',
    'program',
    'entry_year',
    'grad_year',
    'student_number',
    'created_at',
    'email',
    'phone',
    'supervisor',
    'notes',
  ];

  // Add missing headers
  if (currentHeaders.length < requiredHeaders.length) {
    for (let i = currentHeaders.length; i < requiredHeaders.length; i++) {
      sheet.getRange(1, i + 1).setValue(requiredHeaders[i]);
    }
    sheet.getRange(1, 1, 1, requiredHeaders.length).setFontWeight('bold');

    showToast('Students table upgraded with profile fields', 'Upgrade Complete');
  }
}

/**
 * Create README sheet
 */
function createReadmeSheet(ss, folderId) {
  let readmeSheet = ss.getSheetByName('_readme');
  if (!readmeSheet) {
    readmeSheet = ss.insertSheet('_readme');
  } else {
    readmeSheet.clear();
  }

  const folderUrl = folderId
    ? `https://drive.google.com/drive/folders/${folderId}`
    : 'Run setup to create folders';

  const content = [
    ['📊 UNZA GEOLOGY TRACKER - NORMALIZED DATABASE'],
    [''],
    ['This spreadsheet uses a normalized database structure with hidden tables.'],
    [''],
    ['🗄️ HIDDEN TABLES (access via menu only):'],
    ['• _students - Student information (enhanced with profile fields)'],
    ['• _courses - Master course list'],
    ['• _assessments - All assignments, tests, exams'],
    ['• _grades - Scores for each assessment'],
    ['• _timetable - Class schedule'],
    ['• _study_sessions - Personal study planning'],
    ['• _certifications - Professional certifications'],
    ['• _industrial_training - Internship records'],
    ['• _expenses - Financial tracking'],
    ['• _due_dates - Assignment deadlines'],
    [''],
    ['📁 DRIVE FOLDERS:'],
    [`• ${folderUrl}`],
    [''],
    ['⚙️ TO ACCESS DATA:'],
    ["• Use the '⛏️ UNZA Geology Tracker' menu"],
    ['• All interactions go through the menu system'],
    ['• Sheets are hidden to prevent accidental edits'],
    [''],
    ['👤 PROFILE SYSTEM:'],
    ["• Set your name, program, and contact info under 'My Profile'"],
    ['• Your details are used throughout the app'],
    [''],
    ['📅 Created: ' + new Date().toLocaleString()],
  ];

  content.forEach((row, index) => {
    readmeSheet.getRange(index + 1, 1).setValue(row[0]);
  });

  readmeSheet.getRange('A:A').setFontWeight('bold');
  readmeSheet.autoResizeColumn(1);
}

/**
 * Show progress message
 */
function showProgress(message) {
  SpreadsheetApp.getActiveSpreadsheet().toast(message, '⏳ Progress', 3);
}

function createCompleteFolderStructure() {
  const rootFolderName = 'UNZA Geology Tracker - Demo Student';
  let rootFolder;
  const folders = DriveApp.getFoldersByName(rootFolderName);

  if (folders.hasNext()) {
    rootFolder = folders.next();
  } else {
    rootFolder = DriveApp.createFolder(rootFolderName);
  }

  const folderStructure = [
    {
      path: '1. Academic',
      subfolders: [
        '1.1 Lecture Notes',
        '1.2 Tutorials',
        '1.3 Labs',
        '1.4 Assignments',
        '1.5 Tests & Exams',
        '1.6 Projects',
      ],
    },
    {
      path: '2. Continuous Assessment',
      subfolders: [
        '2.1 MAT1100 - Mathematics',
        '2.2 PHY1010 - Physics',
        '2.3 CHE1000 - Chemistry',
        '2.4 BIO1400 - Biology',
        '2.5 GMM2110 - Geology',
      ],
    },
    {
      path: '3. Scripts & Exams',
      subfolders: ['3.1 Past Papers', '3.2 My Scripts', '3.3 Model Answers'],
    },
    {
      path: '4. Study Resources',
      subfolders: [
        '4.1 Textbooks',
        '4.2 Lecture Slides',
        '4.3 Reference Materials',
        '4.4 Video Lectures',
      ],
    },
    {
      path: '5. Progress Tracking',
      subfolders: ['5.1 GPA Reports', '5.2 Progress Summaries', '5.3 Academic Advice'],
    },
    {
      path: '6. Administrative',
      subfolders: [
        '6.1 Fees & Payments',
        '6.2 Registration',
        '6.3 Correspondence',
        '6.4 Certifications',
      ],
    },
  ];

  folderStructure.forEach((mainCat) => {
    const mainFolder = getOrCreateSubfolder(rootFolder, mainCat.path);
    if (mainCat.subfolders) {
      mainCat.subfolders.forEach((subName) => {
        getOrCreateSubfolder(mainFolder, subName);
      });
    }
  });

  return rootFolder.getId();
}

function getOrCreateSubfolder(parentFolder, folderName) {
  const folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return parentFolder.createFolder(folderName);
  }
}

/**
 * Verify all tables were created
 */
function verifyAllTablesCreated(ss) {
  let missing = [];
  INIT_CONFIG.tables.forEach((tableName) => {
    if (!ss.getSheetByName(tableName)) {
      missing.push(tableName);
    }
  });

  if (missing.length > 0) {
    console.error('❌ Missing tables:', missing.join(', '));
    return false;
  }

  console.log('✅ All 10 tables created successfully');
  return true;
}
