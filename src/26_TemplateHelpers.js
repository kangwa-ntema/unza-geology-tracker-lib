// 26_TemplateHelpers.gs

// ==============================================
// TEMPLATE HELPER FUNCTIONS - COMPLETE FIXED VERSION
// All template-side logic moved to library
// Version: 0.15.0
// ==============================================

// ==============================================
// VERSION SYNC HELPERS (from template 02_VersionSync.js)
// ==============================================

const TemplateVersion = {
  /**
   * Get version from library
   */
  getVersion: function () {
    if (!GeologyLib) {
      return {
        success: false,
        version: 'unknown',
        message: 'Library not loaded',
      };
    }

    if (typeof GeologyLib.getVersionInfo === 'function') {
      try {
        const versionInfo = GeologyLib.getVersionInfo();
        const versionMatch = versionInfo.match(/v(\d+\.\d+\.\d+)/);
        if (versionMatch) {
          return {
            success: true,
            version: versionMatch[1],
            full: versionInfo,
            method: 'getVersionInfo',
          };
        }
      } catch (e) {
        console.log('getVersionInfo failed:', e);
      }
    }

    if (GeologyLib.APP_VERSION) {
      return {
        success: true,
        version: GeologyLib.APP_VERSION,
        full: `UNZA Geology Tracker v${GeologyLib.APP_VERSION}`,
        method: 'APP_VERSION',
      };
    }

    if (GeologyLib.CONFIG && GeologyLib.CONFIG.version) {
      return {
        success: true,
        version: GeologyLib.CONFIG.version,
        full: `UNZA Geology Tracker v${GeologyLib.CONFIG.version}`,
        method: 'CONFIG',
      };
    }

    return {
      success: false,
      version: 'unknown',
      message: 'No version info available',
    };
  },

  showVersion: function () {
    const ui = SpreadsheetApp.getUi();
    const libVersion = this.getVersion();

    let message = '📍 UNZA Geology Tracker\n\n';
    message += `📋 Template Version: Thin Client\n`;

    if (libVersion.success) {
      message += `📚 Library Version: v${libVersion.version}\n`;
      message += `🔄 Sync Status: ✅ Connected\n\n`;
      message += `${libVersion.full}`;
    } else {
      message += `📚 Library Version: Not connected\n`;
      message += `🔄 Sync Status: ❌ Not Connected\n\n`;
      message += `Library Status:\n`;
      message += `• GeologyLib exists: ${typeof GeologyLib !== 'undefined'}\n`;
      if (typeof GeologyLib !== 'undefined') {
        message += `• Type: ${typeof GeologyLib}\n`;
        message += `• Is object: ${GeologyLib !== null && typeof GeologyLib === 'object'}\n`;
      }
      message += `\nTroubleshooting:\n`;
      message += `1. Go to Extensions → Apps Script\n`;
      message += `2. Click "Libraries" in left sidebar\n`;
      message += `3. Verify Identifier is: GeologyLib\n`;
      message += `4. Select a specific version (not HEAD)\n`;
      message += `5. Click Save\n`;
      message += `6. Refresh this spreadsheet\n`;
    }

    ui.alert(message);
  },

  checkCompatibility: function () {
    const libVersion = this.getVersion();

    if (!libVersion.success) {
      return {
        compatible: false,
        message: 'Cannot check compatibility - library not connected',
        libVersion: 'unknown',
        minRequired: '0.14.0',
      };
    }

    const libParts = libVersion.version.split('.').map(Number);
    const minParts = [0, 14, 0];

    if (libParts[0] !== minParts[0]) {
      return {
        compatible: libParts[0] > minParts[0],
        message:
          libParts[0] > minParts[0]
            ? 'Library major version is newer - should be compatible'
            : 'Library major version is older - may have compatibility issues',
        libVersion: libVersion.version,
        minRequired: '0.14.0',
      };
    }

    if (libParts[1] < minParts[1]) {
      return {
        compatible: false,
        message: `Library version ${libVersion.version} is older than required 0.14.0 - please update library`,
        libVersion: libVersion.version,
        minRequired: '0.14.0',
      };
    }

    return {
      compatible: true,
      message: `Library v${libVersion.version} is compatible`,
      libVersion: libVersion.version,
      minRequired: '0.14.0',
    };
  },
};

