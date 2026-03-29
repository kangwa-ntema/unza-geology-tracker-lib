// 03_DemoData.gs

// ==============================================
// DEMO DATA SETUP - ALL IN ONE PLACE
// ==============================================

function setupAllDemoData(ss) {
  console.log('Setting up complete demo data...');

  setupStudentsDemoData(ss);
  setupCoursesDemoData(ss);
  setupAssessmentsDemoData(ss);
  setupGradesDemoData(ss);
  setupTimetableDemoData(ss);
  setupStudySessionsDemoData(ss);
  setupCertificationsDemoData(ss);
  setupTrainingDemoData(ss);
  setupExpensesDemoData(ss);
  setupDueDatesDemoData(ss);

  console.log('✅ All demo data created');
}

function setupStudentsDemoData(ss) {
  const sheet = ss.getSheetByName('_students');
  if (!sheet) {
    console.error('_students sheet not found');
    return;
  }

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).clearContent();
  }

  sheet.appendRow([
    INIT_CONFIG.student.id,
    INIT_CONFIG.student.name,
    INIT_CONFIG.student.program,
    INIT_CONFIG.student.entryYear,
    INIT_CONFIG.student.gradYear,
    INIT_CONFIG.student.number,
    new Date(),
  ]);
}

function setupCoursesDemoData(ss) {
  const sheet = ss.getSheetByName('_courses');
  if (!sheet) {
    console.error('_courses sheet not found');
    return;
  }

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).clearContent();
  }

  const courses = [
    [1, 'MAT1100', 'Foundational Mathematics', 4, 1, 'All Year', 'Math/Science', true],
    [2, 'PHY1010', 'Introductory Physics', 4, 1, 'All Year', 'Math/Science', true],
    [3, 'CHE1000', 'Introductory Chemistry', 4, 1, 'All Year', 'Math/Science', true],
    [4, 'BIO1400', 'Cell Biology', 4, 1, 'All Year', 'General Ed', true],
    [5, 'MAT2100', 'Analytical Geometry', 4, 2, 'All Year', 'Math/Science', true],
    [6, 'GMM2110', 'Intro to Geology', 3, 2, 'All Year', 'Mining Core', true],
    [7, 'PHY2231', 'Thermodynamics', 3, 2, 'Semester 1', 'Math/Science', true],
    [8, 'CHE2415', 'Inorganic Chemistry', 3, 2, 'Semester 1', 'Math/Science', true],
    [9, 'PHY2712', 'Optics', 3, 2, 'Semester 2', 'Math/Science', true],
    [10, 'CHE2615', 'Physical Chemistry', 3, 2, 'Semester 2', 'Math/Science', true],
    [11, 'GGY3020', 'Mineralogy and Petrology', 4, 3, 'All Year', 'Mining Core', true],
    [12, 'GGY3030', 'Stratigraphy', 3, 3, 'All Year', 'Mining Core', true],
    [13, 'GGY3041', 'Structural Geology', 4, 3, 'All Year', 'Mining Core', true],
  ];

  courses.forEach((c) => sheet.appendRow(c));
}

