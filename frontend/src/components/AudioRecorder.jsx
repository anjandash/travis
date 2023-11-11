import React, { useState, useEffect } from 'react';

const AudioRecorder = () => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioData, setAudioData] = useState(null);
    const [transcription, setTranscription] = useState(null);
    const [newTranscription, setNewTranscription] = useState(false);

    const [startDest, setStartDest] = useState(null);
    const [endDest, setEndDest] = useState(null);
    const [numberOfPeople, setNumberOfPeople] = useState(null);

    const [startDestData, setStartDestData] = useState(null);
    const [endDestData, setEndDestData] = useState(null);

    const [estimateData, setEstimateData] = useState(null);

    function extractInformation(inputString) {
        // Regular expressions for extracting the required information
        const startDestPattern = /Start destination,?\s*(.*?)\s*End destination/i;
        const endDestPattern = /End destination,?\s*(.*?)\s*Number of people/i;
        const numberOfPeoplePattern = /Number of people,?\s*(.*)/i;

        // Extract information using regular expressions
        const startDestMatch = inputString.match(startDestPattern);
        const endDestMatch = inputString.match(endDestPattern);
        const numberOfPeopleMatch = inputString.match(numberOfPeoplePattern);

        // Retrieve the matched groups or return empty strings if no match found
        const startDest = startDestMatch ? startDestMatch[1] : "";
        const endDest = endDestMatch ? endDestMatch[1] : "";
        const numberOfPeople = numberOfPeopleMatch ? numberOfPeopleMatch[1] : "";

        return { startDest, endDest, numberOfPeople };
    }

    const handleStringNumberOfPeople = (numberOfPeople) => {
        console.log("====================================")
        console.log("Number of people is a string", numberOfPeople);

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
            const { startDest, endDest, numberOfPeople } = extractInformation(transcription);

            const numberOfPeopleInt = handleNumberOfPeople(numberOfPeople);

            if (numberOfPeopleInt === null) {
                alert("Number of people could not be recognized");
            } else {
                
                setStartDest(startDest);
                setEndDest(endDest);
                setNumberOfPeople(numberOfPeopleInt);
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
                console.log(startData);
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
                console.log(endData);
                setEndDestData(endData);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }, [endDest]);


    // useEffect(() => {
    //     if (isArray(startDestData) && isArray(endDestData) && startDestData.length > 0 && endDestData.length > 0) {
    //         console.log("====================================")
    //         console.log("Start and end destination data is set", startDestData, endDestData);
    //         console.log("====================================")


    //         if (isArray(startDestData) && isArray(endDestData) && startDestData.length > 0 && endDestData.length > 0) {

    //             const startDestDataString = startDestData[0].google_place_id;
    //             const endDestDataString = endDestData[0].google_place_id;

    //             console.log("====================================")
    //             console.log("Start and end destination data is set", startDestDataString, endDestDataString);
    //             console.log("====================================")
    //             console.log(typeof startDestDataString, typeof endDestDataString)
    //             console.log("====================================")


    //             fetch('https://dev.api.mooovex.com/hackathon/routedetails', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify({
    //                     "origin_google_place_id": startDestDataString,
    //                     "destination_google_place_id": endDestDataString,
    //                     "passenger_count": numberOfPeople,
    //                     "when": "now",
    //                     "language": "en"
    //                 })
    //             })
    //             .then(response => response.json())
    //             .then(estimateData => {
    //                 // Update state with the response data for end destination
    //                 console.log("FIN ------", estimateData);
    //                 setEstimateData(estimateData);
    //             })
    //             .catch(error => {
    //                 console.error('Error:', error);
    //             });
    //         } else {
    //             console.log("Start or end destination not set or is null", startDestData, endDestData);
    //         }

    //     }
    // }, [startDestData, endDestData]);


    useEffect(() => {
        if (startDestData && endDestData) {
            console.log("====================================")
            console.log("Start and end destination data is set", startDestData, endDestData);
            console.log("====================================")

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

            console.log("====================================")
            console.log("Start and end destination data is set", startDestDataString, endDestDataString);
            console.log("====================================")

            fetch('https://dev.api.mooovex.com/hackathon/routedetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "origin_google_place_id": startDestDataString,
                    "destination_google_place_id": endDestDataString,
                    "passenger_count": numberOfPeople,
                    "when": "now",
                    "language": "en"
                })
            })
            .then(response => response.json())
            .then(estimateData => {
                // Update state with the response data for end destination
                console.log("FIN ------", estimateData);
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
    
    setStartDestData(null);
    setEndDestData(null);


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
            console.log('Response Data:', responseData.data); // Access serialized data
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
      <button onClick={startRecording} style={{ backgroundColor: "whitesmoke", border: "1px solid grey" }}>Start Recording</button>
        <br />
      <button onClick={stopRecording} style={{ backgroundColor: "whitesmoke", border: "1px solid grey" }}>Stop Recording</button>

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
        </div>
      )}

        <hr />
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
            <p>Estimated distance: {estimateData.distanceMeters || "--"} metres</p>
            <p>Estimated duration: {estimateData.durationSeconds || "--"} seconds</p>
            <p>Estimated price: {estimateData.price || "--"} Euros</p>
        </div>
      )}

    </div>
  );
};

export default AudioRecorder;
