// eslint.config.js - Flat config format for ESLint v10
import globals from "globals";

export default [
  {
    files: ["src/**/*.js", "src/**/*.gs"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.googleappsscript,
        ...globals.node,
        // Custom globals from your project
        CONFIG: "readonly",
        APP_VERSION: "readonly",
        VERSION_HISTORY: "readonly",
        INIT_CONFIG: "readonly",
        ProfileManager: "readonly",
        TemplateVersion: "readonly",
        TemplateUtils: "readonly",
        TemplateLocal: "readonly",
        TemplateTests: "readonly",
        LibraryChecker: "readonly",
        SpreadsheetApp: "readonly",
        DriveApp: "readonly",
        DocumentApp: "readonly",
        MailApp: "readonly",
        Session: "readonly",
        Utilities: "readonly",
        Logger: "readonly",
        console: "readonly",
        PropertiesService: "readonly",
        CacheService: "readonly",
        LockService: "readonly",
        ScriptApp: "readonly",
        HtmlService: "readonly",
        ContentService: "readonly",
        UrlFetchApp: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-undef": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"]
    }
  }
];