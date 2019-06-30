const fs = require('fs');
const path = require('path');

/**
 * Read all files and sub directories given a directory path
 * @param {string} dir 
 */
const readDir = dir => {
  if (!fs.existsSync(dir)) return [];
  const entryPaths = fs.readdirSync(dir).map(entry => path.join(dir, entry));
  const filePaths = entryPaths.filter(entryPath => fs.statSync(entryPath).isFile());
  const dirPaths = entryPaths.filter(entryPath => !filePaths.includes(entryPath));
  const dirFiles = dirPaths.reduce((prev, curr) => prev.concat(readDir(curr)), []);
  return [...filePaths, ...dirFiles];
};

module.exports = {
  readDir
};