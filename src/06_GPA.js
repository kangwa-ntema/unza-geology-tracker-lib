// 06_GPA.gs

// ==============================================
// GPA CALCULATION MODULE
// ==============================================

function calculateUNGPA() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const gradesSheet = ss.getSheetByName('_grades');
  const assessmentsSheet = ss.getSheetByName('_assessments');
  const coursesSheet = ss.getSheetByName('_courses');

  if (gradesSheet && assessmentsSheet && coursesSheet) {
    return calculateNormalizedGPA();
  } else {
    return calculateLegacyGPA();
  }
}

function calculateNormalizedGPA() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const gradesSheet = ss.getSheetByName('_grades');
  const assessmentsSheet = ss.getSheetByName('_assessments');
  const coursesSheet = ss.getSheetByName('_courses');

  if (!gradesSheet || !assessmentsSheet || !coursesSheet) {
    return calculateLegacyGPA();
  }

  let totalPoints = 0;
  let totalCredits = 0;
  let yearBreakdown = {};
  let categoryBreakdown = {
    mathScience: { points: 0, credits: 0 },
    engineeringCore: { points: 0, credits: 0 },
    miningCore: { points: 0, credits: 0 },
    generalEd: { points: 0, credits: 0 },
  };

  const grades = gradesSheet.getDataRange().getValues();
  grades.shift();

  const assessments = assessmentsSheet.getDataRange().getValues();
  assessments.shift();

  const courses = coursesSheet.getDataRange().getValues();
  courses.shift();

  let assessmentMap = {};
  assessments.forEach((ass) => {
    assessmentMap[ass[0]] = {
      course_id: ass[1],
      weight: ass[4],
      max_score: ass[5],
      name: ass[3],
    };
  });

  let courseMap = {};
  courses.forEach((course) => {
    courseMap[course[0]] = {
      code: course[1],
      name: course[2],
      credits: course[3],
      year: course[4],
      category: course[6],
    };
  });

  let courseGrades = {};

  grades.forEach((grade) => {
    const studentId = grade[1];
    const assessmentId = grade[2];
    const percentage = grade[4];
    const status = grade[6];

    if (status !== 'Graded' || !percentage) return;

    const assessment = assessmentMap[assessmentId];
    if (!assessment) return;

    const course = courseMap[assessment.course_id];
    if (!course) return;

    const courseCode = course.code;

    if (!courseGrades[courseCode] || percentage > courseGrades[courseCode].percentage) {
      courseGrades[courseCode] = {
        percentage: percentage,
        credits: course.credits,
        courseName: course.name,
        category: course.category,
        year: course.year,
      };
    }
  });

  let yearPoints = {};
  let yearCredits = {};

  for (let [code, grade] of Object.entries(courseGrades)) {
    const percentage = grade.percentage;
    const credits = grade.credits;
    const year = grade.year;
    const category = grade.category;

    let gradePoint = percentageToGradePoint(percentage);

    const points = gradePoint * credits;
    totalPoints += points;
    totalCredits += credits;

    if (!yearPoints[year]) yearPoints[year] = 0;
    if (!yearCredits[year]) yearCredits[year] = 0;
    yearPoints[year] += points;
    yearCredits[year] += credits;

    if (category === 'Math/Science') {
      categoryBreakdown.mathScience.points += points;
      categoryBreakdown.mathScience.credits += credits;
    } else if (category === 'Mining Core') {
      categoryBreakdown.miningCore.points += points;
      categoryBreakdown.miningCore.credits += credits;
    } else {
      categoryBreakdown.generalEd.points += points;
      categoryBreakdown.generalEd.credits += credits;
    }
  }

  for (let year = 1; year <= 5; year++) {
    if (yearCredits[year] && yearCredits[year] > 0) {
      yearBreakdown[`year${year}`] = {
        gpa: (yearPoints[year] / yearCredits[year]).toFixed(2),
        credits: yearCredits[year],
        points: yearPoints[year],
        display: `Year ${year}`,
      };
    }
  }

  const overallGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  return {
    overall: overallGPA,
    byYear: yearBreakdown,
    byCategory: {
      mathScience:
        categoryBreakdown.mathScience.credits > 0
          ? (categoryBreakdown.mathScience.points / categoryBreakdown.mathScience.credits).toFixed(
              2
            )
          : '0.00',
      miningCore:
        categoryBreakdown.miningCore.credits > 0
          ? (categoryBreakdown.miningCore.points / categoryBreakdown.miningCore.credits).toFixed(2)
          : '0.00',
      generalEd:
        categoryBreakdown.generalEd.credits > 0
          ? (categoryBreakdown.generalEd.points / categoryBreakdown.generalEd.credits).toFixed(2)
          : '0.00',
    },
    totalCredits: totalCredits,
    totalPoints: totalPoints,
    courseDetails: courseGrades,
  };
}

