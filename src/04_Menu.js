// 04_Menu.gs

// ==============================================
// UPDATED MENU WITH PROFILE - COMPLETE
// School of Mines, University of Zambia
// Version: 0.14.1
// ==============================================

/**
 * Original onOpen function - keeps backward compatibility
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('⛏️ UNZA Geology Tracker')
    // ========== DASHBOARD & PROFILE ==========
    .addItem('📊 My Dashboard', 'showUNZADashboard')
    .addItem('📈 My GPA', 'showGPADetails')
    .addItem('👤 My Profile', 'showProfileEditor')
    .addItem('👁️ View Profile', 'viewProfile')
    .addItem('🎓 Program Requirements', 'showProgramRequirements')
    .addItem('🎓 Graduation Status', 'checkGraduationReadiness')
    .addSeparator()

    // ========== COURSES ==========
    .addSubMenu(
      ui
        .createMenu('📚 Courses')
        .addItem('👁️ View All Courses', 'viewAllCourses')
        .addItem('➕ Add Course', 'showAddCourseModal')
        .addSeparator()
        .addItem('📝 View Assessments', 'viewAssessments')
        .addItem('➕ Add Assessment', 'showAddAssessmentModal')
        .addItem('📊 Course Progress', 'showCourseProgress')
    )

    // ========== GRADES ==========
    .addSubMenu(
      ui
        .createMenu('📊 Grades')
        .addItem('📈 View My Grades', 'viewGrades')
        .addItem('✏️ Enter Grades', 'enterGrades')
    )

    // ========== CERTIFICATIONS ==========
    .addSubMenu(
      ui
        .createMenu('🛡️ Certifications')
        .addItem('👁️ View All', 'viewCertifications')
        .addItem('➕ Add Certification', 'showAddCertificationModal')
        .addSeparator()
        .addItem('⏰ Expiry Alerts', 'checkCertExpiry')
    )

    // ========== INDUSTRIAL TRAINING ==========
    .addSubMenu(
      ui
        .createMenu('⛏️ Industrial Training')
        .addItem('👁️ View All', 'viewTraining')
        .addItem('➕ Add Internship', 'showAddTrainingModal')
        .addItem('⏱️ Track Hours', 'trackTrainingHours')
    )

    // ========== EXPENSES ==========
    .addSubMenu(
      ui
        .createMenu('💰 Finances')
        .addItem('👁️ View Expenses', 'viewExpenses')
        .addItem('➕ Add Expense', 'showAddExpenseModal')
        .addSeparator()
        .addItem('📊 Spending Analysis', 'spendingAnalysis')
        .addItem('💵 Fee Structure', 'viewFeeStructure')
    )

    // ========== SCHEDULE ==========
    .addSubMenu(
      ui
        .createMenu('📅 Schedule')
        .addItem('📅 Today', 'showTodaysSchedule')
        .addItem('📆 This Week', 'showWeeklySchedule')
        .addItem('📋 Full Timetable', 'viewFullTimetable')
        .addItem('⏰ Upcoming Deadlines', 'showUpcomingDeadlines')
        .addSeparator()
        .addItem('📚 Study Sessions', 'viewStudySessions')
        .addItem('➕ Add Study Session', 'addStudySession')
        .addItem('📝 Add Due Date', 'addDueDate')
    )

    // ========== DOCUMENTS ==========
    .addSubMenu(
      ui
        .createMenu('📄 Documents')
        .addItem('📸 Upload', 'uploadScript')
        .addItem('📁 Open Drive Folder', 'openFolders')
        .addItem('🔍 Search', 'searchDocuments')
    )

    // ========== REPORTS ==========
    .addSubMenu(
      ui
        .createMenu('📊 Reports')
        .addItem('📑 Generate Report', 'createUNZAReport')
        .addItem('📧 Email Report', 'emailProgressReport')
    )

    // ========== SYSTEM ==========
    .addSeparator()
    .addSubMenu(
      ui
        .createMenu('⚙️ System')
        .addItem('🚀 Initialize System', 'initializeCompleteSystem')
        .addSeparator()
        .addItem('🧹 Soft Reset', 'softReset')
        .addItem('💣 Nuke System', 'nukeSystem')
        .addSeparator()
        .addItem('👁️ Show All Hidden Tables', 'showHiddenTables')
        .addItem('👁️‍🗨️ Hide All Database Tables', 'hideDatabaseTables')
        .addItem('📊 View Table Statistics', 'showNormalizedTables')
        .addSeparator()
        .addItem('🔄 Upgrade Students Table', 'upgradeStudentsTable')
    )

    // ========== TESTING ==========
    .addSeparator()
    .addSubMenu(
      ui
        .createMenu('🧪 Testing')
        .addItem('🔬 Run All Library Tests', 'runAllLibraryTests')
        .addItem('👤 Test Profile System', 'testProfileSystem')
        .addSeparator()
        .addItem('⚙️ Test Config', 'testConfig')
        .addItem('🗄️ Test Database', 'testDatabase')
        .addItem('📊 Test GPA', 'testGPA')
        .addItem('📚 Test Courses', 'testCourses')
        .addItem('📝 Test Assessments', 'testAssessments')
        .addItem('📈 Test Grades', 'testGrades')
        .addItem('🛡️ Test Certifications', 'testCertifications')
        .addItem('💰 Test Expenses', 'testExpenses')
        .addItem('⛏️ Test Training', 'testTraining')
        .addItem('📅 Test Timetable', 'testTimetable')
        .addItem('📚 Test Study Sessions', 'testStudySessions')
        .addItem('⏰ Test Due Dates', 'testDueDates')
        .addItem('📑 Test Reports', 'testReports')
        .addItem('⚙️ Test System', 'testSystem')
        .addItem('🎨 Test UI', 'testUI')
    )

    // ========== VERSION & HELP ==========
    .addSeparator()
    .addItem('📍 Version', 'showVersion')
    .addItem('📊 Changelog', 'viewChangelog')
    .addItem('❓ Help', 'showHelp')

    .addToUi();
}

/**
 * NEW FUNCTION: Create full menu (for thin template to call)
 * This allows the template to just call one function
 */
