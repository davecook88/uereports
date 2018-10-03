var UE_USER_REPORT = "********";

function inHouse(){
  var students = combineStudentObjects();
  var companies = getCompaniesObj();
//  var oCourses = getCoursesObj();

  for(var k in companies) {
    var company = companies[k];
    var sheetIDs = company.sheetID;

    if(sheetIDs.length){
      for (var id = 0; id < sheetIDs.length; id++) {
        var wb = SpreadsheetApp.openById(sheetIDs[id]);
        Logger.log(wb.getName());
        sheetsList = getInHouseSheet(wb);

        for (var j = 0; j < sheetsList.length; j++){
          var ss = sheetsList[j];
          Logger.log(ss.getName());
          insertData(students, ss);
        }
      }

    }
  }
}

function insertData(studentObj, ss, coursesObj) {
  var lr = ss.getLastRow();
  var data = ss.getDataRange().getValues();
  for (var i = 8; i <= lr; i++){

    var folio = ss.getRange("A" + i).getValue();
    if (!folio){continue;}
    if (folio == "Q"){continue;}
    try {
      if(typeof(folio) == "string"){
        folio = folio.match(/\d/g).join("");
      }
    }
    catch(error) {
      Logger.log(error);
      continue;
    }


    if(studentObj.hasOwnProperty(folio)){

      var ranges = {
        "hours": ss.getRange("F" + i),
        "participation": ss.getRange("G" + i),
        "online": ss.getRange("H" + i),
      }

      var student = studentObj[folio];
      var loggedInThisMonth = hasLoggedInThisMonth(student.lmsLastLogin);


      var hoursPercent= student.hours / data[i - 1][4];
      var participationGrade = academicParticipationGrade(hoursPercent);

      ranges.hours.setValue(student.hours);
      ranges.participation.setValue(participationGrade);

      if (loggedInThisMonth){
        var percentageOnline = calculateOnlinePercentage(student);
        ranges.online.setValue(percentageOnline);
      } else {
        ranges.online.setValue(0);
      }


    }
  }
  function calculateOnlinePercentage(s) {
    var sLevel;
    if (s.level == "Fluency") {
      return "N/A";
    } else if (s.level == "Advanced Grad") {
      sLevel = "Advanced"
    } else {
      sLevel = s.level;
    }
    var participation = student.progress[sLevel];
    if(!participation) {
      return 0;
    }
    return participation / 4;

  }
}

function hasLoggedInThisMonth(timestamp){
  var date = new Date
  var lastLogin = new Date(timestamp);
  var firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  if (lastLogin < firstOfMonth) {
    return false;
  }
  return true;
}

function getInHouseSheet(workbook){
  var sheetsList = [];
  workbook.getSheets().forEach(function(s){
    var sheetName = s.getName().toLowerCase();
    if (sheetName.indexOf ("in-house") > -1) {
        sheetsList.push(s);
    }
  })
  return sheetsList;
}

function academicParticipationGrade(n) {
  if (n == 0) {
    return 0;
  }
  if (n < 0.2) {
    return randomize(0.3);
  }
  else if (n < 0.3) {
    return randomize(0.4);
  }
  else if (n < 0.4) {
    return randomize(0.5);
  }
  else if (n < 0.5) {
    return randomize(0.6);
  }
  else if (n < 0.6) {
    return randomize(0.65);
  }
  else if (n < 0.7) {
    return randomize(0.75);
  }
  else if (n < 0.8) {
    return randomize(0.8);
  }
  else if (n < 0.9) {
    return randomize(0.9);
  }
  else if (n < 1) {
    return randomize(0.95);
  }
  return randomize(0.95);

  function randomize(x){
    var random = Math.floor(Math.random() * 2);
    if (!random) {
      var random2 = Math.floor(Math.random() * 2);
      if (!random2) {
        return x + 0.05;
      } else {
        return x - 0.05;
      }
    }
    return x;
  }
}