function setupAssessmentsDemoData(ss) {
  const sheet = ss.getSheetByName('_assessments');
  if (!sheet) {
    console.error('_assessments sheet not found');
    return;
  }

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).clearContent();
  }

  const assessments = [
    [1, 1, 'Exam', 'Final Exam', 50, 100, '2024-05-20', '2024', ''],
    [2, 1, 'Assignment', 'Assignment 1', 10, 10, '2024-02-15', '2024', ''],
    [3, 1, 'Test', 'Test 1', 20, 25, '2024-03-10', '2024', ''],
    [4, 2, 'Exam', 'Final Exam', 50, 100, '2024-05-22', '2024', ''],
    [5, 2, 'Lab', 'Mechanics Lab', 15, 15, '2024-02-28', '2024', ''],
    [6, 2, 'Test', 'Test 1', 20, 25, '2024-03-15', '2024', ''],
    [7, 3, 'Exam', 'Final Exam', 50, 100, '2024-05-25', '2024', ''],
    [8, 3, 'Lab', 'Chemistry Lab 1', 15, 15, '2024-02-20', '2024', ''],
    [9, 4, 'Exam', 'Final Exam', 50, 100, '2024-05-28', '2024', ''],
    [10, 5, 'Exam', 'Final Exam', 50, 100, '2025-05-20', '2025', ''],
    [11, 5, 'Assignment', 'Calculus Problems', 15, 15, '2025-02-10', '2025', ''],
    [12, 6, 'Exam', 'Final Exam', 50, 100, '2025-05-22', '2025', ''],
    [13, 7, 'Exam', 'Final Exam', 50, 100, '2025-05-15', '2025', ''],
    [14, 8, 'Exam', 'Final Exam', 50, 100, '2025-05-18', '2025', ''],
    [15, 9, 'Exam', 'Final Exam', 50, 100, '2025-08-15', '2025', ''],
    [16, 10, 'Exam', 'Final Exam', 50, 100, '2025-08-18', '2025', ''],
    [17, 11, 'Exam', 'Final Exam', 50, 100, '2026-05-20', '2026', ''],
    [18, 12, 'Exam', 'Final Exam', 50, 100, '2026-05-22', '2026', ''],
    [19, 13, 'Exam', 'Final Exam', 50, 100, '2026-05-24', '2026', ''],
  ];

  assessments.forEach((a) => sheet.appendRow(a));
}

function setupGradesDemoData(ss) {
  const sheet = ss.getSheetByName('_grades');
  if (!sheet) {
    console.error('_grades sheet not found');
    return;
  }

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).clearContent();
  }

  const grades = [
    [1, 1, 2, 8, 80, '2024-02-15', 'Graded'],
    [2, 1, 3, 15, 60, '2024-03-10', 'Graded'],
    [3, 1, 5, 14, 93, '2024-02-28', 'Graded'],
    [4, 1, 6, 16, 64, '2024-03-15', 'Graded'],
    [5, 1, 8, 14, 93, '2024-02-20', 'Graded'],
  ];

  grades.forEach((g) => sheet.appendRow(g));
}

function setupTimetableDemoData(ss) {
  const sheet = ss.getSheetByName('_timetable');
  if (!sheet) {
    console.error('_timetable sheet not found');
    return;
  }

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).clearContent();
  }

  const coursesSheet = ss.getSheetByName('_courses');
  if (!coursesSheet) {
    console.error('_courses sheet not found for timetable reference');
    return;
  }

  const courses = coursesSheet.getDataRange().getValues().slice(1);
  const courseMap = {};
  courses.forEach((c) => (courseMap[c[1]] = c[0]));

  const timetableData = [
    [1, courseMap['MAT1100'] || 1, 'Monday', '10:00', '12:00', 'Lecture', 'CLT1', 'Semester 1'],
    [2, courseMap['PHY1010'] || 2, 'Monday', '14:00', '16:00', 'Lecture', 'PHY-LAB', 'Semester 1'],
    [
      3,
      courseMap['CHE1000'] || 3,
      'Tuesday',
      '09:00',
      '11:00',
      'Lecture',
      'CHEM-101',
      'Semester 1',
    ],
    [4, courseMap['MAT1100'] || 1, 'Tuesday', '14:00', '16:00', 'Tutorial', 'TUT-3', 'Semester 1'],
    [5, courseMap['GMM2110'] || 6, 'Wednesday', '10:00', '13:00', 'Lab', 'GEOLAB', 'Semester 1'],
    [6, courseMap['PHY1010'] || 2, 'Wednesday', '14:00', '17:00', 'Lab', 'PHY-LAB', 'Semester 1'],
    [7, courseMap['CHE1000'] || 3, 'Thursday', '09:00', '11:00', 'Tutorial', 'TUT-2', 'Semester 1'],
    [
      8,
      courseMap['BIO1400'] || 4,
      'Thursday',
      '14:00',
      '16:00',
      'Lecture',
      'BIO-201',
      'Semester 1',
    ],
    [9, courseMap['MAT1100'] || 1, 'Friday', '09:00', '11:00', 'Lecture', 'CLT2', 'Semester 1'],
    [10, courseMap['GMM2110'] || 6, 'Friday', '13:00', '15:00', 'Lecture', 'GLG-101', 'Semester 1'],
  ];

  timetableData.forEach((row) => sheet.appendRow(row));
}

