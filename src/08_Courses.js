// 08_Courses.gs

// ==============================================
// COURSE TRACKING MODULE - COMPLETE
// ==============================================

function viewAllCourses() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_courses');

  if (!sheet || sheet.getLastRow() < 2) {
    showAlert('No courses found. Add your first course!', 'info');
    return;
  }

  const courses = sheet.getDataRange().getValues().slice(1);

  let tableRows = '';
  courses.forEach((course) => {
    const status = course[7] ? 'Active' : 'Inactive';
    const statusClass = course[7] ? 'badge-success' : 'badge-warning';
    tableRows += `
      <tr>
        <td>${course[1]}</td>
        <td>${course[2]}</td>
        <td>${course[3]}</td>
        <td>Year ${course[4]}</td>
        <td>${course[6]}</td>
        <td><span class="badge ${statusClass}">${status}</span></td>
        <td>
          <button onclick="editCourse(${course[0]})" style="background:none; border:none; color:#1a73e8; cursor:pointer;">✏️</button>
          <button onclick="deleteCourse(${course[0]}, '${course[1]}')" style="background:none; border:none; color:#d93025; cursor:pointer;">🗑️</button>
        </td>
      </tr>
    `;
  });

  const content = getBaseHTML(`
    <div class="header">
      <h2>📚 My Courses</h2>
      <p>Manage all your geology courses</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <button class="btn btn-primary" onclick="addCourse()">➕ Add New Course</button>
    </div>
    
    <table class="table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Credits</th>
          <th>Year</th>
          <th>Category</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    
    <script>
      function addCourse() {
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .showAddCourseModal();
      }
      
      function editCourse(id) {
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .showEditCourseModal(id);
      }
      
      function deleteCourse(id, code) {
        if (confirm('Delete course ' + code + '? This will also delete all related assessments and grades.')) {
          google.script.run
            .withSuccessHandler(() => {
              alert('Course deleted');
              google.script.host.close();
            })
            .deleteCourse(id);
        }
      }
    </script>
  `);

  showModal('📚 My Courses', content, 900, 600);
}

function showAddCourseModal() {
  const content = getBaseHTML(`
    <div class="header">
      <h2>➕ Add New Course</h2>
      <p>Enter the details of your new course</p>
    </div>
    
    <form id="courseForm">
      <div class="form-group">
        <label>Course Code *</label>
        <input type="text" class="form-control" id="code" placeholder="e.g., MAT1100" required>
      </div>
      
      <div class="form-group">
        <label>Course Name *</label>
        <input type="text" class="form-control" id="name" placeholder="e.g., Foundational Mathematics" required>
      </div>
      
      <div class="form-group">
        <label>Credits *</label>
        <input type="number" class="form-control" id="credits" min="1" max="6" value="3" required>
      </div>
      
      <div class="form-group">
        <label>Year Level</label>
        <select class="form-control" id="year">
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
          <option value="5">Year 5</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Category</label>
        <select class="form-control" id="category">
          <option value="Math/Science">Math/Science</option>
          <option value="Mining Core">Mining Core</option>
          <option value="General Ed">General Education</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Semester</label>
        <select class="form-control" id="semester">
          <option value="All Year">All Year</option>
          <option value="Semester 1">Semester 1</option>
          <option value="Semester 2">Semester 2</option>
        </select>
      </div>
      
      <div class="btn-group">
        <button type="button" class="btn btn-primary" onclick="saveCourse()">Save Course</button>
        <button type="button" class="btn btn-secondary" onclick="google.script.host.close()">Cancel</button>
      </div>
    </form>
    
    <script>
      function saveCourse() {
        const data = {
          code: document.getElementById('code').value,
          name: document.getElementById('name').value,
          credits: parseInt(document.getElementById('credits').value),
          year: parseInt(document.getElementById('year').value),
          category: document.getElementById('category').value,
          semester: document.getElementById('semester').value
        };
        
        if (!data.code || !data.name) {
          alert('Please fill all required fields');
          return;
        }
        
        google.script.run
          .withSuccessHandler(() => {
            alert('✅ Course added successfully!');
            google.script.host.close();
          })
          .saveCourse(data);
      }
    </script>
  `);

  showModal('➕ Add Course', content, 500, 600);
}