function percentageToGradePoint(percentage) {
  if (percentage >= 75) return 5.0;
  if (percentage >= 70) return 4.5;
  if (percentage >= 65) return 4.0;
  if (percentage >= 60) return 3.5;
  if (percentage >= 55) return 3.0;
  if (percentage >= 50) return 2.5;
  if (percentage >= 45) return 2.0;
  if (percentage >= 40) return 1.5;
  return 0.0;
}

function calculateLegacyGPA() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let totalPoints = 0;
  let totalCredits = 0;
  let yearBreakdown = {};

  const yearSheets = [
    { key: 'year1', name: 'Year 1 Geology' },
    { key: 'year2', name: 'Year 2 Geology' },
    { key: 'year3', name: 'Year 3 Geology' },
    { key: 'year4', name: 'Year 4 Geology' },
    { key: 'year5', name: 'Year 5 Geology' },
  ];

  yearSheets.forEach((year) => {
    const sheet = ss.getSheetByName(year.name);
    if (!sheet || sheet.getLastRow() < 2) return;

    const data = sheet.getDataRange().getValues();
    const headers = data.shift();

    const codeCol = headers.indexOf('Course Code');
    const creditsCol = headers.indexOf('Credits');
    const statusCol = headers.indexOf('Status');
    const gradeCol = headers.indexOf('Percentage');

    let courseCredits = {};
    let coursePoints = {};

    data.forEach((row) => {
      const courseCode = row[codeCol];
      let percentage = row[gradeCol];

      if (typeof percentage === 'string' && percentage.includes('%')) {
        percentage = parseFloat(percentage.replace('%', ''));
      }

      const credits = row[creditsCol];
      const status = row[statusCol];

      if (courseCode && status === 'Graded' && percentage > 0 && credits) {
        if (!courseCredits[courseCode]) {
          courseCredits[courseCode] = credits;
          let gradePoint = percentageToGradePoint(percentage);
          coursePoints[courseCode] = gradePoint * credits;
        }
      }
    });

    let yearPoints = 0,
      yearCredits = 0;
    Object.values(coursePoints).forEach((p) => (yearPoints += p));
    Object.values(courseCredits).forEach((c) => (yearCredits += c));

    if (yearCredits > 0) {
      yearBreakdown[year.key] = {
        gpa: (yearPoints / yearCredits).toFixed(2),
        credits: yearCredits,
      };
      totalPoints += yearPoints;
      totalCredits += yearCredits;
    }
  });

  return {
    overall: totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00',
    byYear: yearBreakdown,
    totalCredits: totalCredits,
  };
}

function showGPADetails() {
  const gpa = calculateUNGPA();

  let message = `╔════════════════════════════════════╗\n`;
  message += `║  📊 UNZA GPA CALCULATOR            ║\n`;
  message += `╠════════════════════════════════════╣\n`;
  message += `║ Overall GPA: ${gpa.overall.padStart(8)}/5.0          ║\n`;
  message += `║ Total Credits: ${gpa.totalCredits.toString().padStart(5)}                ║\n`;
  message += `╠════════════════════════════════════╣\n`;
  message += `║ By Year:                            ║\n`;

  if (gpa.byYear && gpa.byYear.year1) {
    message += `║ Year 1: ${gpa.byYear.year1.gpa}/5.0 (${gpa.byYear.year1.credits} cr)    ║\n`;
  }
  if (gpa.byYear && gpa.byYear.year2) {
    message += `║ Year 2: ${gpa.byYear.year2.gpa}/5.0 (${gpa.byYear.year2.credits} cr)    ║\n`;
  }
  if (gpa.byYear && gpa.byYear.year3) {
    message += `║ Year 3: ${gpa.byYear.year3.gpa}/5.0 (${gpa.byYear.year3.credits} cr)    ║\n`;
  }
  if (gpa.byYear && gpa.byYear.year4) {
    message += `║ Year 4: ${gpa.byYear.year4.gpa}/5.0 (${gpa.byYear.year4.credits} cr)    ║\n`;
  }
  if (gpa.byYear && gpa.byYear.year5) {
    message += `║ Year 5: ${gpa.byYear.year5.gpa}/5.0 (${gpa.byYear.year5.credits} cr)    ║\n`;
  }

  message += `╚════════════════════════════════════╝`;

  SpreadsheetApp.getUi().alert(message);
}
