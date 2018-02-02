/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
 
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC_j05FqAlB_c1GIeW54v_1x_2d1t_7iYE",
    authDomain: "train-scheduler-d6928.firebaseapp.com",
    databaseURL: "https://train-scheduler-d6928.firebaseio.com",
    projectId: "train-scheduler-d6928",
    storageBucket: "train-scheduler-d6928.appspot.com",
    messagingSenderId: "694153296789"
  };
  firebase.initializeApp(config);


var database = firebase.database();

// 2. Button for adding trains
$(document).on("click", "#add-train-btn", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDes = $("#destination-input").val().trim();
  var trainStart = $("#first-train-time-input").val().trim(); //UNIX time-stamp in seconds
  // var trainStart = moment($("#first-train-time-input").val().trim(), "HH:mm").format("X"); //UNIX time-stamp in seconds
  var trainFreq = $("#frequency-input").val().trim();
  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDes,
    train1: trainStart,
    frequency: trainFreq
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log("Train Starts: " + newTrain.train1);
  console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added!");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-time-input").val("");
  $("#frequency-input").val("");

});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  // console.log(childSnapshot.getKey())

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDes = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().train1;
  var trainFreq = childSnapshot.val().frequency;

  // train Info
  console.log(trainName);
  console.log(trainDes);
  console.log(trainStart);
  console.log(trainFreq);

  // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted  = moment(trainStart, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var trainRemainder = diffTime % trainFreq;
  console.log(trainRemainder);

  // Minute Until Train
  var minutesTillTrain = trainFreq - trainRemainder;
  console.log("MINUTES TILL TRAIN: " + minutesTillTrain); 

  // Next Train
  var nextTrain = moment().add(minutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Add each train's data into the table
  // $("#train-table, <tbody>").append("<tr><td>" + trainName + "</td><td>" + trainDes + "</td><td>" + firstTimeConverted + "</td><td>" + trainDes + "</td><td>" + trainFreq + "</td><td>" + nextTrain "</td><td>" + minutesTillTrain + "</td></tr>");
});



// Example Time Math
// -----------------------------------------------------------------------------
// Assume train start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use mets this test case
