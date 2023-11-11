import React, { useState, useEffect } from 'react';

const AudioRecorder = () => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioData, setAudioData] = useState(null);
    const [transcription, setTranscription] = useState(null);
    const [newTranscription, setNewTranscription] = useState(false);

    const [startDest, setStartDest] = useState(null);
    const [endDest, setEndDest] = useState(null);
    const [numberOfPeople, setNumberOfPeople] = useState(null);

    const [dateString, setDateString] = useState(null);
    const [timeString, setTimeString] = useState(null);

    const [startDestData, setStartDestData] = useState(null);
    const [endDestData, setEndDestData] = useState(null);

    const [estimateData, setEstimateData] = useState(null);

    function formatTime(time) {
        // remove any commas or full stops
        time = time.replace(/,/g, "");
        time = time.replace(/\./g, "");


        // Remove all non-digit characters and pad the string to ensure it has at least 4 characters
        time = time.replace(/\D/g, "").padStart(4, "0");

        // Extract hours and minutes
        let hour = time.substring(0, 2);
        let minute = time.substring(2, 4);

        // Pad hours and minutes to 2 digits if necessary (this might be redundant after the padStart above)
        hour = hour.padStart(2, "0");
        minute = minute.padStart(2, "0");

        // Set seconds to "00"
        let second = "00";

        // Construct the time string in hh:mm:ss format
        const timeString = `${hour}:${minute}:${second}`;
        return timeString;
    }    

    function extractInformation(inputString) {
        // Regular expressions for extracting the required information
        const startDestPattern = /Start destination,?\s*(.*?)\s*End destination/i;
        const endDestPattern = /End destination,?\s*(.*?)\s*Number of people/i;
        const numberOfPeoplePattern = /Number of people,?\s*(.*?)\s*Date/i;
        const datePattern = /Date,?\s*(.*?)\s*Time/i;
        const timePattern = /Time,?\s*(.*?)\s*$/i;

        // Extract information using regular expressions
        const startDestMatch = inputString.match(startDestPattern);
        const endDestMatch = inputString.match(endDestPattern);
        const numberOfPeopleMatch = inputString.match(numberOfPeoplePattern);
        const dateMatch = inputString.match(datePattern);
        const timeMatch = inputString.match(timePattern);

        // Retrieve the matched groups or return empty strings if no match found
        const startDest = startDestMatch ? startDestMatch[1] : "";
        const endDest = endDestMatch ? endDestMatch[1] : "";
        const numberOfPeople = numberOfPeopleMatch ? numberOfPeopleMatch[1] : "";
        const date = dateMatch ? dateMatch[1] : "";
        const time = timeMatch ? timeMatch[1] : "";

        // convert the date as string yyyy-mm-dd
        // input date: 17th October 2024
        // output date: 2024-10-17
        const dateArray = date.split(" ");
        const day = dateArray[0].replace(/\D/g, "");
        const month = dateArray[1];
        const year = dateArray[2];

        // remove commas and full stops from year
        const yearNoComma = year.replace(/,/g, "");
        const yearNoFullStop = yearNoComma.replace(/\./g, "");




        let monthNumber = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;

        // if the month number is less than 10, add a 0 in front
        if (monthNumber < 10) {
            monthNumber = "0" + monthNumber;
        }
        
        const dateString = `${yearNoFullStop}-${monthNumber}-${day}`;


        // convert the time as string hh:mm:ss
        // set seconds to 00
        // input time: 1030 or 11:20 or 17.30
        // output time: 10:30:00 or 11:20:00 or 17:30:00
        const timeString = formatTime(time);
        

        console.log("====================================")
        console.log(dateString, timeString);
        console.log("====================================")


        return { startDest, endDest, numberOfPeople, dateString, timeString };
    }

    const handleStringNumberOfPeople = (numberOfPeople) => {
        // console.log("====================================")
        // console.log("Number of people is a string", numberOfPeople);

        // convert the string to lowercase
        numberOfPeople = numberOfPeople.toLowerCase();

        // strip the string of extra spaces
        numberOfPeople = numberOfPeople.trim();

        // remove any commas or full stops
        numberOfPeople = numberOfPeople.replace(/,/g, "");
        numberOfPeople = numberOfPeople.replace(/\./g, "");

        // check if the string contains a number
        if (/\d/.test(numberOfPeople)) {
            // if it contains a number, return the number
            return parseInt(numberOfPeople);
        } else {
            if (numberOfPeople === "one") {
                return 1;
            } else if (numberOfPeople === "two") {
                return 2;
            } else if (numberOfPeople === "three") {
                return 3;
            } else if (numberOfPeople === "four") {
                return 4;
            } else if (numberOfPeople === "five") {
                return 5;
            } else if (numberOfPeople === "six") {
                return 6;
            } else if (numberOfPeople === "seven") {
                return 7;
            } else if (numberOfPeople === "eight") {
                return 8;
            } else {
                return null;
            }
        }
    }


    const handleNumberOfPeople = (numberOfPeople) => {
        // check if the number of people is a number or a string
        if (typeof numberOfPeople === "number") {
            return numberOfPeople;
        } else if (typeof numberOfPeople === "string") {
            return handleStringNumberOfPeople(numberOfPeople);
        }
    }
    
    useEffect(() => {
        if (newTranscription) {
            const { startDest, endDest, numberOfPeople, dateString, timeString } = extractInformation(transcription);

            const numberOfPeopleInt = handleNumberOfPeople(numberOfPeople);

            if (numberOfPeopleInt === null) {
                alert("Number of people could not be recognized");
            } else {
                
                setStartDest(startDest);
                setEndDest(endDest);
                setNumberOfPeople(numberOfPeopleInt);

                setDateString(dateString);
                setTimeString(timeString);
            }
        }
    }, [newTranscription]);

    useEffect(() => {
        if (startDest) {
            fetch('https://dev.api.mooovex.com/hackathon/autocomplete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: startDest,
                    language: 'en'
                })
            })
            .then(response => response.json())
            .then(startData => {
                // Update state with the response data for start destination
                // console.log(startData);
                setStartDestData(startData);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }, [startDest]);

    useEffect(() => {
        if (endDest) {
            fetch('https://dev.api.mooovex.com/hackathon/autocomplete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: endDest,
                    language: 'en'
                })
            })
            .then(response => response.json())
            .then(endData => {
                // Update state with the response data for end destination
                // console.log(endData);
                setEndDestData(endData);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }, [endDest]);


    useEffect(() => {
        if (startDestData && endDestData) {
            // console.log("====================================")
            // console.log("Start and end destination data is set", startDestData, endDestData);
            // console.log("====================================")

            let startDestDataString = null;
            let endDestDataString = null;

            if (startDestData.length > 0) {
                startDestDataString = startDestData[0].google_place_id;
            } 
            // else {
            //     alert("Multiple start destinations could be recognized");
            //     return;
            // }


            if (endDestData.length > 0) {
                endDestDataString = endDestData[0].google_place_id;
            } 
            // else {
            //     alert("Multiple end destinations could be recognized");
            //     return;
            // }

            // console.log("====================================")
            // console.log("Start and end destination data is set", startDestDataString, endDestDataString);
            // console.log("====================================")

            fetch('https://dev.api.mooovex.com/hackathon/routedetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "origin_google_place_id": startDestDataString,
                    "destination_google_place_id": endDestDataString,
                    "passenger_count": numberOfPeople,
                    "when": {
                        "date": dateString,
                        "time": timeString
                    },
                    "language": "en"
                })
            })
            .then(response => response.json())
            .then(estimateData => {
                // Update state with the response data for end destination
                // console.log("FIN ------", estimateData);
                setEstimateData(estimateData);
            })
            .catch(error => {
                console.error('Error:', error);
            });



        }
    }, [startDestData, endDestData]);



  const startRecording = async () => {
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    setTranscription("Recording...");
    setNewTranscription(false);

    setStartDest(null);
    setEndDest(null);
    setNumberOfPeople(null);

    setDateString(null);
    setTimeString(null);
    
    setStartDestData(null);
    setEndDestData(null);

    setEstimateData(null);


    const audioChunks = [];
    recorder.ondataavailable = event => audioChunks.push(event.data);
    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks);
      setAudioData(audioBlob);
      sendAudioToServer(audioBlob);
    };

    recorder.start();
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    setAudioData(null);
    setTranscription("Processing audio ...");
    setNewTranscription(false);
  };

  const sendAudioToServer = async (audioBlob) => {
    const formData = new FormData();
    // add time stamp to file name
    const fileName = 'audio-recording-' + new Date().getTime() + '.file';
    formData.append('audio', audioBlob);
    formData.append('title', fileName);
    formData.append('body', 'This is an audio recording');

    try {
      const response = await fetch('http://localhost:8000/api/posts/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();

        if (response.ok) {
            // console.log('Response Data:', responseData.data); // Access serialized data
            setTranscription(responseData.transcription); // Display success message
            setNewTranscription(true);
            // alert(responseData.transcription); // Display success message
        } else {
        console.error('Upload failed due to an error');
        }
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error sending audio to server:', error);
    }
  };

  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }}>
        <br />
      <button onClick={startRecording} style={{ 
        backgroundColor: "green", 
        border: "0px solid whitesmoke", 
        height: "100px", 
        color: "whitesmoke",
        boxShadow: "2px 2px 8px -4px rgba(0,0,0,0.5)", 
        }}>
            Start Recording
      </button>
        <br />
      <button onClick={stopRecording} style={{ 
        backgroundColor: "orangered", 
        border: "0px solid whitesmoke", 
        height: "100px", 
        color: "whitesmoke",
        boxShadow: "2px 2px 8px -4px orangered",
        }}>
            Stop Recording
        </button>

      <hr />
      {audioData && (
        <audio controls>
          <source src={URL.createObjectURL(audioData)} />
        </audio>
      )}
      <hr />

        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <h2>Transcription</h2>
            <p>{transcription}</p>
        </div>

      <hr />

      {newTranscription && transcription && (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: "1px solid red",
            borderRadius: "5px",
            minWidth: "600px",            
        }}>
            <h2>New Transcription has been found! </h2>
            <p>Recognized Start Destination field: {startDest} </p>
            <p>Recognized End Destination field: {endDest} </p>
            <p>Recognized Number of People field: {numberOfPeople}</p>
            <p>Recognized Date field: {dateString}</p>
            <p>Recognized Time field: {timeString}</p>
        </div>
      )}

        <hr />


      {/* {estimateData && (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: "1px solid gold",
            borderRadius: "5px",
            minWidth: "600px",
        }}>
            <h2>Estimate Data</h2>
            <p>Estimated distance: {estimateData.distanceMeters || "--"} metres</p>
            <p>Estimated duration: {estimateData.durationSeconds || "--"} seconds</p>
            <p>Estimated price: {estimateData.price || "--"} Euros</p>
        </div>
      )} */}

        {estimateData && (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: "1px solid gold",
                borderRadius: "5px",
                minWidth: "600px",
            }}>
                <h2>Estimate Data</h2>
                <p>Estimated distance: {estimateData.distanceMeters ? (estimateData.distanceMeters / 1000).toFixed(2) : "--"} kilometers</p>
                <p>Estimated duration: {
                    estimateData.durationSeconds ? 
                    `${Math.floor(estimateData.durationSeconds / 3600)} hours and ${(estimateData.durationSeconds % 3600 / 60).toFixed(0)} minutes` : 
                    "--"
                }</p>
                <p>Estimated price: {estimateData.price || "--"} Euros</p>
            </div>
        )}


    </div>
  );
};

export default AudioRecorder;
