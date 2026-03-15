// 01_Config.gs

// ==============================================
// UNZA GEOLOGY TRACKER - CONFIGURATION
// School of Mines, University of Zambia
// ==============================================

// ==============================================
// VERSION CONTROL - COMPLETE HISTORY v0.9.0 to v0.14.0
// ==============================================

const APP_VERSION = '0.14.1';
const VERSION_HISTORY = {
  // Initial versions
  '0.9.0': 'Initial complete system with 14 sheets',
  '0.9.1': 'Added timetable and schedule features',
  '0.9.2': 'Fixed GPA calculation for Year 1-2',
  '0.9.3': 'Added document upload to Drive',
  '0.9.4': 'Implemented CA 50% eligibility tracking',
  '0.9.5': 'Added NUKE and System Reset functions',

  // Major architecture rewrite
  '0.10.0':
    'COMPLETE ARCHITECTURE REWRITE: Normalized database with 10 hidden sheets, relational data structure, menu-only UI, ready for web deployment',

  // UI/UX enhancements
  '0.11.0':
    'ENHANCED UI/UX: Complete CRUD operations with beautiful modals, toast notifications, color-coded status badges, and intuitive menu organization',

  // System completion
  '0.12.0':
    'COMPLETE SYSTEM: All menu functions implemented, demo data centralized in initialization',

  // Program requirements
  '0.13.0':
    'Program Requirements dashboard with detailed category tracking; FIXED: Spending Analysis date handling; UPDATED: Help menu with current version',

  // 🏗️ TEMPLATE/LIBRARY ARCHITECTURE SPLIT
  '0.13.1':
    'ARCHITECTURE SPLIT: Separated code into Template (user-facing) and Library (core logic) architecture',
  '0.13.2':
    'TEMPLATE ENHANCEMENTS: Added modular template structure with 8 files, safe calling pattern, and connection testing',
  '0.13.3':
    'LIBRARY OPTIMIZATION: Reorganized library into 23 modular files with comprehensive test suite',
  '0.13.4':
    'WRAPPER SYSTEM: Implemented safe wrapper functions in template with error handling and fallbacks',
  '0.13.5': 'DEPENDENCY MANAGEMENT: Added TEMPLATE_READY flags and proper loading order validation',
  '0.13.6': 'CONNECTION TESTING: Added library connection tests and status reporting in template',
  '0.13.7': 'DOCUMENTATION: Updated all documentation to reflect template/library architecture',
  '0.13.8': 'PERFORMANCE: Optimized library loading and reduced duplicate code across both systems',
  '0.13.9':
    'ERROR HANDLING: Enhanced error messages and user feedback for missing library connections',

  // 👤 PROFILE MANAGEMENT SYSTEM
  '0.14.0':
    'PROFILE MANAGEMENT SYSTEM: Added student profiles with 11 fields, profile editor & viewer, enhanced dashboard with personal info, comprehensive testing suite with 16 test modules, template-library architecture with safe calling',

  // 🐛 DASHBOARD FIXES
  '0.14.1':
    'FIXED: Dashboard error with getCourseCount function; Ensured all helper functions are properly exported; Improved dashboard stability and error handling',

  // 🏛️ THIN TEMPLATE ARCHITECTURE
  '0.15.0':
    'THIN TEMPLATE MIGRATION: Moved all template-side logic (VersionSync, Constants, Utils, LocalFunctions, Tests, LibraryChecker) into library as 26_TemplateHelpers.js; Template now reduced to single ultra-thin file; Updates now propagate automatically to all users; Professional enterprise architecture achieved'
};


function getVersionInfo() {
  return `UNZA Geology Tracker v${APP_VERSION}`;
}

function showVersion() {
  const ui = SpreadsheetApp.getUi();
  let message = `📍 UNZA Geology Tracker v${APP_VERSION}\n\n`;

  if (VERSION_HISTORY && VERSION_HISTORY[APP_VERSION]) {
    message += `📌 Current: ${VERSION_HISTORY[APP_VERSION]}`;
  }

  // Show architecture info
  message += `\n\n🏗️ Architecture: Template/Library Split (v0.13.1+)`;

  // Add profile system info if available
  if (typeof ProfileManager !== 'undefined') {
    try {
      const profile = ProfileManager.getProfileSummary();
      message += `\n\n👤 ${profile.shortDisplay}`;
    } catch (e) {
      // Profile not set up yet
    }
  }

  ui.alert(message);
}

