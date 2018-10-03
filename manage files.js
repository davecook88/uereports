
function getJsonFromFile(folderName, fileName) {
  var folders = DriveApp.getFoldersByName(folderName);
  
  if (!folders.hasNext()){
    return false;
  }
  var folder = folders.next();
  var files = folder.getFilesByName(fileName + ".json");
  
  if (!files.hasNext()){
    return false;
  }
  
  var file = files.next();
  var fileName = file.getName();

  var jsonResult =  file.getAs('application/json').getDataAsString();
  return JSON.parse(jsonResult)
}

function writeJsonToFile(folderName, fileName, j) {
  var folder = DriveApp.getFoldersByName(folderName).next();
  folder.createFile(fileName + ".json", JSON.stringify(j));
}

function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}