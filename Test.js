var http = require('http');
var fs = require('fs');

function getTimetablesFromInternet() {
  //var timetables = document.getElementById('timetables');

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
      json = JSON.parse(responseJSON);

      /*for(var i = 0; i < json.objects.length; i++) {
          timetables.innerHTML += "<li class=\"list-group-item\">" + json.objects[i].courseName + "</li>";
      }*/

      //write new json into cache file
      fs.writeFile('cache.json', responseJSON, function(err) {
        if(err) {
          console.log('write fail');
        } else {
          console.log('write successful');
        }
      });
    });
  });
}

getTimetablesFromInternet();