function createFullMenu() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('⛏️ UNZA Geology Tracker')
    // ========== DASHBOARD & PROFILE ==========
    .addItem('📊 My Dashboard', 'showUNZADashboard')
    .addItem('📈 My GPA', 'showGPADetails')
    .addItem('👤 My Profile', 'showProfileEditor')
    .addItem('👁️ View Profile', 'viewProfile')
    .addItem('🎓 Program Requirements', 'showProgramRequirements')
    .addItem('🎓 Graduation Status', 'checkGraduationReadiness')
    .addSeparator()

    // ========== COURSES ==========
    .addSubMenu(
      ui
        .createMenu('📚 Courses')
        .addItem('👁️ View All Courses', 'viewAllCourses')
        .addItem('➕ Add Course', 'showAddCourseModal')
        .addSeparator()
        .addItem('📝 View Assessments', 'viewAssessments')
        .addItem('➕ Add Assessment', 'showAddAssessmentModal')
        .addItem('📊 Course Progress', 'showCourseProgress')
    )

    // ========== GRADES ==========
    .addSubMenu(
      ui
        .createMenu('📊 Grades')
        .addItem('📈 View My Grades', 'viewGrades')
        .addItem('✏️ Enter Grades', 'enterGrades')
    )

    // ========== CERTIFICATIONS ==========
    .addSubMenu(
      ui
        .createMenu('🛡️ Certifications')
        .addItem('👁️ View All', 'viewCertifications')
        .addItem('➕ Add Certification', 'showAddCertificationModal')
        .addSeparator()
        .addItem('⏰ Expiry Alerts', 'checkCertExpiry')
    )

    // ========== INDUSTRIAL TRAINING ==========
    .addSubMenu(
      ui
        .createMenu('⛏️ Industrial Training')
        .addItem('👁️ View All', 'viewTraining')
        .addItem('➕ Add Internship', 'showAddTrainingModal')
        .addItem('⏱️ Track Hours', 'trackTrainingHours')
    )

    // ========== EXPENSES ==========
    .addSubMenu(
      ui
        .createMenu('💰 Finances')
        .addItem('👁️ View Expenses', 'viewExpenses')
        .addItem('➕ Add Expense', 'showAddExpenseModal')
        .addSeparator()
        .addItem('📊 Spending Analysis', 'spendingAnalysis')
        .addItem('💵 Fee Structure', 'viewFeeStructure')
    )

    // ========== SCHEDULE ==========
    .addSubMenu(
      ui
        .createMenu('📅 Schedule')
        .addItem('📅 Today', 'showTodaysSchedule')
        .addItem('📆 This Week', 'showWeeklySchedule')
        .addItem('📋 Full Timetable', 'viewFullTimetable')
        .addItem('⏰ Upcoming Deadlines', 'showUpcomingDeadlines')
        .addSeparator()
        .addItem('📚 Study Sessions', 'viewStudySessions')
        .addItem('➕ Add Study Session', 'addStudySession')
        .addItem('📝 Add Due Date', 'addDueDate')
    )

    // ========== DOCUMENTS ==========
    .addSubMenu(
      ui
        .createMenu('📄 Documents')
        .addItem('📸 Upload', 'uploadScript')
        .addItem('📁 Open Drive Folder', 'openFolders')
        .addItem('🔍 Search', 'searchDocuments')
    )

    // ========== REPORTS ==========
    .addSubMenu(
      ui
        .createMenu('📊 Reports')
        .addItem('📑 Generate Report', 'createUNZAReport')
        .addItem('📧 Email Report', 'emailProgressReport')
    )

    // ========== SYSTEM ==========
    .addSeparator()
    .addSubMenu(
      ui
        .createMenu('⚙️ System')
        .addItem('🚀 Initialize System', 'initializeCompleteSystem')
        .addSeparator()
        .addItem('🧹 Soft Reset', 'softReset')
        .addItem('💣 Nuke System', 'nukeSystem')
        .addSeparator()
        .addItem('👁️ Show All Hidden Tables', 'showHiddenTables')
        .addItem('👁️‍🗨️ Hide All Database Tables', 'hideDatabaseTables')
        .addItem('📊 View Table Statistics', 'showNormalizedTables')
        .addSeparator()
        .addItem('🔄 Upgrade Students Table', 'upgradeStudentsTable')
    )

    // ========== TESTING ==========
    .addSeparator()
    .addSubMenu(
      ui
        .createMenu('🧪 Testing')
        .addItem('🔬 Run All Library Tests', 'runAllLibraryTests')
        .addItem('👤 Test Profile System', 'testProfileSystem')
        .addSeparator()
        .addItem('⚙️ Test Config', 'testConfig')
        .addItem('🗄️ Test Database', 'testDatabase')
        .addItem('📊 Test GPA', 'testGPA')
        .addItem('📚 Test Courses', 'testCourses')
        .addItem('📝 Test Assessments', 'testAssessments')
        .addItem('📈 Test Grades', 'testGrades')
        .addItem('🛡️ Test Certifications', 'testCertifications')
        .addItem('💰 Test Expenses', 'testExpenses')
        .addItem('⛏️ Test Training', 'testTraining')
        .addItem('📅 Test Timetable', 'testTimetable')
        .addItem('📚 Test Study Sessions', 'testStudySessions')
        .addItem('⏰ Test Due Dates', 'testDueDates')
        .addItem('📑 Test Reports', 'testReports')
        .addItem('⚙️ Test System', 'testSystem')
        .addItem('🎨 Test UI', 'testUI')
    )

    // ========== VERSION & HELP ==========
    .addSeparator()
    .addItem('📍 Version', 'showVersion')
    .addItem('📊 Changelog', 'viewChangelog')
    .addItem('❓ Help', 'showHelp')

    .addToUi();
}

