import { markdown } from 'markdown';
const fs = require("fs");

const description = document.getElementById('description');
var descriptionMarkdown = fs.readFileSync("./description.md", "utf-8");
var desc = document.createElement('div');
desc.innerHTML = markdown.toHTML(descriptionMarkdown);
description.appendChild(desc);