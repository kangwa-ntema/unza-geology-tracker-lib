// 25_Profile.gs

// ==============================================
// PROFILE MANAGEMENT MODULE
// Manages student personal details
// ==============================================

const ProfileManager = {
  /**
   * Get current student profile
   */
  getProfile: function () {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('_students');

    if (!sheet || sheet.getLastRow() < 2) {
      // Return default profile if none exists
      return this.getDefaultProfile();
    }

    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    const student = data[0] || []; // First student only for now

    // Build profile object dynamically from headers
    let profile = {
      student_id: student[0] || 1,
      createdAt: student[6] || new Date(),
    };

    // Map headers to profile fields
    const headerMap = {
      name: 1,
      program: 2,
      entry_year: 3,
      grad_year: 4,
      student_number: 5,
      email: 7,
      phone: 8,
      supervisor: 9,
      notes: 10,
    };

    for (let [field, index] of Object.entries(headerMap)) {
      if (headers.includes(field) && student[index]) {
        profile[field] = student[index];
      }
    }

    // Ensure all fields have defaults
    return {
      student_id: profile.student_id || 1,
      name: profile.name || CONFIG.student.name,
      program: profile.program || CONFIG.student.program,
      entryYear: profile.entry_year || CONFIG.student.entryYear,
      gradYear: profile.grad_year || CONFIG.student.graduationYear,
      studentNumber: profile.student_number || CONFIG.student.id,
      email: profile.email || '',
      phone: profile.phone || '',
      supervisor: profile.supervisor || '',
      notes: profile.notes || '',
      createdAt: profile.createdAt || new Date(),
    };
  },

  /**
   * Get default profile from CONFIG
   */
  getDefaultProfile: function () {
    return {
      student_id: 1,
      name: CONFIG.student.name,
      program: CONFIG.student.program,
      entryYear: CONFIG.student.entryYear,
      gradYear: CONFIG.student.graduationYear,
      studentNumber: CONFIG.student.id,
      email: '',
      phone: '',
      supervisor: '',
      notes: '',
    };
  },

  /**
   * Update student profile
   */
  updateProfile: function (profileData) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('_students');

    if (!sheet) {
      throw new Error('Students sheet not found. Run Initialize first.');
    }

    // Ensure table has all columns
    this.ensureTableStructure(sheet);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Check if profile exists
    if (sheet.getLastRow() < 2) {
      // Create new profile row with all columns
      const newRow = new Array(headers.length).fill('');
      const fieldMap = {
        student_id: 0,
        name: 1,
        program: 2,
        entry_year: 3,
        grad_year: 4,
        student_number: 5,
        created_at: 6,
        email: 7,
        phone: 8,
        supervisor: 9,
        notes: 10,
      };

      // Map values to correct columns
      for (let [field, value] of Object.entries(profileData)) {
        const headerField = this.camelToSnake(field);
        const colIndex = headers.indexOf(headerField);
        if (colIndex >= 0 && value !== undefined) {
          newRow[colIndex] = value;
        }
      }

      // Set student_id and created_at
      newRow[0] = 1; // student_id
      newRow[6] = new Date(); // created_at

      sheet.appendRow(newRow);
    } else {
      // Update existing profile
      for (let [field, value] of Object.entries(profileData)) {
        const headerField = this.camelToSnake(field);
        const colIndex = headers.indexOf(headerField);
        if (colIndex >= 0 && value !== undefined) {
          sheet.getRange(2, colIndex + 1).setValue(value);
        }
      }
    }

    // Update CONFIG for backward compatibility
    if (profileData.name) CONFIG.student.name = profileData.name;
    if (profileData.program) CONFIG.student.program = profileData.program;
    if (profileData.entryYear) CONFIG.student.entryYear = profileData.entryYear;
    if (profileData.gradYear) CONFIG.student.graduationYear = profileData.gradYear;
    if (profileData.studentNumber) CONFIG.student.id = profileData.studentNumber;

    showToast('Profile updated successfully', 'Success');
    return true;
  },

  /**
   * Ensure table has all required columns
   */
  ensureTableStructure: function (sheet) {
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

    const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Add missing headers
    if (currentHeaders.length < requiredHeaders.length) {
      for (let i = currentHeaders.length; i < requiredHeaders.length; i++) {
        sheet.getRange(1, i + 1).setValue(requiredHeaders[i]);
      }
      sheet.getRange(1, 1, 1, requiredHeaders.length).setFontWeight('bold');
    }
  },

  /**
   * Convert camelCase to snake_case
   */
  camelToSnake: function (str) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  },

  /**
   * Show profile editor modal
   */
  showProfileEditor: function () {
    const profile = this.getProfile();

    const currentYear = new Date().getFullYear();
    let yearOptions = '';
    for (let y = currentYear - 5; y <= currentYear + 5; y++) {
      yearOptions += `<option value="${y}" ${profile.entryYear == y ? 'selected' : ''}>${y}</option>`;
    }

    let gradYearOptions = '';
    for (let y = currentYear; y <= currentYear + 7; y++) {
      gradYearOptions += `<option value="${y}" ${profile.gradYear == y ? 'selected' : ''}>${y}</option>`;
    }

    const programOptions = [
      'B.Sc. Geology',
      'B.Sc. Mining Engineering',
      'B.Sc. Metallurgy',
      'B.Sc. Geophysics',
      'B.Eng. Mining',
      'Other',
    ];

    let programSelect = '';
    programOptions.forEach((p) => {
      const selected =
        p === profile.program ||
        (p === 'Other' && !programOptions.slice(0, -1).includes(profile.program))
          ? 'selected'
          : '';
      programSelect += `<option value="${p}" ${selected}>${p}</option>`;
    });

    const showOther = !programOptions.slice(0, -1).includes(profile.program);

    const content = getBaseHTML(`
      <div class="header">
        <h2>👤 Student Profile</h2>
        <p>Manage your personal details</p>
      </div>
      
      <form id="profileForm">
        <div class="form-group">
          <label>Full Name *</label>
          <input type="text" class="form-control" id="name" value="${this.escapeHtml(profile.name)}" required>
        </div>
        
        <div class="form-group">
          <label>Student Number *</label>
          <input type="text" class="form-control" id="studentNumber" value="${this.escapeHtml(profile.studentNumber)}" placeholder="e.g., 2020XXXXXX" required>
        </div>
        
        <div class="form-group">
          <label>Program *</label>
          <select class="form-control" id="program" required>
            ${programSelect}
          </select>
        </div>
        
        <div class="form-group" id="otherProgramGroup" style="display: ${showOther ? 'block' : 'none'}">
          <label>Specify Program</label>
          <input type="text" class="form-control" id="otherProgram" value="${showOther ? this.escapeHtml(profile.program) : ''}" placeholder="Enter your program">
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label>Entry Year</label>
            <select class="form-control" id="entryYear">
              ${yearOptions}
            </select>
          </div>
          
          <div class="form-group">
            <label>Expected Graduation</label>
            <select class="form-control" id="gradYear">
              ${gradYearOptions}
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" class="form-control" id="email" value="${this.escapeHtml(profile.email || '')}" placeholder="e.g., student@unza.zm">
        </div>
        
        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" class="form-control" id="phone" value="${this.escapeHtml(profile.phone || '')}" placeholder="e.g., +260 97XXXXXXX">
        </div>
        
        <div class="form-group">
          <label>Academic Supervisor</label>
          <input type="text" class="form-control" id="supervisor" value="${this.escapeHtml(profile.supervisor || '')}" placeholder="e.g., Dr. Banda">
        </div>
        
        <div class="form-group">
          <label>Additional Notes</label>
          <textarea class="form-control" id="notes" rows="2">${this.escapeHtml(profile.notes || '')}</textarea>
        </div>
        
        <div class="btn-group">
          <button type="button" class="btn btn-primary" onclick="saveProfile()">💾 Save Profile</button>
          <button type="button" class="btn btn-secondary" onclick="viewProfile()">👁️ View Profile</button>
          <button type="button" class="btn btn-secondary" onclick="google.script.host.close()">Close</button>
        </div>
      </form>
      
      <script>
        document.getElementById('program').addEventListener('change', function() {
          const otherGroup = document.getElementById('otherProgramGroup');
          otherGroup.style.display = this.value === 'Other' ? 'block' : 'none';
        });
        
        function saveProfile() {
          const program = document.getElementById('program').value;
          const finalProgram = program === 'Other' ? 
            document.getElementById('otherProgram').value : program;
          
          if (!finalProgram) {
            alert('Please specify your program');
            return;
          }
          
          const data = {
            name: document.getElementById('name').value,
            studentNumber: document.getElementById('studentNumber').value,
            program: finalProgram,
            entryYear: parseInt(document.getElementById('entryYear').value),
            gradYear: parseInt(document.getElementById('gradYear').value),
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            supervisor: document.getElementById('supervisor').value,
            notes: document.getElementById('notes').value
          };
          
          if (!data.name || !data.studentNumber) {
            alert('Please fill all required fields');
            return;
          }
          
          google.script.run
            .withSuccessHandler(() => {
              alert('✅ Profile saved successfully!');
              google.script.host.close();
            })
            .updateProfile(data);
        }
        
        function viewProfile() {
          google.script.run
            .withSuccessHandler(() => google.script.host.close())
            .viewProfile();
        }
      </script>
    `);

    showModal('👤 Student Profile', content, 550, 750);
  },

  /**
   * Escape HTML special characters
   */
  escapeHtml: function (text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * View profile summary
   */
  viewProfile: function () {
    const profile = this.getProfile();

    // Calculate progress
    const currentYear = new Date().getFullYear();
    const yearOfStudy = Math.min(5, Math.max(1, currentYear - profile.entryYear + 1));
    const progressPercent = Math.min(100, Math.round((yearOfStudy / 5) * 100));

    // Calculate years remaining
    const yearsRemaining = Math.max(0, profile.gradYear - currentYear);

    const content = getBaseHTML(`
      <div class="header">
        <h2>👤 Student Profile</h2>
        <p>Your personal information</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 60px; height: 60px; background: #1a73e8; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold; margin-right: 15px;">
            ${profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <h3 style="margin: 0; color: #1a73e8; font-size: 22px;">${this.escapeHtml(profile.name)}</h3>
            <p style="margin: 5px 0 0; color: #5f6368; font-size: 16px;">${this.escapeHtml(profile.studentNumber)}</p>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; background: white; padding: 15px; border-radius: 8px;">
          <div><strong>🎓 Program:</strong><br>${this.escapeHtml(profile.program)}</div>
          <div><strong>📅 Year of Study:</strong><br>Year ${yearOfStudy} (${yearsRemaining} years remaining)</div>
          <div><strong>📆 Entry Year:</strong><br>${profile.entryYear}</div>
          <div><strong>🎯 Graduation Year:</strong><br>${profile.gradYear}</div>
          ${profile.email ? `<div><strong>📧 Email:</strong><br>${this.escapeHtml(profile.email)}</div>` : ''}
          ${profile.phone ? `<div><strong>📱 Phone:</strong><br>${this.escapeHtml(profile.phone)}</div>` : ''}
          ${profile.supervisor ? `<div><strong>👨‍🏫 Supervisor:</strong><br>${this.escapeHtml(profile.supervisor)}</div>` : ''}
        </div>
        
        ${
          profile.notes
            ? `
        <div style="margin-top: 15px; background: white; padding: 15px; border-radius: 8px;">
          <strong>📝 Notes:</strong><br>
          <p style="margin: 10px 0 0; color: #5f6368;">${this.escapeHtml(profile.notes)}</p>
        </div>
        `
            : ''
        }
        
        <div style="margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span><strong>Program Progress</strong></span>
            <span><strong>${progressPercent}%</strong></span>
          </div>
          <div style="background: #e8f0fe; height: 10px; border-radius: 5px; overflow: hidden;">
            <div style="background: #1a73e8; width: ${progressPercent}%; height: 10px; border-radius: 5px;"></div>
          </div>
          <p style="margin: 10px 0 0; color: #5f6368; font-size: 13px;">Year ${yearOfStudy} of 5</p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dadce0; display: flex; gap: 10px; justify-content: center;">
          <span class="badge" style="background: #e8f0fe; color: #1a73e8;">🎓 UNZA School of Mines</span>
          <span class="badge" style="background: #e8f0fe; color: #1a73e8;">⛏️ Geology</span>
        </div>
      </div>
      
      <div class="btn-group">
        <button class="btn btn-primary" onclick="editProfile()">✏️ Edit Profile</button>
        <button class="btn btn-secondary" onclick="google.script.host.close()">Close</button>
      </div>
      
      <script>
        function editProfile() {
          google.script.run
            .withSuccessHandler(() => google.script.host.close())
            .showProfileEditor();
        }
      </script>
    `);

    showModal('👤 Student Profile', content, 550, 650);
  },

  /**
   * Get profile summary for dashboard
   */
  getProfileSummary: function () {
    const profile = this.getProfile();
    const currentYear = new Date().getFullYear();
    const yearOfStudy = Math.min(5, Math.max(1, currentYear - profile.entryYear + 1));
    const yearsRemaining = Math.max(0, profile.gradYear - currentYear);

    return {
      name: profile.name,
      studentNumber: profile.studentNumber,
      program: profile.program,
      yearOfStudy: yearOfStudy,
      entryYear: profile.entryYear,
      gradYear: profile.gradYear,
      yearsRemaining: yearsRemaining,
      progress: Math.min(100, Math.round((yearOfStudy / 5) * 100)),
      display: `${profile.name} | Year ${yearOfStudy} | ${profile.studentNumber}`,
      shortDisplay: `${profile.name} (Yr ${yearOfStudy})`,
    };
  },

  /**
   * Update dashboard to include profile info
   */
  enhanceDashboard: function () {
    const summary = this.getProfileSummary();

    // This will be called from dashboard
    return {
      profile: summary,
      message: `Welcome back, ${summary.name}! You're in Year ${summary.yearOfStudy}.`,
    };
  },
};

