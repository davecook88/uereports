var headers =
    {
      'Authorization': 'Basic ********=='
    };

var options =
    {
      "method" : "get",
      "headers": headers,
    };

var baseUrl = "https://uestudy.talentlms.com/api/v1/getusersprogressinunits/unit_id:";

var codes = {
  "Starter":{
    0: "1817",
    1: "1819",
    2: "1820",
    3: "1821",
    4: "1822",
    5: "1823",
    6: "1824",
    7: "1825",
    8: "1826",
    9: "1827",
    10: "1828",
    11: "1829",
    12: "1830",
    13: "1831",
    14: "1832"
  },
  "Elementary":{
    0: "1833",
    1: "1834",
    2: "1835",
    3: "1836",
    4: "1837",
    5: "1838",
    6: "1839",
    7: "1840",
    8: "1841",
    9: "1842",
    10: "1843",
    11: "1844",
    12: "1845",
    13: "1846",
    14: "1847"
  },
  "Pre-Intermediate":{
    0: "1848",
    1: "1849",
    2: "1850",
    3: "1851",
    4: "1852",
    5: "1853",
    6: "1854",
    7: "1855",
    8: "1856",
    9: "1857",
    10: "1858",
    11: "1859",
    12: "1859",
    13: "1860",
    14: "1861",
    15: "1862",
    16: "1863",
    17: "1864",
    18: "1865", // last half point unit
    19: "1866",
    20: "1867",
    21: "1868",
    22: "1869",
    23: "1870",
    24: "1871",
  },
  "Intermediate": {
    0:"1872",
    1:"1873",
    2:"1874",
    3:"1875",
    4:"1876",
    5:"1877",
    6:"1878",
    7:"1879",
    8:"1880",
    9:"1881",
    10:"1882",
    11:"1883",
    12:"1884",
    13:"1885",
    14:"1886"
  },
  "Upper Intermediate":{
    0: "1903",
    1: "1904",
    2: "1906",
    3: "1907",
    4: "1908",
    5: "1909",
    6: "1910",
    7: "1911",
    8: "1912",
    9: "1913",
    10: "1914",
    11: "1915",
    12: "1916",
    13: "1917",
    14: "1918"
  },
  "Advanced":{
    0: "1887",
    1: "1888",
    2: "1889",
    3: "1890",
    4: "1891",
    5: "1892",
    6: "1893",
    7: "1894",
    8: "1896",
    9: "1895",
    10: "1897",
    11: "1898",
    12: "1899",
    13: "1901",
    14: "1902"
  }
}


function getCoursesObj() {
  var folderName = "LMS reports";

  var savedJson = getJsonFromFile(folderName, formatDate());

  if (savedJson) {
    return savedJson;
  }

  var oCourseProgress = {};

  for (var level in codes) {
    oCourseProgress[level] = {};
    for (var class in codes[level]) {
      var url = baseUrl + codes[level][class];
      var response = UrlFetchApp.fetch(url,options);
      oCourseProgress[level][class] = JSON.parse(response.getContentText());
    }
  }
  writeJsonToFile(folderName, formatDate(), oCourseProgress);
  return oCourseProgress;
}
