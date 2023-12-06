import { useState, useEffect } from 'react';

function Testcode() {

  const [mediaRecorder, setMediaRecorder] = useState(null);  
  const [audioURL, setAudioURL] = useState('');

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        
        recorder.addEventListener("dataavailable", event => {
          setAudioURL(URL.createObjectURL(event.data));
        });

        setMediaRecorder(recorder);
      });
  }, []);
   
  const toggleRecording = () => {
    if(mediaRecorder.state === "recording") {
      stopRecording();
    } else {
      startRecording();
    }
  }

  const startRecording = () => {
    mediaRecorder.start();  
  }

  const stopRecording = () => {
    mediaRecorder.stop();
  }

  return (
    <div>
      <i
        className="info-icon"
        onClick={toggleRecording}>
        i  
      </i>
      
      {audioURL && 
        <audio controls src={audioURL} />
      }
    </div>
  );
}

export default Testcode