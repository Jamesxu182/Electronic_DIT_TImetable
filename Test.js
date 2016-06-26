var http = require('http');

function getTimetablesJSON(response) {
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
      //parseTimetablesJSON(responseText);
      json = JSON.parse(responseJSON);

      for(var i = 0; i < json.objects.length; i++) {
          console.log(json.objects[i]);
      }
    });
  })
}


var response = ""
getTimetablesJSON(response);
console.log(response);