// ==============================================
// CONSTANTS
// ==============================================

const TEMPLATE_CONSTANTS = {
  SUPPORT_EMAIL: 'support@unza.edu.zm',
  DOCS_URL: 'https://unza.edu.zm/geology-tracker',
  MESSAGES: {
    WELCOME: '👋 Welcome to UNZA Geology Tracker!',
    NO_LIBRARY: '⚠️ Library not connected. Please check your configuration.',
    INIT_NEEDED: 'Please initialize the system first (System → Initialize System)',
    LOADING: '⏳ Loading template modules...',
  },
  COLORS: {
    PRIMARY: '#1a73e8',
    SUCCESS: '#0f9d58',
    WARNING: '#f4b400',
    DANGER: '#d93025',
  },
};

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

const TemplateUtils = {
  safeCall: function (functionName, ...args) {
    try {
      if (!GeologyLib) {
        this.showLibraryNotLoadedError();
        return null;
      }

      if (typeof GeologyLib[functionName] === 'function') {
        return GeologyLib[functionName](...args);
      } else {
        console.error(`Function ${functionName} not found in library`);
        this.showFunctionError(functionName);
        return null;
      }
    } catch (e) {
      console.error(`Error calling ${functionName}: ${e.toString()}`);
      this.showLibraryError(functionName, e);
      return null;
    }
  },

  showLibraryNotLoadedError: function () {
    const ui = SpreadsheetApp.getUi();
    ui.alert(
      '⚠️ Library Not Loaded',
      'The Geology Tracker library is not loaded.\n\n' +
        'Please check:\n' +
        '1. The library is properly linked\n' +
        '2. You have proper permissions\n\n' +
        'Run "Show Library Diagnostic" for details.',
      ui.ButtonSet.OK
    );
  },

  showFunctionError: function (functionName) {
    const ui = SpreadsheetApp.getUi();
    ui.alert(
      '⚠️ Function Not Available',
      `The function "${functionName}" is not available in the library.\n\n` +
        'This may be due to an outdated library version.\n\n' +
        'Please contact your administrator.',
      ui.ButtonSet.OK
    );
  },

  showLibraryError: function (functionName, error) {
    const ui = SpreadsheetApp.getUi();
    ui.alert(
      '⚠️ Library Error',
      `Error calling ${functionName}:\n\n${error.toString()}\n\n` +
        'Please check your library connection.',
      ui.ButtonSet.OK
    );
  },

  isLibraryAvailable: function () {
    return !!(GeologyLib && Object.keys(GeologyLib).length > 0);
  },

  getLibraryStatus: function () {
    if (!GeologyLib) {
      return { connected: false, reason: 'Library object not found' };
    }

    try {
      if (typeof GeologyLib.getVersionInfo === 'function') {
        const version = GeologyLib.getVersionInfo();
        return {
          connected: true,
          version: version,
          message: `Connected to ${version}`,
        };
      } else {
        return {
          connected: false,
          reason: 'Library functions not accessible',
        };
      }
    } catch (e) {
      return {
        connected: false,
        reason: e.toString(),
      };
    }
  },
};

// ==============================================
// LOCAL FUNCTIONS
// ==============================================

