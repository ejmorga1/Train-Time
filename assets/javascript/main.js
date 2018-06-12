$(document).ready(function () {


    // Firebase
    var config = {
        apiKey: "AIzaSyCIq6fjRpCrZXzVgAkykb6HrfVOsO5DyK8",
        authDomain: "train-time-81d1a.firebaseapp.com",
        databaseURL: "https://train-time-81d1a.firebaseio.com",
        projectId: "train-time-81d1a",
        storageBucket: "",
        messagingSenderId: "390402414500"
    };
    firebase.initializeApp(config);
    var database = firebase.database();


    //Add new train
    $("#add-train-btn").on("click", function (event) {
        event.preventDefault();
        var newTrain = {
            name: $("#train-name-input").val().trim(),
            destination: $("#destination-input").val().trim(),
            time: moment().format("DD-MM-YYYY") + " " + moment($("#train-time-input").val().trim(), "HH:mm").format("hh:mm A"),
            frequency: $("#frequency-input").val().trim() * (1000 * 60)
        };
        database.ref().push(newTrain);
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#train-time-input").val("");
        $("#frequency-input").val("");
    });



    //Display train time schedule and make calculations
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {
        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var trainFrequency = childSnapshot.val().frequency;
        var frequencyDisplay = trainFrequency / (1000 * 60)
        var trainTime = moment(childSnapshot.val().time, "DD-MM-YYYY hh:mm A").utc();
        var currentTime = moment();
        var nextArrival;
        var i = 0;
        var next = function () {
            x = (i * trainFrequency) + trainTime;
            if (x >= currentTime) {
                nextArrival = x;
                return nextArrival;
            } else {
                i++;
                next();
            }
        };
        next();
        var minutesAway = (-1) * moment().diff(nextArrival, "minutes") + 1;
        nextArrival = moment(nextArrival).format("hh:mm A");
        $("#currentTrainSchedule > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + frequencyDisplay + " min</td><td>" + nextArrival + "</td><td>" + minutesAway + " min</td></tr>");
    });


});