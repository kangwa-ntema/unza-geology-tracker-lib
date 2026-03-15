// 18_Reports.gs

// ==============================================
// REPORTS MODULE
// ==============================================

function createUNZAReport() {
  try {
    const gpa = calculateUNGPA();
    const progress = calculateUNZAProgress();

    const doc = DocumentApp.create(`Geology_Report_${new Date().toLocaleDateString()}`);
    const body = doc.getBody();

    body.appendParagraph('UNIVERSITY OF ZAMBIA').setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body
      .appendParagraph('School of Mines - Geology')
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body
      .appendParagraph('ACADEMIC PROGRESS REPORT')
      .setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendParagraph(' ');

    body.appendParagraph(`Date: ${new Date().toLocaleDateString()}`);
    body.appendParagraph(' ');

    body.appendParagraph(`GPA: ${gpa.overall}/5.0`);
    body.appendParagraph(`Total Credits: ${gpa.totalCredits}/160`);
    body.appendParagraph(' ');

    body.appendParagraph('Progress by Category:');
    for (let data of Object.values(progress)) {
      body.appendParagraph(`• ${data.name}: ${data.percent}% (${data.earned}/${data.required})`);
    }

    doc.saveAndClose();

    showAlert(`✅ Report created: ${doc.getUrl()}`, 'success');
    return doc.getUrl();
  } catch (error) {
    showAlert('Error creating report: ' + error, 'error');
  }
}

function emailProgressReport() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Email Report', 'Enter email address:', ui.ButtonSet.OK_CANCEL);

  if (response.getSelectedButton() !== ui.Button.OK) return;

  const email = response.getResponseText();
  if (!email.includes('@')) {
    showAlert('Please enter a valid email address', 'error');
    return;
  }

  const gpa = calculateUNGPA();
  const progress = calculateUNZAProgress();

  let body = `UNZA Geology Progress Report\n\n`;
  body += `Date: ${new Date().toLocaleDateString()}\n`;
  body += `GPA: ${gpa.overall}/5.0\n`;
  body += `Credits: ${gpa.totalCredits}/160\n\n`;
  body += `Progress by Category:\n`;

  for (let data of Object.values(progress)) {
    body += `• ${data.name}: ${data.percent}% (${data.earned}/${data.required})\n`;
  }

  MailApp.sendEmail(email, `Geology Progress Report - ${new Date().toLocaleDateString()}`, body);
  showAlert(`✅ Report emailed to ${email}`, 'success');
}

function checkGraduationReadiness() {
  const progress = calculateUNZAProgress();
  const gpa = calculateUNGPA();

  let missing = [];
  let totalEarned = 0;
  let totalRequired = 0;

  for (let data of Object.values(progress)) {
    totalEarned += data.earned;
    totalRequired += data.required;
    if (data.earned < data.required) {
      missing.push(`${data.name}: ${data.remaining} credits remaining`);
    }
  }

  const creditsNeeded = totalRequired - totalEarned;
  const gpaOk = parseFloat(gpa.overall) >= 2.0;

  let message = '🎓 GRADUATION CHECK\n\n';
  message += `GPA: ${gpa.overall}/5.0 ${gpaOk ? '✅' : '❌ (Minimum 2.0 required)'}\n`;
  message += `Credits: ${totalEarned}/${totalRequired} completed\n`;
  message += `Remaining: ${creditsNeeded} credits\n\n`;

  if (missing.length > 0) {
    message += 'Missing Requirements:\n' + missing.join('\n');
  } else if (gpaOk) {
    message += '✅ READY TO GRADUATE!';
  } else {
    message += '⚠️ Need to improve GPA to 2.0';
  }

  SpreadsheetApp.getUi().alert(message);
}
