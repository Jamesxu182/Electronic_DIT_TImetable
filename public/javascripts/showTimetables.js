var http = require('http');
var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

//global event emitter to generate event
var ee = new EventEmitter();

//global variable to store all of timetables information
var allTimetables = [];

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

  $('.btn').on('click', function() {
    var $this = $(this);
    $this.button('loading');
    ee.on('complete_load', function() {
      $this.button('reset');
    });
  });
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

      // show timetables
      //===============
      // slow approach to insert html
      // for(var i = 0; i < json.objects.length; i++) {
      //    timetables.innerHTML += "<li class=\"list-group-item\">" + json.objects[i].courseName + "</li>";
      //}
      //===============
      // faster approach to insert html
      var tempHTML = [];

      // clear all of timetables first
      allTimetables = [];

      for(var i = 0; i < json.objects.length; i++) {
        //temp variable to store each course name
        var tempItem = json.objects[i].courseName;
        // push each of course name into global variable for storage
        allTimetables.push(tempItem);
        // push to tempate variable for displaying
        tempHTML.push("<a class=\"list-group-item\">" + tempItem + "</a>");
      }

      // write all of content inside a target tag
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

      // faster approach to insert html
      var tempHTML = [];

      // clear all of timetables first
      allTimetables = [];

      for(var i = 0; i < json.objects.length; i++) {
        //temp variable to store each course name
        var tempItem = json.objects[i].courseName;
        // push each of course name into global variable for storage
        allTimetables.push(tempItem);
        // push to tempate variable for displaying
        tempHTML.push("<a class=\"list-group-item\">" + tempItem + "</a>");
      }

      // write all of content inside a target tag
      timetables.innerHTML = tempHTML.join('\n');

      //complete rewrite, send event
      ee.emit('complete_load');
    });
  });
}


function clearTimetables() {
  var timetables = document.getElementById('timetables');
  timetables.innerHTML = "";
}

function searchTimetable() {
  // get input element to get what user inputs
  var inputBar = document.getElementById('search');

  var searchContent = inputBar.value;

  //console.log(searchContent);

  // check if all of timetables are loaded completely
  if(allTimetables.length != 0) {
    var tempHTML = [];

    // iterate all of timetables and find matched timetables
    for(var i = 0; i < allTimetables.length; i++) {
      // if match, show in the main surface
      if(allTimetables[i].indexOf(searchContent) > -1) {
        tempHTML.push("<a class=\"list-group-item\">" + allTimetables[i] + "</a>");
      }
    }

    // write into target tag
    timetables.innerHTML = tempHTML.join('\n');
  }
}
