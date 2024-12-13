const fs = require('fs');
const ejs = require('ejs');

const template = fs.readFileSync('./views/index.ejs', 'utf8');
const html = ejs.render(template, { title: 'Savings Calculator' });
fs.writeFileSync('./index.html', html);