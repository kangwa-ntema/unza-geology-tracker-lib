// 12_Expenses.gs

// ==============================================
// EXPENSES MODULE - COMPLETE
// ==============================================

function viewExpenses() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_expenses');

  if (!sheet || sheet.getLastRow() < 2) {
    showAlert('No expenses recorded. Run Initialize System first.', 'info');
    return;
  }

  const expenses = sheet.getDataRange().getValues().slice(1);

  let totalAmount = 0;
  let tableRows = '';

  expenses.forEach((exp) => {
    totalAmount += exp[5];
    tableRows += `
      <tr>
        <td>${exp[2]}</td>
        <td><span class="badge" style="background:#e8f0fe; color:#1a73e8">${exp[3]}</span></td>
        <td>${exp[4]}</td>
        <td><strong>K${exp[5].toFixed(2)}</strong></td>
        <td>${exp[6]}</td>
        <td>${exp[7] || ''}</td>
        <td>
          <button onclick="editExpense(${exp[0]})" style="background:none; border:none; color:#1a73e8; cursor:pointer;">✏️</button>
          <button onclick="deleteExpense(${exp[0]})" style="background:none; border:none; color:#d93025; cursor:pointer;">🗑️</button>
        </td>
      </tr>
    `;
  });

  const categories = {};
  expenses.forEach((exp) => {
    const cat = exp[3];
    categories[cat] = (categories[cat] || 0) + exp[5];
  });

  let categorySummary = '';
  for (const [cat, amount] of Object.entries(categories)) {
    const percentage = ((amount / totalAmount) * 100).toFixed(1);
    categorySummary += `
      <div style="margin:5px 0">
        <span style="display:inline-block; width:120px">${cat}:</span>
        <span style="font-weight:500">K${amount.toFixed(2)}</span>
        <span style="color:#5f6368; margin-left:10px">(${percentage}%)</span>
      </div>
    `;
  }

  const content = getBaseHTML(`
    <div class="header">
      <h2>💰 My Expenses</h2>
      <p>Total Spent: <span style="font-size:24px; color:#1a73e8">K${totalAmount.toFixed(2)}</span></p>
    </div>
    
    <div style="display:grid; grid-template-columns:1fr 2fr; gap:20px; margin-bottom:20px">
      <div style="background:#f8f9fa; padding:15px; border-radius:8px">
        <h4 style="margin:0 0 10px 0">📊 By Category</h4>
        ${categorySummary}
      </div>
      
      <div style="display:flex; gap:10px; align-items:center">
        <button class="btn btn-primary" onclick="addExpense()">➕ Add Expense</button>
        <button class="btn btn-secondary" onclick="spendingAnalysis()">📈 Analyze</button>
      </div>
    </div>
    
    <table class="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Payment Method</th>
          <th>Receipt</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    
    <script>
      function addExpense() {
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .showAddExpenseModal();
      }
      
      function editExpense(id) {
        alert('Edit feature coming soon');
      }
      
      function deleteExpense(id) {
        if (confirm('Delete this expense?')) {
          google.script.run
            .withSuccessHandler(() => {
              alert('Expense deleted');
              google.script.host.close();
            })
            .deleteExpense(id);
        }
      }
      
      function spendingAnalysis() {
        google.script.run
          .withSuccessHandler(() => google.script.host.close())
          .spendingAnalysis();
      }
    </script>
  `);

  showModal('💰 Expenses', content, 1000, 600);
}