function viewChangelog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_Changelog');

  if (sheet) {
    sheet.activate();
    SpreadsheetApp.getUi().alert('📋 Changelog sheet opened (v' + APP_VERSION + ')');
  } else {
    SpreadsheetApp.getUi().alert('Changelog sheet not found. Run "Update Changelog Sheet" first.');
  }
}

function viewFullChangelog() {
  // Show condensed version history
  const ui = SpreadsheetApp.getUi();
  let message = '📋 UNZA GEOLOGY TRACKER - VERSION HISTORY\n\n';

  // Group versions by major features
  const groups = {
    'Initial (v0.9.0-0.9.5)': ['0.9.0', '0.9.1', '0.9.2', '0.9.3', '0.9.4', '0.9.5'],
    'Architecture Rewrite (v0.10.0)': ['0.10.0'],
    'UI/UX Enhancement (v0.11.0)': ['0.11.0'],
    'System Completion (v0.12.0)': ['0.12.0'],
    'Program Requirements (v0.13.0)': ['0.13.0'],
    '🏗️ TEMPLATE/LIBRARY SPLIT (v0.13.1-0.13.9)': [
      '0.13.1',
      '0.13.2',
      '0.13.3',
      '0.13.4',
      '0.13.5',
      '0.13.6',
      '0.13.7',
      '0.13.8',
      '0.13.9',
    ],
    '👤 PROFILE SYSTEM (v0.14.0)': ['0.14.0'],
  };

  for (let [group, versions] of Object.entries(groups)) {
    message += `\n${group}:\n`;
    versions.forEach((v) => {
      if (VERSION_HISTORY[v]) {
        message += `  • v${v}: ${VERSION_HISTORY[v]}\n`;
      }
    });
  }

  ui.alert(message);
}

function addChangelogEntryPrompt() {
  const html = HtmlService.createHtmlOutput(
    `
    <html>
      <body style="font-family: Arial; padding: 20px;">
        <h3>📝 Add Changelog Entry</h3>
        <div style="margin: 10px 0;">
          <label>Version:</label>
          <input type="text" id="version" value="${APP_VERSION}" style="width: 100%; padding: 5px;">
        </div>
        <div style="margin: 10px 0;">
          <label>Changes:</label>
          <textarea id="changes" rows="4" style="width: 100%; padding: 5px;" placeholder="Describe the changes..."></textarea>
        </div>
        <div style="margin: 10px 0;">
          <label>Feedback From:</label>
          <input type="text" id="feedback" value="Miselo" style="width: 100%; padding: 5px;">
        </div>
        <div style="margin: 10px 0;">
          <label>Category:</label>
          <select id="category" style="width: 100%; padding: 5px;">
            <option value="feature">✨ New Feature</option>
            <option value="enhancement">🚀 Enhancement</option>
            <option value="fix">🐛 Bug Fix</option>
            <option value="architecture">🏗️ Architecture</option>
            <option value="documentation">📚 Documentation</option>
          </select>
        </div>
        <button onclick="save()" style="background: #1a73e8; color: white; padding: 10px; border: none; border-radius: 5px; width: 100%; margin-top: 10px;">Add Entry</button>
        
        <script>
          function save() {
            const data = {
              version: document.getElementById('version').value,
              changes: document.getElementById('changes').value,
              feedback: document.getElementById('feedback').value,
              category: document.getElementById('category').value
            };
            
            if (!data.changes) {
              alert('Please describe the changes');
              return;
            }
            
            google.script.run
              .withSuccessHandler(() => {
                alert('✅ Entry added!');
                google.script.host.close();
              })
              .addChangelogEntry(data.version, data.changes, data.feedback, data.category);
          }
        </script>
      </body>
    </html>
  `
  )
    .setWidth(450)
    .setWidth(500);

  SpreadsheetApp.getUi().showModalDialog(html, 'Add Changelog Entry');
}

