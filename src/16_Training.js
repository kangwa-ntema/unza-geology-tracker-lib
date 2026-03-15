// 15_Training.gs

// ==============================================
// INDUSTRIAL TRAINING MODULE - COMPLETE
// ==============================================

function viewTraining() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('_industrial_training');

  if (!sheet || sheet.getLastRow() < 2) {
    showAlert('No training records found. Run Initialize System first.', 'info');
    return;
  }

  const training = sheet.getDataRange().getValues().slice(1);

  let tableRows = '';
  let totalHours = 0;

  training.forEach((t) => {
    totalHours += t[6] || 0;
    const verified =
      t[8] === 'Yes'
        ? '<span class="badge badge-success">✓ Verified</span>'
        : '<span class="badge badge-warning">Pending</span>';

    tableRows += `
      <tr>
        <td>${t[2]}</td>
        <td>${t[3]}</td>
        <td>${t[4]}</td>
        <td>${t[5] || 'Ongoing'}</td>
        <td>${t[6]}</td>
        <td>${t[7]}</td>
        <td>${verified}</td>
        <td>
          <button onclick="editTraining(${t[0]})" style="background:none; border:none; color:#1a73e8; cursor:pointer;">✏️</button>
          <button onclick="deleteTraining(${t[0]})" style="background:none; border:none; color:#d93025; cursor:pointer;">🗑️</button>
        </td>
      </tr>
    `;
  });

  const required = 240;
  const percent = Math.min(100, Math.round((totalHours / required) * 100));

  const content = getBaseHTML(`
    <div class="header">
      <h2>⛏️ Industrial Training</h2>
      <p>Total Hours: ${totalHours}/${required} (${percent}% complete)</p>
      <div style="background:#e8f0fe; height:20px; border-radius:10px; margin:10px 0">
        <div style="background:#1a73e8; width:${percent}%; height:20px; border-radius:10px;"></div>
      </div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <button class="btn btn-primary" onclick="addTraining()">➕ Add Internship</button>
      <button class="btn btn-secondary" onclick="trackTrainingHours()">⏱️ Track Hours</button>
    </div>
    
    <table class="table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Position</th>
          <th>Start</th>
          <th>End</th>
          <th>Hours</th>
          <th>Supervisor</th>
          <th>Verified</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    
    <script>
      function addTraining() {
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .showAddTrainingModal();
      }
      
      function trackTrainingHours() {
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .trackTrainingHours();
      }
      
      function editTraining(id) {
        alert('Edit feature coming soon');
      }
      
      function deleteTraining(id) {
        if (confirm('Delete this training record?')) {
          google.script.run
            .withSuccessHandler(() => {
              alert('Training deleted');
              google.script.host.close();
            })
            .deleteTraining(id);
        }
      }
    </script>
  `);

  showModal('⛏️ Industrial Training', content, 1000, 600);
}

function showAddTrainingModal() {
  const content = getBaseHTML(`
    <div class="header">
      <h2>➕ Add Industrial Training</h2>
      <p>Record your internship or work experience</p>
    </div>
    
    <form id="trainingForm">
      <div class="form-group">
        <label>Company *</label>
        <input type="text" class="form-control" id="company" placeholder="e.g., Konkola Copper Mines" required>
      </div>
      
      <div class="form-group">
        <label>Position *</label>
        <input type="text" class="form-control" id="position" placeholder="e.g., Student Trainee" required>
      </div>
      
      <div class="form-group">
        <label>Start Date *</label>
        <input type="date" class="form-control" id="startDate" required>
      </div>
      
      <div class="form-group">
        <label>End Date</label>
        <input type="date" class="form-control" id="endDate">
      </div>
      
      <div class="form-group">
        <label>Hours Worked *</label>
        <input type="number" class="form-control" id="hours" min="1" step="1" required>
      </div>
      
      <div class="form-group">
        <label>Supervisor Name</label>
        <input type="text" class="form-control" id="supervisor" placeholder="e.g., J. Banda">
      </div>
      
      <div class="form-group">
        <label>Verified</label>
        <select class="form-control" id="verified">
          <option value="No">No</option>
          <option value="Yes">Yes</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      
      <div class="btn-group">
        <button type="button" class="btn btn-primary" onclick="saveTraining()">Save Training</button>
        <button type="button" class="btn btn-secondary" onclick="google.script.host.close()">Cancel</button>
      </div>
    </form>
    
    <script>
      function saveTraining() {
        const data = {
          company: document.getElementById('company').value,
          position: document.getElementById('position').value,
          startDate: document.getElementById('startDate').value,
          endDate: document.getElementById('endDate').value,
          hours: parseInt(document.getElementById('hours').value),
          supervisor: document.getElementById('supervisor').value,
          verified: document.getElementById('verified').value
        };
        
        if (!data.company || !data.position || !data.startDate || !data.hours) {
          alert('Please fill all required fields');
          return;
        }
        
        google.script.run
          .withSuccessHandler(() => {
            alert('✅ Training record added!');
            google.script.host.close();
          })
          .saveTraining(data);
      }
    </script>
  `);

  showModal('➕ Add Training', content, 500, 650);
}

function saveTraining(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_industrial_training');

  const lastRow = sheet.getLastRow();
  const newId = lastRow;

  sheet.appendRow([
    newId,
    1,
    data.company,
    data.position,
    data.startDate,
    data.endDate || '',
    data.hours,
    data.supervisor || '',
    data.verified,
  ]);

  showToast('Training record added', 'Success');
}

function trackTrainingHours() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_industrial_training');

  if (!sheet || sheet.getLastRow() < 2) {
    showAlert('No training records found', 'info');
    return;
  }

  const training = sheet.getDataRange().getValues().slice(1);
  let totalHours = 0;
  let verifiedHours = 0;

  training.forEach((t) => {
    totalHours += t[6] || 0;
    if (t[8] === 'Yes') {
      verifiedHours += t[6] || 0;
    }
  });

  const required = 240;
  const message =
    `⏱️ INDUSTRIAL TRAINING HOURS\n\n` +
    `Total Hours: ${totalHours}/${required}\n` +
    `Verified Hours: ${verifiedHours}\n` +
    `Remaining: ${Math.max(0, required - totalHours)}\n\n` +
    `Progress: ${Math.min(100, Math.round((totalHours / required) * 100))}% complete`;

  showAlert(message, 'info');
}

function deleteTraining(trainingId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_industrial_training');

  for (let i = sheet.getLastRow(); i >= 2; i--) {
    if (sheet.getRange(i, 1).getValue() === trainingId) {
      sheet.deleteRow(i);
      break;
    }
  }

  showToast('Training record deleted', 'Success');
}