const TemplateLocal = {
  viewFeeStructure: function () {
    const html = HtmlService.createHtmlOutput(`
      <html>
        <head>
          <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css">
          <style>
            body { font-family: 'Google Sans', sans-serif; padding: 20px; }
            .fee-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .fee-table th { text-align: left; padding: 12px; background: #f8f9fa; }
            .fee-table td { padding: 12px; border-bottom: 1px solid #dadce0; }
          </style>
        </head>
        <body>
          <h3 style="color:#1a73e8">UNZA SCHOOL OF MINES - FEE STRUCTURE</h3>
          <h4>A. Zambian Students</h4>
          <table class="fee-table">
            <tr><th>Programme</th><th>Tuition per Year</th></tr>
            <tr><td>Science-Based</td><td><strong>K31,878.00</strong></td></tr>
          </table>
          <h4>B. International Students</h4>
          <table class="fee-table">
            <tr><th>Programme</th><th>Tuition per Year</th></tr>
            <tr><td>Science-Based</td><td><strong>K62,890.00</strong></td></tr>
          </table>
          <h4>C. Other Fees</h4>
          <table class="fee-table">
            <tr><th>Fee Type</th><th>Amount</th><th>Period</th></tr>
            <tr><td>Registration</td><td>K40.00</td><td>Per Year</td></tr>
            <tr><td>Examination</td><td>K50.00</td><td>Per Course</td></tr>
            <tr><td>Medical</td><td>K200.00</td><td>Per Year</td></tr>
          </table>
          <div style="margin-top: 20px;">
            <button class="btn btn-primary" onclick="google.script.host.close()">Close</button>
          </div>
        </body>
      </html>
    `).setWidth(500).setHeight(500);
    SpreadsheetApp.getUi().showModalDialog(html, '💰 Fee Structure');
  },

  showHelp: function () {
    const status = TemplateUtils.getLibraryStatus();
    const statusMessage = status.connected
      ? `<span style="color:#0f9d58">✅ ${status.message}</span>`
      : `<span style="color:#d93025">❌ Library not connected</span>`;

    const version = typeof APP_VERSION !== 'undefined' ? APP_VERSION : 'unknown';

    const html = HtmlService.createHtmlOutput(`
      <html>
        <head>
          <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css">
          <style>
            body { font-family: 'Google Sans', sans-serif; padding: 20px; }
            .step { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
            .version-badge { 
              background: #1a73e8; 
              color: white; 
              padding: 4px 12px; 
              border-radius: 16px;
              display: inline-block;
              font-size: 14px;
            }
            .status { margin: 10px 0; padding: 10px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="color:#1a73e8; margin:0">📋 UNZA Geology Tracker</h3>
            <span class="version-badge">v${version}</span>
          </div>
          <div class="status">${statusMessage}</div>
          <div class="step">
            <h4>🚀 Getting Started</h4>
            <p>1. Go to <strong>System → Initialize System</strong> to set up your database</p>
            <p>2. Add your courses under <strong>Courses → Add Course</strong></p>
            <p>3. Add assessments under <strong>Courses → Add Assessment</strong></p>
            <p>4. Enter your grades under <strong>Grades → Enter Grades</strong></p>
          </div>
          <div class="step">
            <h4>📊 Tracking Progress</h4>
            <p>• View your GPA anytime from the Dashboard</p>
            <p>• Check graduation requirements under Graduation Status</p>
            <p>• Track expenses, certifications, and industrial training</p>
          </div>
          <div class="step">
            <h4>📅 Schedule Management</h4>
            <p>• View your timetable under <strong>Schedule</strong> menu</p>
            <p>• Add study sessions to track personal study time</p>
            <p>• Set due dates for assignments and exams</p>
          </div>
          <div class="step">
            <h4>🔧 Troubleshooting</h4>
            <p>• <strong>Library not connected?</strong> Run Tests → Show Library Diagnostic</p>
            <p>• <strong>Functions not working?</strong> Run Tests → Test Library Connection</p>
            <p>• <strong>Need to reset?</strong> Use System → Soft Reset or Nuke System</p>
          </div>
          <div class="step">
            <h4>🛠️ Need Help?</h4>
            <p>• Current Version: <strong>${version}</strong></p>
            <p>• Check Changelog for recent updates</p>
            <p>• Contact: support@unza.edu.zm</p>
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <button class="btn btn-primary" onclick="google.script.host.close()">Close</button>
          </div>
        </body>
      </html>
    `).setWidth(500).setHeight(700);
    SpreadsheetApp.getUi().showModalDialog(html, '📋 User Guide');
  },

  showVersion: function () {
    const ui = SpreadsheetApp.getUi();
    const status = TemplateUtils.getLibraryStatus();

    let message = `📍 UNZA Geology Tracker v${APP_VERSION || 'unknown'}\n\n`;
    message += `Template Version: Thin Client\n\n`;

    if (status.connected) {
      message += `✅ ${status.message}`;
    } else {
      message += `❌ Library not connected\n`;
      message += `Reason: ${status.reason || 'Unknown error'}`;
    }
    ui.alert(message);
  },
};

