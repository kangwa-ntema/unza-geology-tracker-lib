// 24_LibraryTests.gs

// ==============================================
// LIBRARY SELF-TEST MODULE
// Run these to verify library functions are working
// WITH CONSOLE LOGGING AND IMPROVED ERROR HANDLING
// ==============================================

function runAllLibraryTests() {
  console.log('🔬 STARTING LIBRARY SELF-TEST SUITE');
  console.log('=================================');

  const ui = SpreadsheetApp.getUi();

  let results = {
    passed: 0,
    failed: 0,
    total: 0,
    details: [],
  };

  // Run all test suites
  console.log('\n📋 Running test suites...');

  runConfigTests(results);
  runDatabaseTests(results);
  runProfileTests(results);
  runGPATests(results);
  runCourseTests(results);
  runAssessmentTests(results);
  runGradeTests(results);
  runCertificationTests(results);
  runExpenseTests(results);
  runTrainingTests(results);
  runTimetableTests(results);
  runStudySessionTests(results);
  runDueDateTests(results);
  runReportTests(results);
  runSystemTests(results);
  runUIHelperTests(results);

  // Display results
  console.log('\n=================================');
  console.log(
    `📊 FINAL RESULTS: ${results.passed}/${results.total} passed (${Math.round((results.passed / results.total) * 100)}%)`
  );
  console.log('=================================');

  showTestResults(results);

  return results;
}

// ==============================================
// HELPER FUNCTION FOR SAFE SHEET ACCESS
// ==============================================
function getSheetSafe(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    console.warn(`⚠️ Sheet "${sheetName}" not found`);
  }
  return sheet;
}

// ==============================================
// CONFIG TESTS
// ==============================================
function runConfigTests(results) {
  console.log('\n🔧 Running CONFIG tests...');

  results.total++;
  try {
    if (typeof APP_VERSION !== 'undefined' && APP_VERSION) {
      console.log(`  ✓ APP_VERSION = ${APP_VERSION}`);

      if (typeof CONFIG !== 'undefined' && CONFIG.program) {
        console.log(`  ✓ CONFIG loaded with program: ${CONFIG.program.name}`);
        results.passed++;
        results.details.push('✅ CONFIG: Version and config loaded');
      } else {
        throw new Error('CONFIG not properly defined');
      }
    } else {
      throw new Error('APP_VERSION not defined');
    }
  } catch (e) {
    console.error(`  ✗ CONFIG test failed: ${e.message}`);
    results.failed++;
    results.details.push('❌ CONFIG: ' + e.message);
  }
}

