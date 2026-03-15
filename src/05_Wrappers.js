// 05_Wrappers.gs

// ==============================================
// WRAPPER FUNCTIONS for Menu Items
// ==============================================

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

function viewFeeStructure() {
  const html = HtmlService.createHtmlOutput(
    `
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
  `
  )
    .setWidth(500)
    .setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(html, '💰 Fee Structure');
}