function saveCourse(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_courses');

  if (!sheet) {
    showAlert('Database not initialized. Run Setup first.', 'error');
    return;
  }

  const lastRow = sheet.getLastRow();
  const newId = lastRow;

  sheet.appendRow([
    newId,
    data.code,
    data.name,
    data.credits,
    data.year,
    data.semester,
    data.category,
    true,
  ]);

  showToast(`Course ${data.code} added successfully`, 'Success');
}

function showEditCourseModal(courseId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_courses');
  const data = sheet.getDataRange().getValues();

  let course = null;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === courseId) {
      course = {
        id: data[i][0],
        code: data[i][1],
        name: data[i][2],
        credits: data[i][3],
        year: data[i][4],
        semester: data[i][5],
        category: data[i][6],
        active: data[i][7],
      };
      break;
    }
  }

  if (!course) {
    showAlert('Course not found', 'error');
    return;
  }

  const content = getBaseHTML(`
    <div class="header">
      <h2>✏️ Edit Course</h2>
      <p>Update course information</p>
    </div>
    
    <form id="courseForm">
      <div class="form-group">
        <label>Course Code *</label>
        <input type="text" class="form-control" id="code" value="${course.code}" required>
      </div>
      
      <div class="form-group">
        <label>Course Name *</label>
        <input type="text" class="form-control" id="name" value="${course.name}" required>
      </div>
      
      <div class="form-group">
        <label>Credits *</label>
        <input type="number" class="form-control" id="credits" min="1" max="6" value="${course.credits}" required>
      </div>
      
      <div class="form-group">
        <label>Year Level</label>
        <select class="form-control" id="year">
          <option value="1" ${course.year === 1 ? 'selected' : ''}>Year 1</option>
          <option value="2" ${course.year === 2 ? 'selected' : ''}>Year 2</option>
          <option value="3" ${course.year === 3 ? 'selected' : ''}>Year 3</option>
          <option value="4" ${course.year === 4 ? 'selected' : ''}>Year 4</option>
          <option value="5" ${course.year === 5 ? 'selected' : ''}>Year 5</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Category</label>
        <select class="form-control" id="category">
          <option value="Math/Science" ${course.category === 'Math/Science' ? 'selected' : ''}>Math/Science</option>
          <option value="Mining Core" ${course.category === 'Mining Core' ? 'selected' : ''}>Mining Core</option>
          <option value="General Ed" ${course.category === 'General Ed' ? 'selected' : ''}>General Education</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Semester</label>
        <select class="form-control" id="semester">
          <option value="All Year" ${course.semester === 'All Year' ? 'selected' : ''}>All Year</option>
          <option value="Semester 1" ${course.semester === 'Semester 1' ? 'selected' : ''}>Semester 1</option>
          <option value="Semester 2" ${course.semester === 'Semester 2' ? 'selected' : ''}>Semester 2</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Status</label>
        <select class="form-control" id="active">
          <option value="true" ${course.active ? 'selected' : ''}>Active</option>
          <option value="false" ${!course.active ? 'selected' : ''}>Inactive</option>
        </select>
      </div>
      
      <div class="btn-group">
        <button type="button" class="btn btn-primary" onclick="updateCourse()">Update Course</button>
        <button type="button" class="btn btn-secondary" onclick="google.script.host.close()">Cancel</button>
      </div>
    </form>
    
    <script>
      function updateCourse() {
        const data = {
          id: ${course.id},
          code: document.getElementById('code').value,
          name: document.getElementById('name').value,
          credits: parseInt(document.getElementById('credits').value),
          year: parseInt(document.getElementById('year').value),
          category: document.getElementById('category').value,
          semester: document.getElementById('semester').value,
          active: document.getElementById('active').value === 'true'
        };
        
        google.script.run
          .withSuccessHandler(() => {
            alert('✅ Course updated successfully!');
            google.script.host.close();
          })
          .updateCourse(data);
      }
    </script>
  `);

  showModal('✏️ Edit Course', content, 500, 700);
}

function updateCourse(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_courses');

  const courses = sheet.getDataRange().getValues();

  for (let i = 1; i < courses.length; i++) {
    if (courses[i][0] === data.id) {
      sheet.getRange(i + 1, 2).setValue(data.code);
      sheet.getRange(i + 1, 3).setValue(data.name);
      sheet.getRange(i + 1, 4).setValue(data.credits);
      sheet.getRange(i + 1, 5).setValue(data.year);
      sheet.getRange(i + 1, 6).setValue(data.semester);
      sheet.getRange(i + 1, 7).setValue(data.category);
      sheet.getRange(i + 1, 8).setValue(data.active);
      break;
    }
  }

  showToast(`Course ${data.code} updated`, 'Success');
}