// ==============================================
// Profile Global Functions
// ==============================================

function showProfileEditor() {
  ProfileManager.showProfileEditor();
}

function viewProfile() {
  ProfileManager.viewProfile();
}

function updateProfile(profileData) {
  return ProfileManager.updateProfile(profileData);
}

function getProfileSummary() {
  return ProfileManager.getProfileSummary();
}

function testProfileSystem() {
  const results = {
    passed: 0,
    failed: 0,
    total: 0,
    details: [],
  };

  // Test getProfile
  results.total++;
  try {
    const profile = ProfileManager.getProfile();
    if (profile && profile.name) {
      results.passed++;
      results.details.push(`✅ PROFILE: Got profile for ${profile.name}`);
    } else {
      throw new Error('Profile not found');
    }
  } catch (e) {
    results.failed++;
    results.details.push(`❌ PROFILE: getProfile - ${e.message}`);
  }

  // Test getProfileSummary
  results.total++;
  try {
    const summary = ProfileManager.getProfileSummary();
    if (summary && summary.display) {
      results.passed++;
      results.details.push(`✅ PROFILE: Summary - ${summary.display}`);
    } else {
      throw new Error('Summary not generated');
    }
  } catch (e) {
    results.failed++;
    results.details.push(`❌ PROFILE: getProfileSummary - ${e.message}`);
  }

  // Test year calculation
  results.total++;
  try {
    const profile = ProfileManager.getProfile();
    const currentYear = new Date().getFullYear();
    const yearOfStudy = Math.min(5, Math.max(1, currentYear - profile.entryYear + 1));

    if (yearOfStudy >= 1 && yearOfStudy <= 5) {
      results.passed++;
      results.details.push(`✅ PROFILE: Year calculation - Year ${yearOfStudy}`);
    } else {
      throw new Error(`Invalid year: ${yearOfStudy}`);
    }
  } catch (e) {
    results.failed++;
    results.details.push(`❌ PROFILE: year calc - ${e.message}`);
  }

  // Show results
  const ui = SpreadsheetApp.getUi();
  const percentage = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0;

  let message = '📋 PROFILE SYSTEM TEST RESULTS\n\n';
  message += `✅ Passed: ${results.passed}\n`;
  message += `❌ Failed: ${results.failed}\n`;
  message += `📊 Total: ${results.total}\n`;
  message += `📈 Score: ${percentage}%\n\n`;
  message += results.details.join('\n');

  ui.alert(message);
}