/**
 * NEW FUNCTION: Check library status (for thin template)
 */
function checkLibraryStatus() {
  return {
    connected: true,
    version: typeof APP_VERSION !== 'undefined' ? APP_VERSION : 'unknown',
    message: `Connected to UNZA Geology Tracker v${APP_VERSION || 'unknown'}`,
  };
}

/**
 * Wrapper functions (keeping for backward compatibility)
 */
function showAddCourseModal() {
  if (typeof addCourse === 'function') {
    addCourse();
  } else {
    showAlert('Course functions not loaded properly', 'error');
  }
}

function showAddAssessmentModal() {
  if (typeof addAssessment === 'function') {
    addAssessment();
  } else {
    showAlert('Assessment functions not loaded properly', 'error');
  }
}

function showAddCertificationModal() {
  if (typeof addCertification === 'function') {
    addCertification();
  } else {
    showAlert('Certification functions not loaded', 'error');
  }
}

function showAddTrainingModal() {
  if (typeof addTraining === 'function') {
    addTraining();
  } else {
    showAlert('Training functions not loaded', 'error');
  }
}

function showAddExpenseModal() {
  if (typeof addExpense === 'function') {
    addExpense();
  } else {
    showAlert('Expense functions not loaded', 'error');
  }
}

// ==============================================
// EXPORT ALL FUNCTIONS TO GEOLOGYLIB OBJECT
// Add this at the VERY END of 04_Menu.js
// ==============================================

