const xlsx = require("xlsx");
const fs = require("fs");

function writeInExcel(workBookPath, playerName, data) {
  // Generating a new WB
  const workB = xlsx.utils.book_new();

  // Generating a new WS
  const workS = xlsx.utils.json_to_sheet(data);

  // Adding the sheet to the workbook with name as : {Player Name}
  xlsx.utils.book_append_sheet(workB, workS, playerName);

  // Creating the excel as : IPL 2021/{Team Name}/{Player Name}.xlsx
  xlsx.writeFile(workB, workBookPath);
}

function readFromExcel(workBookPath, playerName) {
  if (!fs.existsSync(workBookPath)) {
    // if the workbook doesn't exist, return empty array
    return [];
  }

  // Reading the workbook at the given path
  const workBook = xlsx.readFile(workBookPath);

  // Getting the sheet data of the sheet with name : {Player Name}
  const workSheet = workBook.Sheets[playerName];

  const data = xlsx.utils.sheet_to_json(workSheet);

  // Returing the old data back as an array of objects

  return data;
}

module.exports = {
  writeInExcel: writeInExcel,
  readFromExcel: readFromExcel,
};
