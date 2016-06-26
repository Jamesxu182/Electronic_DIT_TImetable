var http = require('http');

window.onload = function() {
  getTimetables();
}

function getTimetables() {
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
      json = JSON.parse(responseJSON);

      for(var i = 0; i < json.objects.length; i++) {
          timetables.innerHTML += "<li class=\"list-group-item\">" + json.objects[i].courseName + "</li>";
      }
    });
  });
}


function clearTimetables() {
  var timetables = document.getElementById('timetables');
  timetables.innerHTML = "";
}