function deleteCourse(courseId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const coursesSheet = ss.getSheetByName('_courses');
  const assessmentsSheet = ss.getSheetByName('_assessments');
  const gradesSheet = ss.getSheetByName('_grades');

  const courseData = coursesSheet.getDataRange().getValues();
  let courseCode = '';
  for (let i = 1; i < courseData.length; i++) {
    if (courseData[i][0] === courseId) {
      courseCode = courseData[i][1];
      break;
    }
  }

  const assessments = assessmentsSheet.getDataRange().getValues();
  let assessmentIds = [];

  for (let i = assessments.length - 1; i >= 1; i--) {
    if (assessments[i][1] === courseId) {
      assessmentIds.push(assessments[i][0]);
      assessmentsSheet.deleteRow(i + 1);
    }
  }

  const grades = gradesSheet.getDataRange().getValues();
  for (let i = grades.length - 1; i >= 1; i--) {
    if (assessmentIds.includes(grades[i][2])) {
      gradesSheet.deleteRow(i + 1);
    }
  }

  for (let i = coursesSheet.getLastRow(); i >= 2; i--) {
    if (coursesSheet.getRange(i, 1).getValue() === courseId) {
      coursesSheet.deleteRow(i);
      break;
    }
  }

  showToast(`Course ${courseCode} and all related data deleted`, 'Success');
}

function showCourseProgress() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const courses = getAllCourses();

  if (courses.length === 0) {
    showAlert('No courses found. Add some courses first.', 'info');
    return;
  }

  let eligible = [];
  let atRisk = [];

  courses.forEach((course) => {
    const status = calculateCourseCA(course);
    if (status.eligible && status.assessments.length > 0) {
      eligible.push(`${course}: ${status.caAverage}%`);
    } else if (status.assessments.length > 0) {
      atRisk.push(`${course}: ${status.caAverage}%`);
    }
  });

  let message = '📊 COURSE PROGRESS\n\n';
  message += '✅ ELIGIBLE (CA ≥ 50%):\n';
  message += (eligible.length > 0 ? eligible.slice(0, 10).join('\n') : 'None') + '\n\n';
  message += '⚠️ AT RISK (CA < 50%):\n';
  message += atRisk.length > 0 ? atRisk.slice(0, 10).join('\n') : 'None';

  SpreadsheetApp.getUi().alert(message);
}

function getAllCourses() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_courses');
  if (!sheet) return [];

  const courses = sheet.getDataRange().getValues().slice(1);
  return courses.map((c) => c[1]);
}

function calculateCourseCA(courseCode) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const assessmentsSheet = ss.getSheetByName('_assessments');
  const gradesSheet = ss.getSheetByName('_grades');
  const coursesSheet = ss.getSheetByName('_courses');

  if (!assessmentsSheet || !gradesSheet || !coursesSheet) {
    return { eligible: false, caAverage: 0, assessments: [] };
  }

  // Find course ID from code
  const courses = coursesSheet.getDataRange().getValues().slice(1);
  let courseId = null;
  for (let c of courses) {
    if (c[1] === courseCode) {
      courseId = c[0];
      break;
    }
  }

  if (!courseId) return { eligible: false, caAverage: 0, assessments: [] };

  // Get assessments for this course
  const assessments = assessmentsSheet.getDataRange().getValues().slice(1);
  const courseAssessments = assessments.filter((a) => a[1] === courseId);

  if (courseAssessments.length === 0) {
    return { eligible: false, caAverage: 0, assessments: [] };
  }

  // Get grades
  const grades = gradesSheet.getDataRange().getValues().slice(1);
  let totalWeightedScore = 0;
  let totalWeight = 0;
  let completedAssessments = [];

  for (let ass of courseAssessments) {
    const grade = grades.find((g) => g[2] === ass[0]);
    if (grade && grade[6] === 'Graded') {
      const percentage = grade[4];
      const weight = ass[4];
      totalWeightedScore += (percentage / 100) * weight;
      totalWeight += weight;
      completedAssessments.push({
        name: ass[3],
        percentage: percentage,
        weight: weight,
      });
    }
  }

  const caAverage = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;
  const eligible = caAverage >= 50;

  return {
    eligible: eligible,
    caAverage: caAverage.toFixed(1),
    assessments: completedAssessments,
  };
}