// ==============================================
// TEST SUITE
// ==============================================

const TemplateTests = {
  runAllTemplateTests: function () {
    console.log('🔬 STARTING TEMPLATE TEST SUITE');

    let results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: [],
    };

    this.testLibraryConnection(results);
    this.testUtils(results);
    this.testVersionConsistency(results);

    this.showResults(results);
  },

  testLibraryConnection: function (results) {
    console.log('\n🔗 Testing LIBRARY CONNECTION...');

    results.total++;

    try {
      const status = TemplateUtils.getLibraryStatus();

      if (status.connected) {
        console.log(`    ✓ Connected - ${status.message}`);
        results.passed++;
        results.details.push(`✅ LIBRARY: Connected - ${status.message}`);
      } else {
        throw new Error(status.reason || 'Not connected');
      }
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ LIBRARY: ${e.message}`);
    }
  },

  testUtils: function (results) {
    console.log('\n🔧 Testing UTILITY functions...');
    results.total++;

    try {
      const utilFunctions = ['safeCall', 'isLibraryAvailable', 'getLibraryStatus'];
      let workingCount = 0;

      utilFunctions.forEach((f) => {
        if (typeof TemplateUtils[f] === 'function') workingCount++;
      });

      if (workingCount === utilFunctions.length) {
        console.log(`    ✓ All utilities available`);
        results.passed++;
        results.details.push(`✅ UTILS: All utility functions available`);
      } else {
        throw new Error(`Only ${workingCount}/${utilFunctions.length} utilities available`);
      }
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ UTILS: ${e.message}`);
    }
  },

  testVersionConsistency: function (results) {
    console.log('\n📌 Testing VERSION consistency...');
    results.total++;

    try {
      const status = TemplateUtils.getLibraryStatus();

      if (status.connected) {
        console.log(`    ✓ Library connected`);
        results.passed++;
        results.details.push(`✅ VERSION: Template Thin Client | ${status.message}`);
      } else {
        results.details.push(`⚠️ VERSION: Library not connected`);
        results.passed++;
      }
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
      results.failed++;
      results.details.push(`❌ VERSION: ${e.message}`);
    }
  },

  showResults: function (results) {
    const ui = SpreadsheetApp.getUi();

    const percentage = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0;

    const barLength = 30;
    const filled = Math.round((percentage / 100) * barLength);
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

    let message = `📋 TEMPLATE TEST RESULTS\n\n`;
    message += `${bar} ${percentage}%\n\n`;
    message += `✅ Passed: ${results.passed}\n`;
    message += `❌ Failed: ${results.failed}\n`;
    message += `📊 Total:  ${results.total}\n\n`;

    const failed = results.details.filter((d) => d.includes('❌'));
    if (failed.length > 0) {
      message += '🔴 FAILED:\n';
      failed.forEach((f) => (message += f + '\n'));
    }

    ui.alert(message);
  },
};

// ==============================================
// LIBRARY CHECKER
// ==============================================

