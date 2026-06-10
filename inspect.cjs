const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/context/LanguageContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace translations to include spaces and correct formatting
content = content.replace(/year1: 'Year 1'/g, "year1: 'Year 1'"); // Already 'Year 1' in english? Let's check!
// If it's already 'Year 1' in English, maybe the issue is that it's rendered as "year1"? 
// Let me look at the code of App.tsx first!
