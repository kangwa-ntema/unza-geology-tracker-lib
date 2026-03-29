// ==============================================
// FILE: 99_Exports.js
// ==============================================
// FINAL EXPORT - MUST BE LAST FILE
// ==============================================

// Use var instead of const to match the declaration in 26_TemplateHelpers.js
GeologyLib = {
  // ========== VERSION ==========
  getVersionInfo: function () {
    return TemplateVersion.getVersion().full;
  },
  showVersion: function () {
    TemplateVersion.showVersion();
  },
  viewChangelog: viewChangelog,
  viewFullChangelog: viewFullChangelog,
  addChangelogEntryPrompt: addChangelogEntryPrompt,
  addChangelogEntry: addChangelogEntry,
  setupChangelogSheet: setupChangelogSheet,
  versionCompare: versionCompare,

  // ========== INIT ==========
  initializeCompleteSystem: initializeCompleteSystem,
  upgradeStudentsTable: upgradeStudentsTable,

  // ========== MENU ==========
  onOpen: onOpen,
  createFullMenu: createFullMenu,
  checkLibraryStatus: checkLibraryStatus,

  // ========== WRAPPERS ==========
  showAddCourseModal: showAddCourseModal,
  showAddAssessmentModal: showAddAssessmentModal,
  showAddCertificationModal: showAddCertificationModal,
  showAddTrainingModal: showAddTrainingModal,
  showAddExpenseModal: showAddExpenseModal,
  viewFeeStructure: viewFeeStructure,

  // ========== GPA ==========
  calculateUNGPA: calculateUNGPA,
  calculateNormalizedGPA: calculateNormalizedGPA,
  percentageToGradePoint: percentageToGradePoint,
  calculateLegacyGPA: calculateLegacyGPA,
  showGPADetails: showGPADetails,

  // ========== PROGRAM REQUIREMENTS ==========
  showProgramRequirements: showProgramRequirements,
  showDetailedRequirements: showDetailedRequirements,
  checkCategoryRequirement: checkCategoryRequirement,
  getRequirementsSummary: getRequirementsSummary,
  calculateUNZAProgress: calculateUNZAProgress,
  getDefaultProgress: getDefaultProgress,

  // ========== COURSES ==========
  viewAllCourses: viewAllCourses,
  saveCourse: saveCourse,
  showEditCourseModal: showEditCourseModal,
  updateCourse: updateCourse,
  deleteCourse: deleteCourse,
  showCourseProgress: showCourseProgress,
  getAllCourses: getAllCourses,
  calculateCourseCA: calculateCourseCA,

  // ========== ASSESSMENTS ==========
  viewAssessments: viewAssessments,
  saveAssessment: saveAssessment,
  deleteAssessment: deleteAssessment,

  // ========== GRADES ==========
  enterGrades: enterGrades,
  getAssessmentDetails: getAssessmentDetails,
  saveGrade: saveGrade,
  viewGrades: viewGrades,

  // ========== CERTIFICATIONS ==========
  viewCertifications: viewCertifications,
  saveCertification: saveCertification,
  deleteCertification: deleteCertification,
  checkCertExpiry: checkCertExpiry,

  // ========== EXPENSES ==========
  viewExpenses: viewExpenses,
  saveExpense: saveExpense,
  deleteExpense: deleteExpense,
  spendingAnalysis: spendingAnalysis,

  // ========== TIMETABLE ==========
  showTodaysSchedule: showTodaysSchedule,
  showWeeklySchedule: showWeeklySchedule,
  viewFullTimetable: viewFullTimetable,
  getCourseCode: getCourseCode,

  // ========== STUDY SESSIONS ==========
  viewStudySessions: viewStudySessions,
  addStudySession: addStudySession,
  saveStudySession: saveStudySession,
  markStudySessionCompleted: markStudySessionCompleted,
  deleteStudySession: deleteStudySession,
  showStudyStats: showStudyStats,
  getWeeklyStudySummary: getWeeklyStudySummary,

  // ========== DUE DATES ==========
  showUpcomingDeadlines: showUpcomingDeadlines,
  addDueDate: addDueDate,
  saveDueDate: saveDueDate,

  // ========== TRAINING ==========
  viewTraining: viewTraining,
  saveTraining: saveTraining,
  trackTrainingHours: trackTrainingHours,
  deleteTraining: deleteTraining,

  // ========== DASHBOARD ==========
  showUNZADashboard: showUNZADashboard,
  getMotivationalMessage: getMotivationalMessage,
  createProgressBar: createProgressBar,
  getCourseCount: getCourseCount,
  getAssessmentCount: getAssessmentCount,
  getGradeCount: getGradeCount,

  // ========== REPORTS ==========
  createUNZAReport: createUNZAReport,
  emailProgressReport: emailProgressReport,
  checkGraduationReadiness: checkGraduationReadiness,

  // ========== DOCUMENTS ==========
  uploadScript: uploadScript,
  openFolders: openFolders,
  searchDocuments: searchDocuments,

  // ========== SYSTEM RESETS ==========
  nukeSystem: nukeSystem,
  softReset: softReset,
  clearNormalizedData: clearNormalizedData,

  // ========== NORMALIZED SHEETS ==========
  showNormalizedTables: showNormalizedTables,
  showHiddenTables: showHiddenTables,
  hideDatabaseTables: hideDatabaseTables,

  // ========== UI HELPERS ==========
  showModal: showModal,
  showToast: showToast,
  showAlert: showAlert,
  showConfirm: showConfirm,
  getBaseHTML: getBaseHTML,
  showHelp: function () {
    TemplateLocal.showHelp();
  },

  // ========== TESTS - Complete List ==========
  // Basic tests
  testGPA: testGPA,
  testProgress: testProgress,
  testProfile: testProfile,
  runAllLibraryTests: runAllLibraryTests,

  // Individual test functions
  testConfig: testConfig,
  testDatabase: testDatabase,
  testCourses: testCourses,
  testAssessments: testAssessments,
  testGrades: testGrades,
  testCertifications: testCertifications,
  testExpenses: testExpenses,
  testTraining: testTraining,
  testTimetable: testTimetable,
  testStudySessions: testStudySessions,
  testDueDates: testDueDates,
  testReports: testReports,
  testSystem: testSystem,
  testUI: testUI,
  testProfileSystem: testProfileSystem,

  // ========== PROFILE ==========
  showProfileEditor: showProfileEditor,
  viewProfile: viewProfile,
  updateProfile: updateProfile,
  getProfileSummary: getProfileSummary,

  // ========== TEMPLATE HELPERS ==========
  TemplateVersion: TemplateVersion,
  TEMPLATE_CONSTANTS: TEMPLATE_CONSTANTS,
  TemplateUtils: TemplateUtils,
  TemplateLocal: TemplateLocal,
  TemplateTests: TemplateTests,
  LibraryChecker: LibraryChecker,

  // ========== DIAGNOSTIC HELPERS ==========
  testLibraryConnection: testLibraryConnection,
  runAllTemplateTests: runAllTemplateTests,
  showLibraryDiagnostic: showLibraryDiagnostic,
  fixLibraryConnection: fixLibraryConnection,
  forceLibraryReload: forceLibraryReload,
  debugAvailableFunctions: debugAvailableFunctions,
};

// Make it globally available
this.GeologyLib = GeologyLib;

// Log the number of functions exported
var functionCount = Object.keys(GeologyLib).filter(
  (key) => typeof GeologyLib[key] === 'function'
).length;
console.log(`✅ FINAL EXPORT: GeologyLib ready with ${functionCount} functions`);
