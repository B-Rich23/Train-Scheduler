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
  var trainStart = $("#first-train-time-input").val().trim();
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

  // Arrival Time
  var arrivalTime = moment(nextTrain).format("hh:mm");
  console.log("ARRIVAL TIME: " + arrivalTime);


  // Add each train's data into the table
  $("tbody").append("<tr><td>" + trainName + "</td><td>" + trainDes + "</td><td>" + trainFreq + "</td><td>" + arrivalTime + "</td><td>" + minutesTillTrain + "</td></tr>");
});
