function Student(name,folio,company,hours,level, email) {
  var name;
  var folio;
  var company;
  var hours;
  var level;
  var lmsLastLogin;
  var lmsId;
  var email;
  var progress;
  var thisMonth;
  this.name=name;
  this.folio=folio;
  this.company=company;
  this.hours=hours;
  this.level=level;
  this.email = email;
  this.progress={};
}




function Company(name, sheetID) {
  var name;
  var sheetID;
  this.name=name;
  this.sheetID=sheetID;  
}
