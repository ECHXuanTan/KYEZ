import { useState, useEffect } from 'react';
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';

export function sttFromMic() {

    const [isListening, setIsListening] = useState(false);  
  const [transcripts, setTranscripts] = useState([]);
}