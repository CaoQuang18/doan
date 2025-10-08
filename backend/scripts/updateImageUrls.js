// Script to update all image URLs in seedHouses.js to use BASE_URL
const fs = require('fs');
const path = require('path');

const seedFilePath = path.join(__dirname, '../seed/seedHouses.js');
let content = fs.readFileSync(seedFilePath, 'utf8');

// Replace all /assets/ with ${BASE_URL}/assets/
content = content.replace(/image: "\/assets\//g, 'image: `${BASE_URL}/assets/');
content = content.replace(/imageLg: "\/assets\//g, 'imageLg: `${BASE_URL}/assets/');
content = content.replace(/\.png"/g, '.png`');

// Write back
fs.writeFileSync(seedFilePath, content, 'utf8');

console.log('✅ Updated all image URLs in seedHouses.js');