function setupStudySessionsDemoData(ss) {
  const sheet = ss.getSheetByName('_study_sessions');
  if (!sheet) {
    console.error('_study_sessions sheet not found');
    return;
  }

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).clearContent();
  }

  const coursesSheet = ss.getSheetByName('_courses');
  if (!coursesSheet) {
    console.error('_courses sheet not found for study sessions reference');
    return;
  }

  const courses = coursesSheet.getDataRange().getValues().slice(1);
  const courseMap = {};
  courses.forEach((c) => (courseMap[c[1]] = c[0]));

  const studyData = [
    [
      1,
      1,
      courseMap['MAT1100'] || 1,
      'Monday',
      '09:00',
      '11:00',
      2,
      'Review calculus problems',
      'No',
    ],
    [
      2,
      1,
      courseMap['PHY1010'] || 2,
      'Wednesday',
      '15:00',
      '17:00',
      2,
      'Physics practice questions',
      'No',
    ],
    [3, 1, courseMap['CHE1000'] || 3, 'Friday', '14:00', '16:00', 2, 'Chemistry lab prep', 'No'],
    [4, 1, courseMap['GMM2110'] || 6, 'Saturday', '10:00', '13:00', 3, 'Geology revision', 'No'],
    [5, 1, courseMap['MAT1100'] || 1, 'Sunday', '15:00', '17:00', 2, 'Assignment work', 'No'],
  ];

  studyData.forEach((row) => sheet.appendRow(row));
  console.log('✅ Study sessions demo data created with', studyData.length, 'records');
}

function setupCertificationsDemoData(ss) {
  const sheet = ss.getSheetByName('_certifications');
  if (!sheet) {
    console.error('_certifications sheet not found');
    return;
  }

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).clearContent();
  }

  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);

  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const certs = [
    [
      1,
      1,
      'MSHA Part 48',
      'MSHA',
      formatDate(lastYear),
      formatDate(nextYear),
      'Active',
      'Surface mining certification',
    ],
    [
      2,
      1,
      'First Aid Level 1',
      'ZRCS',
      formatDate(lastYear),
      formatDate(nextYear),
      'Active',
      'Valid for 2 years',
    ],
    [
      3,
      1,
      'Gas Testing',
      'Mines Safety',
      formatDate(lastYear),
      formatDate(nextMonth),
      'Active',
      'Expires soon',
    ],
    [
      4,
      1,
      'Mine Rescue',
      'Zambia Mine Safety',
      formatDate(lastYear),
      formatDate(nextYear),
      'Active',
      'Team leader',
    ],
    [
      5,
      1,
      'Blasting Certificate',
      'Ministry of Mines',
      '2023-06-15',
      '2024-06-15',
      'Expired',
      'Renewal pending',
    ],
  ];

  certs.forEach((c) => sheet.appendRow(c));
}

function setupTrainingDemoData(ss) {
  const sheet = ss.getSheetByName('_industrial_training');
  if (!sheet) {
    console.error('_industrial_training sheet not found');
    return;
  }

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).clearContent();
  }

  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);

  const lastYearEnd = new Date(lastYear);
  lastYearEnd.setMonth(lastYear.getMonth() + 2);

  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(today.getMonth() - 2);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const training = [
    [
      1,
      1,
      'Konkola Copper Mines',
      'Student Trainee',
      formatDate(lastYear),
      formatDate(lastYearEnd),
      240,
      'J. Banda',
      'Yes',
    ],
    [
      2,
      1,
      'First Quantum Minerals',
      'Field Assistant',
      formatDate(sixMonthsAgo),
      formatDate(twoMonthsAgo),
      320,
      'M. Chanda',
      'Yes',
    ],
    [3, 1, 'ZCCM-IH', 'Lab Assistant', '2023-06-01', '2023-08-15', 240, 'S. Tembo', 'Yes'],
    [
      4,
      1,
      'Barrick Gold',
      'Exploration Intern',
      '2024-01-10',
      '2024-03-20',
      180,
      'P. Musonda',
      'Pending',
    ],
    [5, 1, 'Anglo American', 'Mining Technician', '2024-05-15', '', 120, 'K. Banda', 'Pending'],
  ];

  training.forEach((t) => sheet.appendRow(t));
}

