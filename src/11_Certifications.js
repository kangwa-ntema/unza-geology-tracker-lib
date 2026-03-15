// 11_Certifications.gs

// ==============================================
// CERTIFICATIONS MODULE - COMPLETE
// ==============================================

function viewCertifications() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_certifications');

  if (!sheet || sheet.getLastRow() < 2) {
    showAlert('No certifications found. Run Initialize System first.', 'info');
    return;
  }

  const certs = sheet.getDataRange().getValues().slice(1);

  let tableRows = '';
  const today = new Date();

  certs.forEach((cert) => {
    const expiryDate = new Date(cert[5]);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    let statusBadge = '';
    if (cert[6] === 'Expired') {
      statusBadge = '<span class="badge badge-danger">Expired</span>';
    } else if (daysUntilExpiry < 30) {
      statusBadge = '<span class="badge badge-warning">Expiring Soon</span>';
    } else {
      statusBadge = '<span class="badge badge-success">Active</span>';
    }

    tableRows += `
      <tr>
        <td>${cert[2]}</td>
        <td>${cert[3]}</td>
        <td>${cert[4]}</td>
        <td>${cert[5]}</td>
        <td>${statusBadge}</td>
        <td>${cert[7] || ''}</td>
        <td>
          <button onclick="editCert(${cert[0]})" style="background:none; border:none; color:#1a73e8; cursor:pointer;">✏️</button>
          <button onclick="deleteCert(${cert[0]})" style="background:none; border:none; color:#d93025; cursor:pointer;">🗑️</button>
        </td>
      </tr>
    `;
  });

  const content = getBaseHTML(`
    <div class="header">
      <h2>🛡️ My Certifications</h2>
      <p>Track your professional certifications</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <button class="btn btn-primary" onclick="addCertification()">➕ Add Certification</button>
      <button class="btn btn-secondary" onclick="checkCertExpiry()">⏰ Check Expiry Alerts</button>
    </div>
    
    <table class="table">
      <thead>
        <tr>
          <th>Certification</th>
          <th>Issuing Body</th>
          <th>Date Earned</th>
          <th>Expiry Date</th>
          <th>Status</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    
    <script>
      function addCertification() {
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .showAddCertificationModal();
      }
      
      function editCert(id) {
        alert('Edit feature coming soon');
      }
      
      function deleteCert(id) {
        if (confirm('Delete this certification?')) {
          google.script.run
            .withSuccessHandler(() => {
              alert('Certification deleted');
              google.script.host.close();
            })
            .deleteCertification(id);
        }
      }
      
      function checkCertExpiry() {
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .checkCertExpiry();
      }
    </script>
  `);

  showModal('🛡️ Certifications', content, 1000, 600);
}

function showAddCertificationModal() {
  const content = getBaseHTML(`
    <div class="header">
      <h2>➕ Add Certification</h2>
      <p>Enter your professional certification details</p>
    </div>
    
    <form id="certForm">
      <div class="form-group">
        <label>Certification Name *</label>
        <input type="text" class="form-control" id="name" placeholder="e.g., MSHA Part 48" required>
      </div>
      
      <div class="form-group">
        <label>Issuing Body *</label>
        <input type="text" class="form-control" id="issuingBody" placeholder="e.g., MSHA" required>
      </div>
      
      <div class="form-group">
        <label>Date Earned *</label>
        <input type="date" class="form-control" id="dateEarned" required>
      </div>
      
      <div class="form-group">
        <label>Expiry Date</label>
        <input type="date" class="form-control" id="expiryDate">
      </div>
      
      <div class="form-group">
        <label>Status</label>
        <select class="form-control" id="status">
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Notes</label>
        <textarea class="form-control" id="notes" rows="3"></textarea>
      </div>
      
      <div class="btn-group">
        <button type="button" class="btn btn-primary" onclick="saveCertification()">Save Certification</button>
        <button type="button" class="btn btn-secondary" onclick="google.script.host.close()">Cancel</button>
      </div>
    </form>
    
    <script>
      function saveCertification() {
        const data = {
          name: document.getElementById('name').value,
          issuingBody: document.getElementById('issuingBody').value,
          dateEarned: document.getElementById('dateEarned').value,
          expiryDate: document.getElementById('expiryDate').value,
          status: document.getElementById('status').value,
          notes: document.getElementById('notes').value
        };
        
        if (!data.name || !data.issuingBody || !data.dateEarned) {
          alert('Please fill all required fields');
          return;
        }
        
        google.script.run
          .withSuccessHandler(() => {
            alert('✅ Certification added successfully!');
            google.script.host.close();
          })
          .saveCertification(data);
      }
    </script>
  `);

  showModal('➕ Add Certification', content, 500, 650);
}

function saveCertification(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_certifications');

  const lastRow = sheet.getLastRow();
  const newId = lastRow;

  sheet.appendRow([
    newId,
    1,
    data.name,
    data.issuingBody,
    data.dateEarned,
    data.expiryDate || '',
    data.status,
    data.notes,
  ]);

  showToast(`Certification ${data.name} added`, 'Success');
}

function deleteCertification(certId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_certifications');

  for (let i = sheet.getLastRow(); i >= 2; i--) {
    if (sheet.getRange(i, 1).getValue() === certId) {
      sheet.deleteRow(i);
      break;
    }
  }

  showToast('Certification deleted', 'Success');
}

function checkCertExpiry() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_certifications');

  if (!sheet || sheet.getLastRow() < 2) {
    showAlert('No certifications to check', 'info');
    return;
  }

  const certs = sheet.getDataRange().getValues().slice(1);
  const today = new Date();
  let expiringSoon = [];
  let expired = [];

  certs.forEach((cert) => {
    if (cert[5]) {
      const expiryDate = new Date(cert[5]);
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry < 0) {
        expired.push(`${cert[2]} (expired ${Math.abs(daysUntilExpiry)} days ago)`);
      } else if (daysUntilExpiry < 30) {
        expiringSoon.push(`${cert[2]} (expires in ${daysUntilExpiry} days)`);
      }
    }
  });

  let message = '⏰ CERTIFICATION EXPIRY ALERTS\n\n';

  if (expired.length > 0) {
    message += '🔴 EXPIRED:\n' + expired.join('\n') + '\n\n';
  }

  if (expiringSoon.length > 0) {
    message += '🟡 EXPIRING SOON (<30 days):\n' + expiringSoon.join('\n') + '\n\n';
  }

  if (expired.length === 0 && expiringSoon.length === 0) {
    message += '✅ All certifications are valid and not expiring soon!';
  }

  showAlert(message, 'info');
}