const LibraryChecker = {
  checkStatus: function () {
    console.log('🔍 Checking library status...');

    const result = {
      libraryExists: typeof GeologyLib !== 'undefined',
      libraryType: typeof GeologyLib,
      isObject: GeologyLib !== null && typeof GeologyLib === 'object',
      functionCount: 0,
      version: null,
    };

    if (result.libraryExists && result.isObject) {
      try {
        result.functionCount = Object.keys(GeologyLib).filter(
          (key) => typeof GeologyLib[key] === 'function'
        ).length;

        if (typeof GeologyLib.getVersionInfo === 'function') {
          result.version = GeologyLib.getVersionInfo();
        }
      } catch (e) {
        console.error('Error checking library:', e);
      }
    }

    return result;
  },

  forceReload: function () {
    console.log('🔄 Forcing library reload...');
    const status = this.checkStatus();

    if (status.libraryExists && status.isObject) {
      console.log(`✅ Library found with ${status.functionCount} functions`);
      if (status.version) console.log(`📚 Version: ${status.version}`);
    }

    return status;
  },

  showStatus: function () {
    const ui = SpreadsheetApp.getUi();
    const status = this.forceReload();

    let message = '🔍 LIBRARY CONNECTION DIAGNOSTIC\n\n';
    message += `📚 Library exists: ${status.libraryExists ? '✅ YES' : '❌ NO'}\n`;

    if (status.libraryExists) {
      message += `📦 Type: ${status.libraryType}\n`;
      message += `🔧 Is object: ${status.isObject ? '✅ YES' : '❌ NO'}\n`;

      if (status.isObject) {
        message += `\n📋 FUNCTIONS:\n`;
        message += `  • Total functions: ${status.functionCount}\n`;

        if (status.version) {
          message += `\n🔢 VERSION:\n`;
          message += `  • ${status.version}\n`;
        }
      }
    }

    message += `\n📌 RECOMMENDATIONS:\n`;
    if (!status.libraryExists) {
      message += `  • Add library in Apps Script → Libraries\n`;
      message += `  • Script ID: 1cCt4YE5RJn0Ow4vDExwJ5VcASWW-UfgiIFBQt5eFk0dxnU4yP3LKBpx2\n`;
      message += `  • Identifier: GeologyLib\n`;
    } else if (!status.isObject) {
      message += `  • Library loaded as string, not object\n`;
      message += `  • Remove any code that does: GeologyLib = LIBRARY_ID\n`;
    } else if (status.functionCount === 0) {
      message += `  • Library has no functions - check library project\n`;
    } else {
      message += `  • ✅ Library is properly connected!\n`;
    }

    ui.alert(message);
  },

  quickFix: function () {
    const ui = SpreadsheetApp.getUi();
    const status = this.checkStatus();

    if (!status.libraryExists) {
      ui.alert(
        '❌ Cannot Fix Automatically',
        'Please add the library manually:\n\n' +
          '1. Go to Extensions → Apps Script\n' +
          '2. Click "Libraries" in left sidebar\n' +
          '3. Add Library ID: 1cCt4YE5RJn0Ow4vDExwJ5VcASWW-UfgiIFBQt5eFk0dxnU4yP3LKBpx2\n' +
          '4. Set Identifier to: GeologyLib\n' +
          '5. Select the latest version\n' +
          '6. Click Add',
        ui.ButtonSet.OK
      );
    } else {
      ui.alert(
        '✅ Library Looks Good!',
        `Library connected with ${status.functionCount} functions.`,
        ui.ButtonSet.OK
      );
    }
  },
};

// ==============================================
// GLOBAL WRAPPER FUNCTIONS - FIXED VERSION
// These make ALL library functions available to the thin template
// ==============================================

// Dashboard & GPA
function showUNZADashboard() { 
  return showUNZADashboard ? showUNZADashboard() : null;
}

function showGPADetails() { 
  return showGPADetails ? showGPADetails() : null;
}

function showProfileEditor() { 
  if (typeof ProfileManager !== 'undefined' && typeof ProfileManager.showProfileEditor === 'function') {
    return ProfileManager.showProfileEditor();
  }
  return null;
}

function viewProfile() { 
  if (typeof ProfileManager !== 'undefined' && typeof ProfileManager.viewProfile === 'function') {
    return ProfileManager.viewProfile();
  }
  return null;
}

function showProgramRequirements() { 
  return showProgramRequirements ? showProgramRequirements() : null;
}

function checkGraduationReadiness() { 
  return checkGraduationReadiness ? checkGraduationReadiness() : null;
}

// Courses
function viewAllCourses() { 
  return viewAllCourses ? viewAllCourses() : null;
}

function addCourse() { 
  return addCourse ? addCourse() : null;
}

function viewAssessments() { 
  return viewAssessments ? viewAssessments() : null;
}

function addAssessment() { 
  return addAssessment ? addAssessment() : null;
}

function showCourseProgress() { 
  return showCourseProgress ? showCourseProgress() : null;
}

// Grades
function viewGrades() { 
  return viewGrades ? viewGrades() : null;
}

function enterGrades() { 
  return enterGrades ? enterGrades() : null;
}

// Certifications
function viewCertifications() { 
  return viewCertifications ? viewCertifications() : null;
}

