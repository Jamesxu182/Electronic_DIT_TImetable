var http = require('http');
var fs = require('fs');

window.onload = function() {
  //check if the cache file
  fs.exists('cache/cache.json', function (exists) {
    //if the cache file exists
    if(exists) {
      //read json from local file
      getTimetablesFromLocalFile();
    } else {
      //get timetables json from internet
      getTimetablesFromInternet();
    }
  });
  //getTimetablesFromInternet();
  //getTimetablesFromLocalFile();
}

function getTimetablesFromLocalFile() {
  //read from local file
  fs.readFile('cache/cache.json', function(err, data) {
    //if error
    if(err) {
      //get timetables from internet
      getTimetablesFromInternet();
    } else {
      //get timetables from local file
      //parse json
      var json = JSON.parse(data);

      //clear timetables
      clearTimetables();

      //show timetables
      //===============
      //slow approach to insert html
      //for(var i = 0; i < json.objects.length; i++) {
      //    timetables.innerHTML += "<li class=\"list-group-item\">" + json.objects[i].courseName + "</li>";
      //}
      //===============
      // faster approach to insert html
      var tempHTML = [];

      for(var i = 0; i < json.objects.length; i++) {
        tempHTML.push("<li class=\"list-group-item\">" + json.objects[i].courseName + "</li>");
      }

      timetables.innerHTML = tempHTML.join('\n');
    }
  });
}

function getTimetablesFromInternet() {
  var timetables = document.getElementById('timetables');

  var options = {
    host: '104.131.54.124',
    path: '/timetables/courses.php'
  }

  http.get(options, function(res) {
    var responseJSON = "";

    res.on('data', function(chunk) {
      responseJSON += chunk;
    });

    res.on('end', function() {

      //write new json into cache file
      fs.writeFile('cache/cache.json', responseJSON, function(err) {
        if(err) {
          console.log(err);
        }
      });

      json = JSON.parse(responseJSON);

      //display in main surface
      //for(var i = 0; i < json.objects.length; i++) {
      //    timetables.innerHTML += "<li class=\"list-group-item\">" + json.objects[i].courseName + "</li>";
      //}

      //fast approach to display all of timetables
      var tempHTML = [];

      for(var i = 0; i < json.objects.length; i++) {
        tempHTML.push("<li class=\"list-group-item\">" + json.objects[i].courseName + "</li>");
      }

      timetables.innerHTML = tempHTML.join('\n');
    });
  });
}


function clearTimetables() {
  var timetables = document.getElementById('timetables');
  timetables.innerHTML = "";
}