function showAddExpenseModal() {
  const content = getBaseHTML(`
    <div class="header">
      <h2>➕ Add Expense</h2>
      <p>Record your educational expenses</p>
    </div>
    
    <form id="expenseForm">
      <div class="form-group">
        <label>Date *</label>
        <input type="date" class="form-control" id="date" value="${new Date().toISOString().split('T')[0]}" required>
      </div>
      
      <div class="form-group">
        <label>Category *</label>
        <select class="form-control" id="category" required>
          <option value="Tuition">Tuition</option>
          <option value="Accommodation">Accommodation</option>
          <option value="Books">Books</option>
          <option value="Transport">Transport</option>
          <option value="Food">Food</option>
          <option value="Stationery">Stationery</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Description *</label>
        <input type="text" class="form-control" id="description" placeholder="e.g., Semester 1 Fees" required>
      </div>
      
      <div class="form-group">
        <label>Amount (ZMW) *</label>
        <input type="number" class="form-control" id="amount" min="0" step="0.01" required>
      </div>
      
      <div class="form-group">
        <label>Payment Method</label>
        <select class="form-control" id="paymentMethod">
          <option value="Cash">Cash</option>
          <option value="Mobile Money">Mobile Money</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Card">Card</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Receipt</label>
        <select class="form-control" id="receipt">
          <option value="Yes">Yes, I have receipt</option>
          <option value="No">No receipt</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Notes</label>
        <textarea class="form-control" id="notes" rows="2"></textarea>
      </div>
      
      <div class="btn-group">
        <button type="button" class="btn btn-primary" onclick="saveExpense()">Save Expense</button>
        <button type="button" class="btn btn-secondary" onclick="google.script.host.close()">Cancel</button>
      </div>
    </form>
    
    <script>
      function saveExpense() {
        const data = {
          date: document.getElementById('date').value,
          category: document.getElementById('category').value,
          description: document.getElementById('description').value,
          amount: parseFloat(document.getElementById('amount').value),
          paymentMethod: document.getElementById('paymentMethod').value,
          receipt: document.getElementById('receipt').value,
          notes: document.getElementById('notes').value
        };
        
        if (!data.date || !data.description || isNaN(data.amount)) {
          alert('Please fill all required fields');
          return;
        }
        
        google.script.run
          .withSuccessHandler(() => {
            alert('✅ Expense added successfully!');
            google.script.host.close();
          })
          .saveExpense(data);
      }
    </script>
  `);

  showModal('➕ Add Expense', content, 500, 650);
}

function saveExpense(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_expenses');

  const lastRow = sheet.getLastRow();
  const newId = lastRow;

  sheet.appendRow([
    newId,
    1,
    data.date,
    data.category,
    data.description,
    data.amount,
    data.paymentMethod,
    data.receipt === 'Yes' ? 'Receipt available' : '',
  ]);

  showToast(`Expense added: K${data.amount}`, 'Success');
}

function deleteExpense(expenseId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_expenses');

  for (let i = sheet.getLastRow(); i >= 2; i--) {
    if (sheet.getRange(i, 1).getValue() === expenseId) {
      sheet.deleteRow(i);
      break;
    }
  }

  showToast('Expense deleted', 'Success');
}

function spendingAnalysis() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('_expenses');

  if (!sheet || sheet.getLastRow() < 2) {
    showAlert('No expenses to analyze', 'info');
    return;
  }

  const expenses = sheet.getDataRange().getValues().slice(1);

  const monthly = {};
  const categories = {};

  expenses.forEach((exp) => {
    const date = exp[2];
    let dateStr = '';

    if (date instanceof Date) {
      dateStr = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM');
    } else if (typeof date === 'string') {
      dateStr = date.substring(0, 7);
    } else {
      dateStr = 'Unknown';
    }

    const category = exp[3];
    const amount = exp[5];

    monthly[dateStr] = (monthly[dateStr] || 0) + amount;
    categories[category] = (categories[category] || 0) + amount;
  });

  let monthlyHtml = '';
  Object.keys(monthly)
    .sort()
    .forEach((month) => {
      monthlyHtml += `<div>${month}: <strong>K${monthly[month].toFixed(2)}</strong></div>`;
    });

  let categoryHtml = '';
  Object.keys(categories)
    .sort()
    .forEach((cat) => {
      categoryHtml += `<div>${cat}: <strong>K${categories[cat].toFixed(2)}</strong></div>`;
    });

  const content = getBaseHTML(`
    <div class="header">
      <h2>📊 Spending Analysis</h2>
      <p>Understand your education expenses</p>
    </div>
    
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px">
      <div style="background:#f8f9fa; padding:20px; border-radius:8px">
        <h3 style="margin:0 0 15px 0">📅 Monthly Breakdown</h3>
        ${monthlyHtml || '<p>No monthly data</p>'}
      </div>
      
      <div style="background:#f8f9fa; padding:20px; border-radius:8px">
        <h3 style="margin:0 0 15px 0">🏷️ By Category</h3>
        ${categoryHtml || '<p>No category data</p>'}
      </div>
    </div>
    
    <div style="margin-top:20px">
      <button class="btn btn-secondary" onclick="google.script.host.close()">Close</button>
    </div>
  `);

  showModal('📊 Spending Analysis', content, 700, 500);
}