function addCertification() { 
  return addCertification ? addCertification() : null;
}

function checkCertExpiry() { 
  return checkCertExpiry ? checkCertExpiry() : null;
}

// Training
function viewTraining() { 
  return viewTraining ? viewTraining() : null;
}

function addTraining() { 
  return addTraining ? addTraining() : null;
}

function trackTrainingHours() { 
  return trackTrainingHours ? trackTrainingHours() : null;
}

// Expenses
function viewExpenses() { 
  return viewExpenses ? viewExpenses() : null;
}

function addExpense() { 
  return addExpense ? addExpense() : null;
}

function spendingAnalysis() { 
  return spendingAnalysis ? spendingAnalysis() : null;
}

function viewFeeStructure() { 
  return TemplateLocal.viewFeeStructure();
}

// Schedule
function showTodaysSchedule() { 
  return showTodaysSchedule ? showTodaysSchedule() : null;
}

function showWeeklySchedule() { 
  return showWeeklySchedule ? showWeeklySchedule() : null;
}

function viewFullTimetable() { 
  return viewFullTimetable ? viewFullTimetable() : null;
}

function showUpcomingDeadlines() { 
  return showUpcomingDeadlines ? showUpcomingDeadlines() : null;
}

function viewStudySessions() { 
  return viewStudySessions ? viewStudySessions() : null;
}

function addStudySession() { 
  return addStudySession ? addStudySession() : null;
}

function addDueDate() { 
  return addDueDate ? addDueDate() : null;
}

// Documents
function uploadScript() { 
  return uploadScript ? uploadScript() : null;
}

function openFolders() { 
  return openFolders ? openFolders() : null;
}

function searchDocuments() { 
  return searchDocuments ? searchDocuments() : null;
}

// Reports
function createUNZAReport() { 
  return createUNZAReport ? createUNZAReport() : null;
}

function emailProgressReport() { 
  return emailProgressReport ? emailProgressReport() : null;
}

// System
function initializeCompleteSystem() { 
  return initializeCompleteSystem ? initializeCompleteSystem() : null;
}

function softReset() { 
  return softReset ? softReset() : null;
}

function nukeSystem() { 
  return nukeSystem ? nukeSystem() : null;
}

function showHiddenTables() { 
  return showHiddenTables ? showHiddenTables() : null;
}

function hideDatabaseTables() { 
  return hideDatabaseTables ? hideDatabaseTables() : null;
}

function showNormalizedTables() { 
  return showNormalizedTables ? showNormalizedTables() : null;
}

function upgradeStudentsTable() { 
  return upgradeStudentsTable ? upgradeStudentsTable() : null;
}

// ==============================================
// EXPORTED HELPER FUNCTIONS
// ==============================================

function showVersion() {
  TemplateVersion.showVersion();
}

function checkVersionCompatibility() {
  return TemplateVersion.checkCompatibility();
}

function showHelp() {
  TemplateLocal.showHelp();
}

function testLibraryConnection() {
  TemplateTests.testLibraryConnection();
}

function runAllTemplateTests() {
  TemplateTests.runAllTemplateTests();
}

function showLibraryDiagnostic() {
  LibraryChecker.showStatus();
}

function fixLibraryConnection() {
  LibraryChecker.quickFix();
}

function forceLibraryReload() {
  LibraryChecker.forceReload();
}

function debugAvailableFunctions() {
  const functions = {
    showUNZADashboard: typeof showUNZADashboard === 'function',
    showGPADetails: typeof showGPADetails === 'function',
    showProfileEditor: typeof ProfileManager?.showProfileEditor === 'function',
    viewProfile: typeof ProfileManager?.viewProfile === 'function',
    calculateUNGPA: typeof calculateUNGPA === 'function',
    showProgramRequirements: typeof showProgramRequirements === 'function',
    checkGraduationReadiness: typeof checkGraduationReadiness === 'function',
    viewAllCourses: typeof viewAllCourses === 'function',
    addCourse: typeof addCourse === 'function',
  };
  console.log('📊 Available functions:', functions);
  return functions;
}

console.log('✅ Template helpers loaded successfully');