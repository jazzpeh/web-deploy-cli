const fs = require('fs');
const path = require('path');

/**
 * Read all files and sub directories given a directory path
 * @param {string} dir 
 */
const readDir = dir => {
  if (!fs.existsSync(dir)) return [];
  const ignoreList = ['.DS_Store'];
  const entryPaths = fs.readdirSync(dir).map(entry => path.join(dir, entry));
  const filePaths = entryPaths.filter(entryPath => fs.statSync(entryPath).isFile());
  const dirPaths = entryPaths.filter(entryPath => !filePaths.includes(entryPath));
  const dirFiles = dirPaths.reduce((prev, curr) => prev.concat(readDir(curr)), []);
  const files = [...filePaths, ...dirFiles];
  return files.filter(f => !ignoreList.includes(path.basename(f)));
};

/**
 * Read json file and return a json object
 * @param {string} filePath 
 */
const readJsonFile = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
};

/**
 * Extract string between square brackets
 * @param {String} str 
 */
const inbetweenSquareBrackets = str => {
  return str.match(/\[(.*)\]/)[1];
};

module.exports = {
  readDir,
  readJsonFile,
  inbetweenSquareBrackets
};