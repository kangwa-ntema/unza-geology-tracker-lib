// 07_ProgramRequirements.gs

// ==============================================
// PROGRAM REQUIREMENTS MODULE
// ==============================================

function showProgramRequirements() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let programData;
  if (typeof CONFIG !== 'undefined' && CONFIG.program) {
    programData = CONFIG.program;
  } else {
    programData = {
      name: 'Bachelor of Science in Geology',
      totalCredits: 160,
      duration: '5 Years',
      categories: {
        mathScience: { name: 'Math/Science', required: 30 },
        engineeringCore: { name: 'Engineering Core', required: 50 },
        miningCore: { name: 'Mining Core', required: 70 },
        generalEd: { name: 'General Education', required: 15 },
      },
    };
  }

  const progress = calculateUNZAProgress();
  const gpa = calculateUNGPA();

  let categoryRows = '';
  let totalEarned = 0;
  let totalRequired = 0;

  for (let [key, data] of Object.entries(progress)) {
    const percent = parseFloat(data.percent);
    totalEarned += data.earned;
    totalRequired += data.required;

    let progressColor = '';
    if (percent >= 100) progressColor = 'badge-success';
    else if (percent >= 50) progressColor = 'badge-warning';
    else progressColor = 'badge-danger';

    categoryRows += `
      <tr>
        <td>${data.name}</td>
        <td>${data.required}</td>
        <td>${data.earned}</td>
        <td>${data.remaining}</td>
        <td>
          <div style="display: flex; align-items: center;">
            <div style="flex:1; background:#e8f0fe; height:8px; border-radius:4px; margin-right:10px;">
              <div style="background:#1a73e8; width:${Math.min(100, percent)}%; height:8px; border-radius:4px;"></div>
            </div>
            <span class="badge ${progressColor}">${percent}%</span>
          </div>
        </td>
      </tr>
    `;
  }

  const overallPercent = ((totalEarned / totalRequired) * 100).toFixed(1);

  const content = getBaseHTML(`
    <div class="header">
      <h2>🎓 Program Requirements</h2>
      <p>${programData.name} | ${programData.duration} | ${programData.totalCredits} Total Credits</p>
    </div>
    
    <div style="background:#f8f9fa; padding:20px; border-radius:8px; margin-bottom:20px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap:20px;">
        <div>
          <h4 style="margin:0 0 10px 0">Overall Progress</h4>
          <div style="font-size: 32px; color:#1a73e8;">${overallPercent}%</div>
          <div>${totalEarned}/${totalRequired} credits completed</div>
        </div>
        <div>
          <h4 style="margin:0 0 10px 0">Current GPA</h4>
          <div style="font-size: 32px; color:${parseFloat(gpa.overall) >= 2.0 ? '#0f9d58' : '#d93025'};">${gpa.overall}/5.0</div>
          <div>Minimum required: 2.0</div>
        </div>
      </div>
    </div>
    
    <h4>📊 Category Requirements</h4>
    <table class="table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Required</th>
          <th>Earned</th>
          <th>Remaining</th>
          <th>Progress</th>
        </tr>
      </thead>
      <tbody>
        ${categoryRows}
      </tbody>
    </table>
    
    <div style="margin-top:20px; display:flex; gap:10px; justify-content:flex-end;">
      <button class="btn btn-secondary" onclick="showDetailedBreakdown()">📋 Detailed Breakdown</button>
      <button class="btn btn-secondary" onclick="google.script.host.close()">Close</button>
    </div>
    
    <script>
      function showDetailedBreakdown() {
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .showDetailedRequirements();
      }
    </script>
  `);

  showModal('🎓 Program Requirements', content, 800, 600);
}

function showDetailedRequirements() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const coursesSheet = ss.getSheetByName('_courses');
  const gradesSheet = ss.getSheetByName('_grades');
  const assessmentsSheet = ss.getSheetByName('_assessments');

  if (!coursesSheet) {
    showAlert('No course data found', 'info');
    return;
  }

  const courses = coursesSheet.getDataRange().getValues().slice(1);
  const assessments = assessmentsSheet ? assessmentsSheet.getDataRange().getValues().slice(1) : [];
  const grades = gradesSheet ? gradesSheet.getDataRange().getValues().slice(1) : [];

  const assessmentCourseMap = {};
  assessments.forEach((ass) => {
    assessmentCourseMap[ass[0]] = ass[1];
  });

  const completedCourses = new Set();
  grades.forEach((grade) => {
    if (grade[6] === 'Graded') {
      const courseId = assessmentCourseMap[grade[2]];
      if (courseId) completedCourses.add(courseId);
    }
  });

  const byCategory = {
    'Math/Science': [],
    'Mining Core': [],
    'General Ed': [],
  };

  courses.forEach((course) => {
    const category = course[6];
    const isCompleted = completedCourses.has(course[0]);

    if (byCategory[category]) {
      byCategory[category].push({
        code: course[1],
        name: course[2],
        credits: course[3],
        completed: isCompleted,
        year: course[4],
      });
    }
  });

  let detailedHtml = '';

  for (let [category, courseList] of Object.entries(byCategory)) {
    const completedCredits = courseList
      .filter((c) => c.completed)
      .reduce((sum, c) => sum + c.credits, 0);
    const totalCredits = courseList.reduce((sum, c) => sum + c.credits, 0);

    let courseRows = '';
    courseList.forEach((course) => {
      const status = course.completed
        ? '<span class="badge badge-success">✓ Completed</span>'
        : '<span class="badge badge-warning">Pending</span>';

      courseRows += `
        <tr>
          <td>${course.code}</td>
          <td>${course.name}</td>
          <td>Year ${course.year}</td>
          <td>${course.credits}</td>
          <td>${status}</td>
        </tr>
      `;
    });

    detailedHtml += `
      <div style="margin-top:20px;">
        <h4 style="color:#1a73e8;">${category}</h4>
        <p>Progress: ${completedCredits}/${totalCredits} credits completed</p>
        <table class="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Course Name</th>
              <th>Year</th>
              <th>Credits</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${courseRows}
          </tbody>
        </table>
      </div>
    `;
  }

  const content = getBaseHTML(`
    <div class="header">
      <h2>📋 Detailed Course Requirements</h2>
      <p>Complete list of all courses by category</p>
    </div>
    
    ${detailedHtml}
    
    <div style="margin-top:20px; text-align:center;">
      <button class="btn btn-secondary" onclick="google.script.host.close()">Close</button>
    </div>
  `);

  showModal('📋 Detailed Requirements', content, 900, 700);
}

