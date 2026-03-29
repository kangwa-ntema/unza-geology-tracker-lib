// 22_UIHelpers.gs

// ==============================================
// UI HELPERS - Beautiful, Consistent UI Components
// ==============================================

function showModal(title, content, width = 500, height = 500) {
  const html = HtmlService.createHtmlOutput(content).setWidth(width).setHeight(height);
  SpreadsheetApp.getUi().showModalDialog(html, title);
}

function showToast(message, title = 'Success', timeout = 3) {
  SpreadsheetApp.getActiveSpreadsheet().toast(message, title, timeout);
}

function showAlert(message, type = 'info') {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };
  SpreadsheetApp.getUi().alert(`${icons[type]} ${message}`);
}

function showConfirm(message) {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert('Confirm', message, ui.ButtonSet.YES_NO);
  return response === ui.Button.YES;
}

function getBaseHTML(innerContent) {
  return `
    <html>
      <head>
        <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css">
        <style>
          body {
            font-family: 'Google Sans', Roboto, Arial, sans-serif;
            margin: 0;
            padding: 24px;
            background: white;
          }
          .header {
            margin-bottom: 24px;
          }
          .header h2 {
            margin: 0;
            color: #1a73e8;
            font-size: 20px;
            font-weight: 500;
          }
          .header p {
            margin: 8px 0 0;
            color: #5f6368;
            font-size: 14px;
          }
          .form-group {
            margin-bottom: 20px;
          }
          .form-group label {
            display: block;
            margin-bottom: 6px;
            color: #3c4043;
            font-size: 13px;
            font-weight: 500;
          }
          .form-control {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #dadce0;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
            transition: border-color 0.2s;
          }
          .form-control:focus {
            outline: none;
            border-color: #1a73e8;
            box-shadow: 0 0 0 2px rgba(26,115,232,0.2);
          }
          select.form-control {
            background-color: white;
            cursor: pointer;
          }
          .btn-group {
            display: flex;
            gap: 12px;
            margin-top: 32px;
          }
          .btn {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-primary {
            background: #1a73e8;
            color: white;
          }
          .btn-primary:hover {
            background: #1557b0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          }
          .btn-secondary {
            background: #f1f3f4;
            color: #3c4043;
          }
          .btn-secondary:hover {
            background: #e8eaed;
          }
          .btn-danger {
            background: #d93025;
            color: white;
          }
          .btn-danger:hover {
            background: #b3150b;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 16px;
            margin-top: 20px;
          }
          .card {
            border: 1px solid #dadce0;
            border-radius: 8px;
            padding: 16px;
            transition: box-shadow 0.2s;
          }
          .card:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
          }
          .badge-success {
            background: #e6f4ea;
            color: #137333;
          }
          .badge-warning {
            background: #fef7e0;
            color: #b45f06;
          }
          .badge-danger {
            background: #fce8e6;
            color: #c5221f;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
          }
          .table th {
            text-align: left;
            padding: 12px;
            background: #f8f9fa;
            color: #3c4043;
            font-weight: 500;
            font-size: 13px;
          }
          .table td {
            padding: 12px;
            border-bottom: 1px solid #dadce0;
            font-size: 14px;
          }
          .table tr:hover td {
            background: #f8f9fa;
          }
        </style>
      </head>
      <body>
        ${innerContent}
      </body>
    </html>
  `;
}
