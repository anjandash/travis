import React, { useState } from 'react';

const AudioRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioData, setAudioData] = useState(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

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
        alert(responseData.transcription); // Display success message
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
      <button onClick={startRecording} style={{ backgroundColor: "whitesmoke", border: "1px solid grey" }}>Start Recording</button>
      <button onClick={stopRecording} style={{ backgroundColor: "whitesmoke", border: "1px solid grey" }}>Stop Recording</button>

      <hr />
      {audioData && (
        <audio controls>
          <source src={URL.createObjectURL(audioData)} />
        </audio>
      )}
    </div>
  );
};

export default AudioRecorder;