function setupExpensesDemoData(ss) {
  const sheet = ss.getSheetByName('_expenses');
  if (!sheet) {
    console.error('_expenses sheet not found');
    return;
  }

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).clearContent();
  }

  const today = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(today.getMonth() - i);
    months.push(d.toISOString().split('T')[0]);
  }

  const expenses = [
    [1, 1, months[0], 'Tuition', 'Semester 1 Fees', 31878, 'Bank Transfer', 'receipt1.pdf'],
    [2, 1, months[0], 'Accommodation', 'Hostel fees', 4500, 'Mobile Money', 'receipt2.pdf'],
    [3, 1, months[1], 'Books', 'Geology textbooks', 1250, 'Cash', ''],
    [4, 1, months[1], 'Stationery', 'Notebooks, pens', 350, 'Cash', ''],
    [5, 1, months[2], 'Food', 'Meal plan', 800, 'Mobile Money', 'receipt3.pdf'],
    [6, 1, months[2], 'Transport', 'Bus fare', 400, 'Cash', ''],
    [7, 1, months[3], 'Tuition', 'Semester 2 Fees', 15939, 'Bank Transfer', 'receipt4.pdf'],
    [8, 1, months[3], 'Books', 'Reference materials', 850, 'Cash', ''],
    [9, 1, months[4], 'Accommodation', 'Hostel fees', 4500, 'Mobile Money', 'receipt5.pdf'],
    [10, 1, months[4], 'Food', 'Meal plan', 800, 'Mobile Money', 'receipt6.pdf'],
    [11, 1, months[5], 'Stationery', 'Printing & binding', 250, 'Cash', ''],
    [12, 1, months[5], 'Other', 'Field trip', 600, 'Cash', ''],
  ];

  expenses.forEach((e) => sheet.appendRow(e));
}

function setupDueDatesDemoData(ss) {
  const sheet = ss.getSheetByName('_due_dates');
  if (!sheet) {
    console.error('_due_dates sheet not found');
    return;
  }

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).clearContent();
  }

  const assessmentsSheet = ss.getSheetByName('_assessments');
  if (!assessmentsSheet) {
    console.error('_assessments sheet not found for due dates reference');
    return;
  }

  const assessments = assessmentsSheet.getDataRange().getValues().slice(1);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const nextMonth = new Date(today);
  nextMonth.setDate(today.getDate() + 30);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const dueDates = [
    [
      1,
      assessments[0]?.[0] || 1,
      formatDate(tomorrow),
      '23:59',
      false,
      'Pending',
      'High',
      'Final submission',
    ],
    [2, assessments[1]?.[0] || 2, formatDate(nextWeek), '17:00', false, 'Pending', 'Medium', ''],
    [
      3,
      assessments[2]?.[0] || 3,
      formatDate(nextWeek),
      '10:00',
      false,
      'Pending',
      'High',
      'Quiz 3',
    ],
    [
      4,
      assessments[3]?.[0] || 4,
      formatDate(nextMonth),
      '09:00',
      false,
      'Pending',
      'Medium',
      'Lab report',
    ],
    [
      5,
      assessments[4]?.[0] || 5,
      formatDate(tomorrow),
      '23:59',
      false,
      'Pending',
      'High',
      'Assignment',
    ],
  ];

  dueDates.forEach((d) => sheet.appendRow(d));
}