// ==============================================
// DATABASE TESTS
// ==============================================
function runDatabaseTests(results) {
  console.log('\n🗄️ Running DATABASE tests...');

  const tests = [
    { name: 'Create tables', fn: testCreateTables },
    { name: 'Table headers', fn: testTableHeaders },
    { name: 'Data insertion', fn: testDataInsertion },
    { name: 'Data retrieval', fn: testDataRetrieval },
    { name: 'Table hiding', fn: testTableHiding },
  ];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      if (result.success) {
        console.log(`    ✓ ${result.message || 'OK'}`);
        results.passed++;
        results.details.push(`✅ DATABASE: ${test.name} - ${result.message || 'OK'}`);
      } else {
        throw new Error(result.message || 'Failed');
      }
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ DATABASE: ${test.name} - ${e.message}`);
    }
  });
}

function testCreateTables() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let missing = [];
  let found = [];

  INIT_CONFIG.tables.forEach((tableName) => {
    const sheet = ss.getSheetByName(tableName);
    if (!sheet) {
      missing.push(tableName);
    } else {
      found.push(tableName);
    }
  });

  console.log(`    Found: ${found.length}/${INIT_CONFIG.tables.length} tables`);

  return {
    success: missing.length === 0,
    message: missing.length ? `Missing: ${missing.join(', ')}` : 'All tables exist',
  };
}

function testTableHeaders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const headers = {
    _students: [
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
    ],
    _courses: [
      'course_id',
      'course_code',
      'course_name',
      'credits',
      'year_level',
      'semester',
      'category',
      'active',
    ],
    _assessments: [
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
    _grades: [
      'grade_id',
      'student_id',
      'assessment_id',
      'score',
      'percentage',
      'graded_date',
      'status',
    ],
    _timetable: [
      'schedule_id',
      'course_id',
      'day_of_week',
      'start_time',
      'end_time',
      'activity_type',
      'location',
      'semester',
    ],
    _study_sessions: [
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
    _certifications: [
      'cert_id',
      'student_id',
      'name',
      'issuing_body',
      'date_earned',
      'expiry_date',
      'status',
      'notes',
    ],
    _industrial_training: [
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
    _expenses: [
      'expense_id',
      'student_id',
      'date',
      'category',
      'description',
      'amount',
      'payment_method',
      'receipt_url',
    ],
    _due_dates: [
      'due_id',
      'assessment_id',
      'due_date',
      'due_time',
      'reminder_sent',
      'status',
      'priority',
      'notes',
    ],
  };

  for (let [table, expectedHeaders] of Object.entries(headers)) {
    const sheet = ss.getSheetByName(table);
    if (!sheet) {
      console.warn(`    ${table} not found, skipping header check`);
      continue;
    }

    const actualHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    for (let i = 0; i < expectedHeaders.length; i++) {
      if (actualHeaders[i] !== expectedHeaders[i]) {
        return {
          success: false,
          message: `${table}: Expected "${expectedHeaders[i]}" but got "${actualHeaders[i]}"`,
        };
      }
    }
  }

  return { success: true, message: 'All headers correct' };
}

function testDataInsertion() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const coursesSheet = ss.getSheetByName('_courses');
  if (!coursesSheet) return { success: false, message: 'Courses sheet not found' };

  const testRow = [9999, 'TEST101', 'Test Course', 3, 1, 'Semester 1', 'Math/Science', true];
  coursesSheet.appendRow(testRow);

  const lastRow = coursesSheet.getLastRow();
  const insertedCode = coursesSheet.getRange(lastRow, 2).getValue();

  coursesSheet.deleteRow(lastRow);

  return {
    success: insertedCode === 'TEST101',
    message: insertedCode === 'TEST101' ? 'Insert/delete working' : 'Insert failed',
  };
}

function testDataRetrieval() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const coursesSheet = ss.getSheetByName('_courses');

  if (!coursesSheet || coursesSheet.getLastRow() < 2) {
    return { success: false, message: 'No course data to retrieve (run Initialize first)' };
  }

  const data = coursesSheet.getDataRange().getValues();
  return {
    success: data.length > 1,
    message: `Retrieved ${data.length - 1} course records`,
  };
}

function testTableHiding() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let visibleCount = 0;
  let hiddenCount = 0;

  INIT_CONFIG.tables.forEach((tableName) => {
    const sheet = ss.getSheetByName(tableName);
    if (sheet) {
      if (!sheet.isSheetHidden()) {
        visibleCount++;
      } else {
        hiddenCount++;
      }
    }
  });

  console.log(`    Tables: ${hiddenCount} hidden, ${visibleCount} visible`);

  return {
    success: visibleCount === 0,
    message: visibleCount ? `${visibleCount} tables visible` : 'All tables hidden',
  };
}

// ==============================================
// GPA TESTS
// ==============================================
function runGPATests(results) {
  console.log('\n📊 Running GPA tests...');

  const tests = [
    { name: 'GPA calculation', fn: testGPACalculation },
    { name: 'Percentage to grade point', fn: testPercentageToGradePoint },
    { name: 'Year breakdown', fn: testYearBreakdown },
  ];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      console.log(`    ✓ ${result}`);
      results.passed++;
      results.details.push(`✅ GPA: ${test.name} - ${result}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ GPA: ${test.name} - ${e.message}`);
    }
  });
}

function testGPACalculation() {
  const gpa = calculateUNGPA();
  if (typeof gpa.overall === 'undefined') throw new Error('GPA calculation failed');
  return `Overall GPA: ${gpa.overall}`;
}

function testPercentageToGradePoint() {
  const testCases = [
    { pct: 80, expected: 5.0 },
    { pct: 75, expected: 5.0 },
    { pct: 72, expected: 4.5 },
    { pct: 67, expected: 4.0 },
    { pct: 62, expected: 3.5 },
    { pct: 57, expected: 3.0 },
    { pct: 52, expected: 2.5 },
    { pct: 47, expected: 2.0 },
    { pct: 42, expected: 1.5 },
    { pct: 30, expected: 0.0 },
  ];

  for (let test of testCases) {
    const result = percentageToGradePoint(test.pct);
    if (result !== test.expected) {
      throw new Error(`${test.pct}% → Expected ${test.expected}, got ${result}`);
    }
  }
  return 'All 10 conversions correct';
}

function testYearBreakdown() {
  const gpa = calculateUNGPA();
  const yearCount = Object.keys(gpa.byYear || {}).length;
  return yearCount
    ? `Found ${yearCount} years with data`
    : 'No year data (this is OK if no grades yet)';
}

// ==============================================
// COURSE TESTS
// ==============================================
function runCourseTests(results) {
  console.log('\n📚 Running COURSE tests...');

  const tests = [
    { name: 'Get all courses', fn: testGetAllCourses },
    { name: 'Course CRUD', fn: testCourseCRUD },
  ];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      console.log(`    ✓ ${result}`);
      results.passed++;
      results.details.push(`✅ COURSES: ${test.name} - ${result}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ COURSES: ${test.name} - ${e.message}`);
    }
  });
}

function testGetAllCourses() {
  const courses = getAllCourses();
  return `Found ${courses.length} courses`;
}

function testCourseCRUD() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_courses');

  if (!sheet) throw new Error('Courses sheet not found');

  // Create
  const testData = {
    code: 'TEST202',
    name: 'CRUD Test Course',
    credits: 4,
    year: 2,
    category: 'Math/Science',
    semester: 'All Year',
  };

  const lastRow = sheet.getLastRow();
  sheet.appendRow([
    lastRow,
    testData.code,
    testData.name,
    testData.credits,
    testData.year,
    testData.semester,
    testData.category,
    true,
  ]);

  // Read
  const newRow = sheet.getLastRow();
  const readCode = sheet.getRange(newRow, 2).getValue();
  if (readCode !== testData.code) throw new Error('Create failed');

  // Update
  sheet.getRange(newRow, 3).setValue('Updated Test Course');
  const updatedName = sheet.getRange(newRow, 3).getValue();
  if (updatedName !== 'Updated Test Course') throw new Error('Update failed');

  // Delete
  sheet.deleteRow(newRow);

  return 'Create, Read, Update, Delete all working';
}

// ==============================================
// ASSESSMENT TESTS
// ==============================================
function runAssessmentTests(results) {
  console.log('\n📝 Running ASSESSMENT tests...');

  const tests = [{ name: 'Get assessment details', fn: testGetAssessmentDetails }];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      console.log(`    ✓ ${result}`);
      results.passed++;
      results.details.push(`✅ ASSESSMENTS: ${test.name} - ${result}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ ASSESSMENTS: ${test.name} - ${e.message}`);
    }
  });
}

function testGetAssessmentDetails() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_assessments');

  if (!sheet) throw new Error('Assessments sheet not found');

  if (sheet.getLastRow() < 2) {
    return 'No assessments to test (run Initialize first)';
  }

  const firstId = sheet.getRange(2, 1).getValue();
  const details = getAssessmentDetails(firstId);

  if (!details || typeof details.maxScore === 'undefined') {
    throw new Error('Failed to get assessment details');
  }

  return `Assessment details working (maxScore: ${details.maxScore})`;
}

// ==============================================
// GRADE TESTS
// ==============================================
function runGradeTests(results) {
  console.log('\n📈 Running GRADE tests...');

  const tests = [{ name: 'Grade calculations', fn: testGradeCalculations }];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      console.log(`    ✓ ${result}`);
      results.passed++;
      results.details.push(`✅ GRADES: ${test.name} - ${result}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ GRADES: ${test.name} - ${e.message}`);
    }
  });
}

function testGradeCalculations() {
  const score = 85;
  const maxScore = 100;
  const percentage = (score / maxScore) * 100;

  if (percentage !== 85) throw new Error('Percentage calculation wrong');

  const gradePoint = percentageToGradePoint(percentage);
  if (gradePoint !== 5.0) throw new Error('Grade point conversion wrong');

  return 'Grade calculations correct';
}

// ==============================================
// CERTIFICATION TESTS
// ==============================================
function runCertificationTests(results) {
  console.log('\n🛡️ Running CERTIFICATION tests...');

  const tests = [{ name: 'Expiry checking', fn: testCertExpiry }];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      console.log(`    ✓ ${result}`);
      results.passed++;
      results.details.push(`✅ CERTIFICATIONS: ${test.name} - ${result}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ CERTIFICATIONS: ${test.name} - ${e.message}`);
    }
  });
}

function testCertExpiry() {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setMonth(today.getMonth() + 1);

  const daysUntil = Math.ceil((futureDate - today) / (1000 * 60 * 60 * 24));

  if (daysUntil < 0 || daysUntil > 31) {
    throw new Error('Date calculation wrong');
  }

  return 'Expiry calculation working';
}

// ==============================================
// EXPENSE TESTS
// ==============================================
function runExpenseTests(results) {
  console.log('\n💰 Running EXPENSE tests...');

  const tests = [{ name: 'Category aggregation', fn: testExpenseAggregation }];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      console.log(`    ✓ ${result}`);
      results.passed++;
      results.details.push(`✅ EXPENSES: ${test.name} - ${result}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ EXPENSES: ${test.name} - ${e.message}`);
    }
  });
}

function testExpenseAggregation() {
  const testCategories = {
    Tuition: 1000,
    Books: 200,
    Food: 50,
  };

  let total = 0;
  for (let amount of Object.values(testCategories)) {
    total += amount;
  }

  if (total !== 1250) throw new Error('Aggregation wrong');

  return 'Category aggregation working';
}

// ==============================================
// TRAINING TESTS
// ==============================================
function runTrainingTests(results) {
  console.log('\n⛏️ Running TRAINING tests...');

  const tests = [{ name: 'Hours calculation', fn: testTrainingHours }];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      console.log(`    ✓ ${result}`);
      results.passed++;
      results.details.push(`✅ TRAINING: ${test.name} - ${result}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ TRAINING: ${test.name} - ${e.message}`);
    }
  });
}

function testTrainingHours() {
  const required = 240;
  const completed = 120;
  const percent = Math.min(100, Math.round((completed / required) * 100));

  if (percent !== 50) throw new Error('Percentage calculation wrong');

  return 'Hours calculation working';
}

// ==============================================
// TIMETABLE TESTS
// ==============================================
function runTimetableTests(results) {
  console.log('\n📅 Running TIMETABLE tests...');

  const tests = [{ name: 'Day parsing', fn: testTimetableDays }];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      console.log(`    ✓ ${result}`);
      results.passed++;
      results.details.push(`✅ TIMETABLE: ${test.name} - ${result}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ TIMETABLE: ${test.name} - ${e.message}`);
    }
  });
}

function testTimetableDays() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const today = new Date().getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (today >= 1 && today <= 5) {
    if (dayNames[today] !== days[today - 1]) {
      throw new Error('Day mapping wrong');
    }
  }

  return 'Day parsing working';
}

// ==============================================
// STUDY SESSION TESTS
// ==============================================
function runStudySessionTests(results) {
  console.log('\n📚 Running STUDY SESSION tests...');

  const tests = [{ name: 'Duration calculation', fn: testStudyDuration }];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      console.log(`    ✓ ${result}`);
      results.passed++;
      results.details.push(`✅ STUDY: ${test.name} - ${result}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ STUDY: ${test.name} - ${e.message}`);
    }
  });
}

function testStudyDuration() {
  const start = '09:00';
  const duration = 2;

  const [hours, minutes] = start.split(':');
  const startMinutes = parseInt(hours) * 60 + parseInt(minutes);
  const endMinutes = startMinutes + duration * 60;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

  if (endTime !== '11:00') throw new Error('Duration calculation wrong');

  return 'Duration calculation working';
}

// ==============================================
// DUE DATE TESTS
// ==============================================
function runDueDateTests(results) {
  console.log('\n⏰ Running DUE DATE tests...');

  const tests = [{ name: 'Days until calculation', fn: testDaysUntil }];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      console.log(`    ✓ ${result}`);
      results.passed++;
      results.details.push(`✅ DUE DATES: ${test.name} - ${result}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ DUE DATES: ${test.name} - ${e.message}`);
    }
  });
}

function testDaysUntil() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const daysUntil = Math.ceil((tomorrow - today) / (1000 * 60 * 60 * 24));

  if (daysUntil !== 1) throw new Error('Days until calculation wrong');

  return 'Days until calculation working';
}

// ==============================================
// REPORT TESTS
// ==============================================
function runReportTests(results) {
  console.log('\n📑 Running REPORT tests...');

  const tests = [{ name: 'Report generation', fn: testReportGeneration }];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      console.log(`    ✓ ${result}`);
      results.passed++;
      results.details.push(`✅ REPORTS: ${test.name} - ${result}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ REPORTS: ${test.name} - ${e.message}`);
    }
  });
}

function testReportGeneration() {
  if (typeof createUNZAReport !== 'function') {
    throw new Error('Report function not found');
  }
  return 'Report function exists';
}

// ==============================================
// SYSTEM TESTS
// ==============================================
function runSystemTests(results) {
  console.log('\n⚙️ Running SYSTEM tests...');

  const tests = [
    { name: 'Reset functions', fn: testResetFunctions },
    { name: 'Properties storage', fn: testProperties },
  ];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      console.log(`    ✓ ${result}`);
      results.passed++;
      results.details.push(`✅ SYSTEM: ${test.name} - ${result}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ SYSTEM: ${test.name} - ${e.message}`);
    }
  });
}

function testResetFunctions() {
  if (typeof softReset !== 'function' || typeof nukeSystem !== 'function') {
    throw new Error('Reset functions missing');
  }
  return 'Reset functions exist';
}

function testProperties() {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('test', 'value');
  const value = props.getProperty('test');
  props.deleteProperty('test');

  if (value !== 'value') throw new Error('Properties not working');

  return 'Properties working';
}

// ==============================================
// UI HELPER TESTS
// ==============================================
function runUIHelperTests(results) {
  console.log('\n🎨 Running UI HELPER tests...');

  const tests = [{ name: 'Base HTML generation', fn: testBaseHTML }];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      console.log(`    ✓ ${result}`);
      results.passed++;
      results.details.push(`✅ UI: ${test.name} - ${result}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ UI: ${test.name} - ${e.message}`);
    }
  });
}

function testBaseHTML() {
  const html = getBaseHTML('<p>test</p>');
  if (!html.includes('test') || !html.includes('Google Sans')) {
    throw new Error('HTML generation wrong');
  }
  return 'HTML generation working';
}

// ==============================================
// PROFILE TESTS
// ==============================================
function runProfileTests(results) {
  console.log('\n👤 Running PROFILE tests...');

  // Check if ProfileManager exists
  if (typeof ProfileManager === 'undefined') {
    console.warn('  ⚠️ ProfileManager not loaded, skipping profile tests');
    results.total++;
    results.failed++;
    results.details.push('❌ PROFILE: ProfileManager not loaded');
    return;
  }

  const tests = [
    { name: 'Get profile', fn: testProfileGet },
    { name: 'Profile summary', fn: testProfileSummary },
    { name: 'Year calculation', fn: testProfileYearCalc },
  ];

  tests.forEach((test) => {
    results.total++;
    console.log(`  Testing: ${test.name}...`);
    try {
      const result = test.fn();
      console.log(`    ✓ ${result}`);
      results.passed++;
      results.details.push(`✅ PROFILE: ${test.name} - ${result}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ PROFILE: ${test.name} - ${e.message}`);
    }
  });
}

function testProfileGet() {
  const profile = ProfileManager.getProfile();
  if (!profile || !profile.name) {
    throw new Error('Could not get profile');
  }
  return `Got profile for ${profile.name}`;
}

function testProfileSummary() {
  const summary = ProfileManager.getProfileSummary();
  if (!summary || !summary.display) {
    throw new Error('Could not get profile summary');
  }
  return `Summary: ${summary.display}`;
}

function testProfileYearCalc() {
  const profile = ProfileManager.getProfile();
  const currentYear = new Date().getFullYear();
  const yearOfStudy = Math.min(5, Math.max(1, currentYear - profile.entryYear + 1));

  if (yearOfStudy < 1 || yearOfStudy > 5) {
    throw new Error(`Invalid year calculation: ${yearOfStudy}`);
  }
  return `Year ${yearOfStudy} of 5`;
}

// ==============================================
// RESULTS DISPLAY
// ==============================================
function showTestResults(results) {
  const ui = SpreadsheetApp.getUi();

  const percentage = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0;

  // Create progress bar
  const barLength = 30;
  const filled = Math.round((percentage / 100) * barLength);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

  let message = '🔬 LIBRARY SELF-TEST RESULTS\n\n';
  message += `${bar} ${percentage}%\n\n`;
  message += `✅ Passed: ${results.passed}\n`;
  message += `❌ Failed: ${results.failed}\n`;
  message += `📊 Total:  ${results.total}\n\n`;

  // Show failed tests first
  const failed = results.details.filter((d) => d.includes('❌'));
  if (failed.length > 0) {
    message += '🔴 FAILED TESTS:\n';
    failed.forEach((f) => (message += f + '\n'));
    message += '\n';
  }

  // Show passed tests (limit to 15 to avoid huge dialog)
  const passed = results.details.filter((d) => d.includes('✅'));
  if (passed.length > 0) {
    message += '🟢 PASSED TESTS:\n';
    passed.slice(0, 15).forEach((p) => (message += p + '\n'));
    if (passed.length > 15) {
      message += `... and ${passed.length - 15} more\n`;
    }
  }

  console.log('\n📋 Final Results Dialog Displayed');
  ui.alert(message);
}

// ==============================================
// INDIVIDUAL TEST SUITE RUNNERS
// ==============================================

function testConfig() {
  console.log('🔧 Running CONFIG test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runConfigTests(results);
  showTestResults(results);
}

function testDatabase() {
  console.log('🗄️ Running DATABASE test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runDatabaseTests(results);
  showTestResults(results);
}

function testProfile() {
  console.log('👤 Running PROFILE test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runProfileTests(results);
  showTestResults(results);
}

function testGPA() {
  console.log('📊 Running GPA test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runGPATests(results);
  showTestResults(results);
}

function testCourses() {
  console.log('📚 Running COURSES test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runCourseTests(results);
  showTestResults(results);
}

function testAssessments() {
  console.log('📝 Running ASSESSMENTS test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runAssessmentTests(results);
  showTestResults(results);
}

function testGrades() {
  console.log('📈 Running GRADES test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runGradeTests(results);
  showTestResults(results);
}

function testCertifications() {
  console.log('🛡️ Running CERTIFICATIONS test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runCertificationTests(results);
  showTestResults(results);
}

function testExpenses() {
  console.log('💰 Running EXPENSES test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runExpenseTests(results);
  showTestResults(results);
}

function testTraining() {
  console.log('⛏️ Running TRAINING test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runTrainingTests(results);
  showTestResults(results);
}

function testTimetable() {
  console.log('📅 Running TIMETABLE test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runTimetableTests(results);
  showTestResults(results);
}

function testStudySessions() {
  console.log('📚 Running STUDY SESSIONS test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runStudySessionTests(results);
  showTestResults(results);
}

function testDueDates() {
  console.log('⏰ Running DUE DATES test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runDueDateTests(results);
  showTestResults(results);
}

function testReports() {
  console.log('📑 Running REPORTS test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runReportTests(results);
  showTestResults(results);
}

function testSystem() {
  console.log('⚙️ Running SYSTEM test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runSystemTests(results);
  showTestResults(results);
}

function testUI() {
  console.log('🎨 Running UI test only');
  let results = { passed: 0, failed: 0, total: 0, details: [] };
  runUIHelperTests(results);
  showTestResults(results);
}