function checkCategoryRequirement(category) {
  const progress = calculateUNZAProgress();
  const categoryMap = {
    math: progress.mathScience,
    science: progress.mathScience,
    mining: progress.miningCore,
    engineering: progress.engineeringCore,
    general: progress.generalEd,
  };

  const data = categoryMap[category.toLowerCase()] || null;

  if (!data) {
    return { meets: false, message: 'Category not found' };
  }

  const meets = data.earned >= data.required;
  const remaining = data.required - data.earned;

  return {
    meets: meets,
    earned: data.earned,
    required: data.required,
    remaining: remaining,
    percent: data.percent,
    message: meets
      ? `✅ ${data.name} requirement met`
      : `❌ ${data.name}: Need ${remaining} more credits`,
  };
}

function getRequirementsSummary() {
  const progress = calculateUNZAProgress();
  const gpa = calculateUNGPA();

  let summary = [];

  for (let data of Object.values(progress)) {
    const meets = data.earned >= data.required;
    summary.push({
      category: data.name,
      meets: meets,
      status: meets ? '✅' : '❌',
      progress: `${data.earned}/${data.required}`,
    });
  }

  summary.push({
    category: 'GPA',
    meets: parseFloat(gpa.overall) >= 2.0,
    status: parseFloat(gpa.overall) >= 2.0 ? '✅' : '❌',
    progress: gpa.overall,
  });

  return summary;
}

function calculateUNZAProgress() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const coursesSheet = ss.getSheetByName('_courses');
  const gradesSheet = ss.getSheetByName('_grades');
  const assessmentsSheet = ss.getSheetByName('_assessments');

  if (!coursesSheet || !gradesSheet || !assessmentsSheet) {
    return getDefaultProgress();
  }

  let earned = {
    mathScience: 0,
    engineeringCore: 0,
    miningCore: 0,
    generalEd: 0,
  };

  const courses = coursesSheet.getDataRange().getValues().slice(1);
  const assessments = assessmentsSheet.getDataRange().getValues().slice(1);
  const grades = gradesSheet.getDataRange().getValues().slice(1);

  let assessmentCourseMap = {};
  assessments.forEach((ass) => (assessmentCourseMap[ass[0]] = ass[1]));

  let courseMap = {};
  courses.forEach((course) => {
    courseMap[course[0]] = {
      credits: course[3],
      category: course[6],
    };
  });

  let completedCourses = new Set();

  grades.forEach((grade) => {
    if (grade[6] !== 'Graded') return;

    const assessmentId = grade[2];
    const courseId = assessmentCourseMap[assessmentId];

    if (courseId && !completedCourses.has(courseId)) {
      const course = courseMap[courseId];
      if (course) {
        completedCourses.add(courseId);

        if (course.category === 'Math/Science') {
          earned.mathScience += course.credits;
        } else if (course.category === 'Mining Core') {
          earned.miningCore += course.credits;
        } else {
          earned.generalEd += course.credits;
        }
      }
    }
  });

  return {
    mathScience: {
      name: 'Math/Science',
      required: 30,
      earned: earned.mathScience,
      percent: ((earned.mathScience / 30) * 100).toFixed(1),
      remaining: 30 - earned.mathScience,
    },
    engineeringCore: {
      name: 'Engineering Core',
      required: 50,
      earned: earned.engineeringCore,
      percent: ((earned.engineeringCore / 50) * 100).toFixed(1),
      remaining: 50 - earned.engineeringCore,
    },
    miningCore: {
      name: 'Mining Core',
      required: 70,
      earned: earned.miningCore,
      percent: ((earned.miningCore / 70) * 100).toFixed(1),
      remaining: 70 - earned.miningCore,
    },
    generalEd: {
      name: 'General Education',
      required: 15,
      earned: earned.generalEd,
      percent: ((earned.generalEd / 15) * 100).toFixed(1),
      remaining: 15 - earned.generalEd,
    },
  };
}

function getDefaultProgress() {
  return {
    mathScience: { name: 'Math/Science', required: 30, earned: 0, percent: '0', remaining: 30 },
    engineeringCore: {
      name: 'Engineering Core',
      required: 50,
      earned: 0,
      percent: '0',
      remaining: 50,
    },
    miningCore: { name: 'Mining Core', required: 70, earned: 0, percent: '0', remaining: 70 },
    generalEd: { name: 'General Education', required: 15, earned: 0, percent: '0', remaining: 15 },
  };
}
