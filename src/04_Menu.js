// 04_Menu.gs

// ==============================================
// UPDATED MENU WITH PROFILE
// Update 04_Menu.gs with this
// ==============================================

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
