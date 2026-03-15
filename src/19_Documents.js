// 19_Documents.gs

// ==============================================
// DOCUMENTS MODULE
// ==============================================

function uploadScript() {
  const html = HtmlService.createHtmlOutput(
    `
    <html>
      <head>
        <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css">
        <style>
          body { font-family: 'Google Sans', sans-serif; padding: 20px; }
        </style>
      </head>
      <body>
        <h3 style="color:#1a73e8">📸 Upload Document</h3>
        <p>Document upload feature coming soon! For now, you can:</p>
        <ul>
          <li>Open your Google Drive folder</li>
          <li>Manually upload files there</li>
          <li>They will be linked to your tracker</li>
        </ul>
        <button class="btn btn-primary" onclick="openFolder()" style="width:100%; margin:10px 0">📁 Open Drive Folder</button>
        <button class="btn btn-secondary" onclick="google.script.host.close()">Close</button>
        
        <script>
          function openFolder() {
            google.script.run
              .withSuccessHandler(() => google.script.host.close())
              .openFolders();
          }
        </script>
      </body>
    </html>
  `
  )
    .setWidth(400)
    .setHeight(300);

  SpreadsheetApp.getUi().showModalDialog(html, 'Upload Document');
}

function openFolders() {
  const rootFolderName = 'UNZA Geology Tracker - Demo Student';
  const folders = DriveApp.getFoldersByName(rootFolderName);

  if (folders.hasNext()) {
    const folder = folders.next();
    const html = HtmlService.createHtmlOutput(
      `
      <html>
        <head>
          <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css">
          <style>
            body { font-family: 'Google Sans', sans-serif; padding: 20px; }
            .folder-list { margin: 20px 0; }
            .folder-item { padding: 10px; border-bottom: 1px solid #dadce0; }
          </style>
        </head>
        <body>
          <h3 style="color:#1a73e8">📁 Your Drive Folders</h3>
          <div class="folder-list">
            <div class="folder-item">
              <strong>Main Folder:</strong><br>
              <a href="${folder.getUrl()}" target="_blank">${folder.getName()}</a>
            </div>
          </div>
          <p style="color:#5f6368">Subfolders will appear here when created.</p>
          <button class="btn btn-primary" onclick="google.script.host.close()">Close</button>
        </body>
      </html>
    `
    )
      .setWidth(400)
      .setHeight(300);

    SpreadsheetApp.getUi().showModalDialog(html, 'Your Folders');
  } else {
    showAlert('No folder found. Run Initialize System first.', 'warning');
  }
}

function searchDocuments() {
  showAlert('Document search coming soon!', 'info');
}
