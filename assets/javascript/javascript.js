// Document.ready(function(){


// var config = {
//     apiKey: "AIzaSyCdo4v-fZxWL-VF5hd5rriIguMdOZbp4Xs",
//     authDomain: "train-schedule-activity-55e1a.firebaseapp.com",
//     databaseURL: "https://train-schedule-activity-55e1a.firebaseio.com",
//     projectId: "train-schedule-activity-55e1a",
//     storageBucket: "train-schedule-activity-55e1a.appspot.com",
//     messagingSenderId: "731906234293"
//   };
//   firebase.initializeApp(config);



// // Assumptions
// var tFrequency = 3;

// // Time is 3:30 AM
// var firstTime = "03:30";

// // First Time (pushed back 1 year to make sure it comes before current time)
// var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
// console.log(firstTimeConverted);

// // Current Time
// var currentTime = moment();
// console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// // Difference between the times
// var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
// console.log("DIFFERENCE IN TIME: " + diffTime);

// // Time apart (remainder)
// var tRemainder = diffTime % tFrequency;
// console.log(tRemainder);

// // Minute Until Train
// var tMinutesTillTrain = tFrequency - tRemainder;
// console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// // Next Train
// var nextTrain = moment().add(tMinutesTillTrain, "minutes");
// console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


// });


var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";


var elTrain = $("#train-name");
var elTrainDestination = $("#train-destination");

var elTrainTime = $("#train-time");
var elTimeFreq = $("#time-freq");
// .mask("00:00");
// .mask("00");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCdo4v-fZxWL-VF5hd5rriIguMdOZbp4Xs",
    authDomain: "train-schedule-activity-55e1a.firebaseapp.com",
    databaseURL: "https://train-schedule-activity-55e1a.firebaseio.com",
    projectId: "train-schedule-activity-55e1a",
    storageBucket: "train-schedule-activity-55e1a.appspot.com",
    messagingSenderId: "731906234293"
  };
  firebase.initializeApp(config);



var database = firebase.database();

database.ref("/trains").on("child_added", function(snapshot) {

    
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    
    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    
    trainRemainder = trainDiff % frequency;

    
    minutesTillArrival = frequency - trainRemainder;

    
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    
    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();

    // Hover view of delete button
    $("tr").hover(
        function() {
            $(this).find("span").show();
        },
        function() {
            $(this).find("span").hide();
        });

    // // STARTED BONUS TO REMOVE ITEMS ** not finished **
    // $("#table-data").on("click", "tr span", function() {
    //     console.log(this);
    //     var trainRef = database.ref("/trains/");
    //     console.log(trainRef);
    // });
});


var storeInputs = function(event) {
    
    event.preventDefault();

    
    trainName = elTrain.val().trim();
    trainDestination = elTrainDestination.val().trim();
    trainTime = moment(elTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = elTimeFreq.val().trim();

   
    database.ref("/trains").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    
    alert("Train added!");

   
    elTrain.val("");
    elTrainDestination.val("");
    elTrainTime.val("");
    elTimeFreq.val("");
};


$("#btn-add").on("click", function(event) {
    
    if (elTrain.val().length === 0 || elTrainDestination.val().length === 0 || elTrainTime.val().length === 0 || elTimeFreq === 0) {
        alert("Please Fill All Required Fields");
    } else {
       
        storeInputs(event);
    }
});


$('form').on("keypress", function(event) {
    if (event.which === 13) {
        
        if (elTrain.val().length === 0 || elTrainDestination.val().length === 0 || elTrainTime.val().length === 0 || elTimeFreq === 0) {
            alert("Please Fill All Required Fields");
        } else {
            
            storeInputs(event);
        }
    }
});

