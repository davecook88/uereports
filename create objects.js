var UE_USER_REPORT = "********";
var REPORT_SHEET_ID = "********";
var COMPANY_SHEET_ID = "********";
var d = new Date;
var levels = ['Starter','Elementary','Pre-Intermediate','Intermediate','Upper Intermediate','Advanced']

function createStudentsObject() {
  var folderName = "Students API call";
  var savedJson = getJsonFromFile(folderName, formatDate());

  if (savedJson) {
    return savedJson;
  }

  var headers = {
    'Authorization': 'Basic SmhDRlZMa0d6VTJYSFhKRnd5dGwzYmNBYWtQQmlJOg=='
    }
  var options =
      {
        "method" : "get",
        "headers": headers,
      };
  var url = "https://uestudy.talentlms.com/api/v1/users";

  var response = UrlFetchApp.fetch(url,options);
  var responseText = response.getContentText();
  var responseJson = JSON.parse(responseText);

  writeJsonToFile(folderName, formatDate(), responseJson);
  return responseJson;
}

function getCompaniesObj() {
  var companiesObj = {};
  var sheet = SpreadsheetApp.openById(COMPANY_SHEET_ID);
  var lr = sheet.getLastRow() - 1;
  var row = 0;
  var data = sheet.getDataRange().getValues();

  while (row < lr) {
    var col = 1;
    var name = data[row][0];
    var id = [];
    var idRng = data[row][col];

    while (idRng) {
      id.push(idRng);
      col++;
      idRng = data[row][col];
    }

    var c = new Company(name, id);
    companiesObj[name] = c;

    row++;
  }
  return companiesObj
}

function getStudentObj() {
  var sheet = SpreadsheetApp.openById(REPORT_SHEET_ID);
  var row = 1;
  var lr = sheet.getLastRow();
  var studentObj = {
    "emailKey":{},
  };
  var data = sheet.getDataRange().getValues();
  var columnNumbers = getColumnNumbers(data);
  var folioCol = columnNumbers["Student ID"];
  var fNameCol = columnNumbers["Name"];
  var hoursCol = columnNumbers["Completed"];
  var lNameCol = columnNumbers["Last Name"];
  var companyCol = columnNumbers["Company"];
  var levelCol = columnNumbers["Level"];
  var emailCol = columnNumbers["Email"];

  while (row < lr) {
    var folio = data[row][folioCol];
    var name = data[row][lNameCol] + "," + data[row][fNameCol];
    var company = data[row][companyCol];
    var level = data[row][levelCol];
    var hours = data[row][hoursCol];
    var email = data[row][emailCol];

    var s = new Student(name,folio,company,hours,level,email);
    studentObj[s.folio] = s;
    studentObj.emailKey[s.email] = s.folio;
    row++;
  }
  return studentObj;
}

function getColumnNumbers(data){
  var lc = data[0].length;
  var columnHeaders = {};
  for (var i = 0; i < lc; i++) {
    var content = data[0][i];
    columnHeaders[content] = i;
  }
  return columnHeaders;
}




function combineStudentObjects() {
  var folderName = "Combined Students";
  var savedJson = getJsonFromFile(folderName, formatDate());

  if (savedJson) {
    return savedJson;
  }

  var students = getStudentObj();
  var userJson = createStudentsObject();
  var oCourses = getCoursesObj();
  students.lmsKey = {};

  for (var i = 0; i < userJson.length; i++) {
    var lmsFolio = userJson[i].custom_field_1;
    if (lmsFolio in students) {
      students[lmsFolio].lmsLastLogin = userJson[i].last_updated_timestamp;
      students[lmsFolio].lmsID = userJson[i].id;
      students.lmsKey[userJson[i].id] = students[lmsFolio].folio;
    } else {
      if (userJson[i].email in students.emailKey) {
        var folioNumber = students.emailKey[userJson[i].email];
        students[folioNumber].lmsLastLogin = userJson[i].last_updated_timestamp;
        students[folioNumber].lmsID = userJson[i].id;
        students.lmsKey[userJson[i].id] = folioNumber;
      }
    }
  }

  students = calculateProgress2(students, oCourses);
  writeJsonToFile(folderName,formatDate(),students);
  return students
}

function calculateProgress2(students, courses) {

  for (var i = 0; i < levels.length; i++){
    var level = levels[i];
    var oCourseLevel = courses[level];

    for (var c in oCourseLevel) {
      var class = oCourseLevel[c];

      for (var r in class) {
        var record = class[r];
        var recordUserId = record.user_id;
        if (recordUserId in students.lmsKey && record.status == "Completed") {
          var userFolio = students.lmsKey[recordUserId];
          var student = students[userFolio];
          var currentProgress = student.progress[level];
          if(!currentProgress) {currentProgress = 0}
          if (level != "Pre-Intermediate" || c > 19) {
            currentProgress ++;
          }else{
            currentProgress += 0.5;
          }
          student.progress[level] = currentProgress;
        }
      }
    }
  }

  return students;
}
