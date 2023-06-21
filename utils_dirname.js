const path = require("path");

function getDirectoryName(filePath) {
  return path.dirname(filePath);
}

module.exports = {
  getDirectoryName,
};