// Enhanced changelog entry with category
function addChangelogEntry(version, changes, feedbackFrom = 'Miselo', category = 'enhancement') {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('_Changelog');

  if (!sheet) {
    setupChangelogSheet();
    sheet = ss.getSheetByName('_Changelog');
  }

  // Add category emoji
  const categoryEmoji =
    {
      feature: '✨',
      enhancement: '🚀',
      fix: '🐛',
      architecture: '🏗️',
      documentation: '📚',
    }[category] || '📌';

  sheet.appendRow([version, new Date(), `${categoryEmoji} ${changes}`, feedbackFrom, 'Live']);

  sheet.autoResizeColumns(1, 5);
  SpreadsheetApp.getUi().alert(`✅ Added entry for v${version}`);
}

// Setup enhanced changelog sheet
function setupChangelogSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('_Changelog');

  if (!sheet) {
    sheet = ss.insertSheet('_Changelog');
  } else {
    sheet.clear();
  }

  const headers = [['Version', 'Date', 'Changes', 'Feedback From', 'Status']];
  sheet.getRange(1, 1, 1, 5).setValues(headers);
  sheet.getRange('A1:E1').setFontWeight('bold').setBackground('#e6f2ff');

  // Add all historical versions in order
  const versions = Object.keys(VERSION_HISTORY).sort(versionCompare);

  versions.forEach((ver) => {
    let category = 'enhancement';
    if (parseFloat(ver) >= 0.14) category = 'feature';
    else if (parseFloat(ver) >= 0.13 && parseFloat(ver) < 0.14) category = 'architecture';
    else if (parseFloat(ver) >= 0.11) category = 'enhancement';

    const categoryEmoji =
      {
        feature: '✨',
        enhancement: '🚀',
        fix: '🐛',
        architecture: '🏗️',
        documentation: '📚',
      }[category] || '📌';

    sheet.appendRow([
      ver,
      '—',
      `${categoryEmoji} ${VERSION_HISTORY[ver]}`,
      ver === APP_VERSION ? 'Current' : '—',
      ver === APP_VERSION ? 'Current' : 'Historical',
    ]);
  });

  sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).setBorder(true, true, true, true, true, true);
  sheet.autoResizeColumns(1, 5);
}

// Helper to sort versions correctly
function versionCompare(a, b) {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aVal = aParts[i] || 0;
    const bVal = bParts[i] || 0;
    if (aVal !== bVal) return aVal - bVal;
  }
  return 0;
}

// ==============================================
// MAIN CONFIGURATION
// ==============================================

const CONFIG = {
  student: {
    name: 'Demo Student',
    id: '2020XXXXXX',
    program: 'B.Sc. Geology',
    university: 'University of Zambia',
    school: 'School of Mines',
    entryYear: 2024,
    graduationYear: 2029,
  },
  program: {
    name: 'Bachelor of Science in Geology',
    totalCredits: 160,
    duration: '5 Years',
    categories: {
      mathScience: { name: 'Math/Science', required: 30 },
      engineeringCore: { name: 'Engineering Core', required: 50 },
      miningCore: { name: 'Mining Core', required: 70 },
      generalEd: { name: 'General Education', required: 15 },
    },
  },
  tables: {
    students: '_students',
    courses: '_courses',
    assessments: '_assessments',
    grades: '_grades',
    certifications: '_certifications',
    training: '_industrial_training',
    expenses: '_expenses',
    timetable: '_timetable',
    studySessions: '_study_sessions',
    dueDates: '_due_dates',
  },
  folders: {
    root: 'UNZA Geology Tracker',
    scripts: '1. Scripts & Exams',
    assignments: '2. Assignments',
    projects: '3. Projects',
    notes: '4. Lecture Notes',
    reports: '5. Progress Reports',
    resources: '6. Study Resources',
  },
  gradePoints: {
    A: 5.0,
    'A-': 4.5,
    'B+': 4.0,
    B: 3.5,
    'B-': 3.0,
    'C+': 2.5,
    C: 2.0,
    'C-': 1.5,
    D: 1.0,
    F: 0.0,
  },
};