// Create a single export object with all library functions
const GeologyLib = {
  // Version
  getVersionInfo,
  showVersion,
  viewChangelog,
  viewFullChangelog,
  addChangelogEntryPrompt,
  addChangelogEntry,
  setupChangelogSheet,
  versionCompare,
  
  // Init
  initializeCompleteSystem,
  upgradeStudentsTable,
  
  // Menu
  onOpen,
  createFullMenu,
  checkLibraryStatus,
  
  // Wrappers
  showAddCourseModal,
  showAddAssessmentModal,
  showAddCertificationModal,
  showAddTrainingModal,
  showAddExpenseModal,
  viewFeeStructure,
  
  // GPA
  calculateUNGPA,
  calculateNormalizedGPA,
  percentageToGradePoint,
  calculateLegacyGPA,
  showGPADetails,
  
  // Program Requirements
  showProgramRequirements,
  showDetailedRequirements,
  checkCategoryRequirement,
  getRequirementsSummary,
  calculateUNZAProgress,
  getDefaultProgress,
  
  // Courses
  viewAllCourses,
  showAddCourseModal,
  saveCourse,
  showEditCourseModal,
  updateCourse,
  deleteCourse,
  showCourseProgress,
  getAllCourses,
  calculateCourseCA,
  
  // Assessments
  viewAssessments,
  showAddAssessmentModal,
  saveAssessment,
  deleteAssessment,
  
  // Grades
  enterGrades,
  getAssessmentDetails,
  saveGrade,
  viewGrades,
  
  // Certifications
  viewCertifications,
  showAddCertificationModal,
  saveCertification,
  deleteCertification,
  checkCertExpiry,
  
  // Expenses
  viewExpenses,
  showAddExpenseModal,
  saveExpense,
  deleteExpense,
  spendingAnalysis,
  
  // Timetable
  showTodaysSchedule,
  showWeeklySchedule,
  viewFullTimetable,
  getCourseCode,
  
  // Study Sessions
  viewStudySessions,
  addStudySession,
  saveStudySession,
  markStudySessionCompleted,
  deleteStudySession,
  showStudyStats,
  getWeeklyStudySummary,
  
  // Due Dates
  showUpcomingDeadlines,
  addDueDate,
  saveDueDate,
  
  // Training
  viewTraining,
  showAddTrainingModal,
  saveTraining,
  trackTrainingHours,
  deleteTraining,
  
  // Dashboard
  showUNZADashboard,
  getMotivationalMessage,
  createProgressBar,
  getCourseCount,
  getAssessmentCount,
  getGradeCount,
  
  // Reports
  createUNZAReport,
  emailProgressReport,
  checkGraduationReadiness,
  
  // Documents
  uploadScript,
  openFolders,
  searchDocuments,
  
  // System Resets
  nukeSystem,
  softReset,
  clearNormalizedData,
  
  // Normalized Sheets
  showNormalizedTables,
  showHiddenTables,
  hideDatabaseTables,
  
  // UI Helpers
  showModal,
  showToast,
  showAlert,
  showConfirm,
  getBaseHTML,
  showHelp,
  
  // Tests
  testGPA,
  testProgress,
  testProfile,
  runAllLibraryTests,
  testConfig,
  testDatabase,
  testGPA,
  testCourses,
  testAssessments,
  testGrades,
  testCertifications,
  testExpenses,
  testTraining,
  testTimetable,
  testStudySessions,
  testDueDates,
  testReports,
  testSystem,
  testUI,
  
  // Profile
  showProfileEditor,
  viewProfile,
  updateProfile,
  getProfileSummary,
  testProfileSystem,
  
  // Template Helpers
  TemplateVersion,
  TEMPLATE_CONSTANTS,
  TemplateUtils,
  TemplateLocal,
  TemplateTests,
  LibraryChecker,
  showVersion,
  checkVersionCompatibility,
  showHelp,
  testLibraryConnection,
  runAllTemplateTests,
  showLibraryDiagnostic,
  fixLibraryConnection,
  forceLibraryReload,
  debugAvailableFunctions
};

// Make it globally available
this.GeologyLib = GeologyLib;

console.log('✅ GeologyLib exported with', Object.keys(GeologyLib).length, 'functions');