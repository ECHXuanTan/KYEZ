import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Container } from 'reactstrap';
import { Button, Card, Form} from 'react-bootstrap'
import '../styles/TestScreen.css'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listTestDetails } from '../actions/testActions'
import { getTokenOrRefresh } from '../actions/testActions';
import { storage } from '../firebase';
import { ref,  uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from "uuid";

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')


function TestScreen() {
    const dispatch = useDispatch()
    const testDetails = useSelector(state => state.testDetails)
    const { loading, error, test } = testDetails
    const { id } = useParams();

    useEffect(() => {
        dispatch(listTestDetails(id))
      }, [dispatch, id]);

    const [showQ1, setShowQ1] = useState(true);
    const [showQ2, setShowQ2] = useState(false);

    

    //speech to text
    const [recognizing, setRecognizing] = useState(false);
    const [recognizer, setRecognizer] = useState();  
    const [mediaRecorder, setMediaRecorder] = useState(null);  
    const [audioURL, setAudioURL] = useState('');
    const [texts, setTexts] = useState([]);
    const [duplicates, setDuplicates] = useState([]);
    const [uniqueWords, setUniqueWords] = useState(new Set());
    const [audioUploadURL, setAudioUploadURL] = useState('');
    // Test time
  
    const [testState, setTestState] = useState('preparation');

    // Timers  
    const [prepTime, setPrepTime] = useState(300); 
    const [testTime, setTestTime] = useState(120);

    // UI Elements
    const [showStart, setShowStart] = useState(true);
    const [showNext, setShowNext] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [curQuestion, setCurQuestion] = useState(1);


    useEffect(() => {
    
      let timer;
  
      if(testState === 'preparation' && prepTime > 0 ) {
        timer = setTimeout(() => {
          setPrepTime(time => time - 1);
        }, 1000);
  
      } else if(testState === 'inProgress' && testTime > 0) {
        timer = setTimeout(() => {  
          setTestTime(time => time - 1);
        }, 1000);
  
      } else if(testState === 'inProgress' && testTime === 0) {
        completeTest();
      }
  
      return () => clearTimeout(timer);
  
    }, [testState, prepTime, testTime]);

    useEffect(() => {

      if(testState === 'preparation' && prepTime === 0) {
        startTest();
      }
    
    }, [testState, prepTime]);

    function startTest() {
      setShowStart(false);
      setTestState('inProgress');
      sttFromMic();
      toggleRecording();
    }
    
    function nextQuestion() {
      setShowQ1(false);
      setShowQ2(true);
      setTestTime(120);
      setPrepTime(300);
      setTexts([]);
      setShowNext(false);
      setShowResults(false);
      setTestState('preparation');
      setShowStart(true); 
      setCurQuestion(cur => cur + 1);
    }
  
    function completeTest() {
      sttFromMic();
      toggleRecording();
      setTestState('completed');
      setShowNext(true);
      setShowResults(true);
    }

    //////////////////////////////////////////////////////////// Test time

    useEffect(() => {
        async function initialize() {
        const tokenObj = await getTokenOrRefresh();
        const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
        speechConfig.speechRecognitionLanguage = 'zh-CN';
        
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
        
        setRecognizer(recognizer);
        }
      
          initialize();
      }, []);

      useEffect(() => {

        if(recognizer) {
          recognizer.recognized = (s, e) => {
            setTexts(prevTexts => [...prevTexts, e.result.text]);
          };
          
          recognizer.canceled = stopRecognizing;
        }
        
        return stopRecognizing;
      }, [recognizer]);


      function sttFromMic() {
        if (!recognizing) {
          setRecognizing(true);
          // setTexts([]);
          
          recognizer.startContinuousRecognitionAsync();
        } else {
          stopRecognizing();
        }
      }
    
      function stopRecognizing() {
        if (recognizer) {
          recognizer.stopContinuousRecognitionAsync(
            () => {
              setRecognizing(false);
              // setTexts("");
            //   setRecognizer(null);  
            },
            err => {
              console.error("Failed to stop recorder", err)
            }
          );
        } 
      }

      
      //record audio
      useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            const recorder = new MediaRecorder(stream);
            
            recorder.addEventListener("dataavailable", event => {
              setAudioURL(URL.createObjectURL(event.data));

              const audioBlob = new Blob([event.data], { type: 'audio/mp3' });              
              // Save to firebase
              const audioRef = ref(storage, 'recordings/' + Date.now() + '.mp3');
                try {
                  uploadBytes(audioRef, audioBlob).then((snapshot) => {

                    getDownloadURL(audioRef).then((url) => {
              
                      setAudioUploadURL(url); 
                    });
                  });
                  console.log('Audio uploaded successfully!');
                  } catch (error) {
                  console.error('Error uploading audio:', error);
                }
              
            });
            console.log("audioUploadURL",audioUploadURL);

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
    
      const stopRecording = async () => {
        mediaRecorder.stop();
      }
      

      // Check for duplicates
      useEffect(() => {
        if (recognizer) {
          recognizer.recognized = (s, e) => {  
            handleText(e.result.text, uniqueWords);
          };
        }
      }, [recognizer])


      const handleText = (text, prevUnique) => {
        const uniqueWords = new Set(prevUnique);
        if (uniqueWords.has(text)) {
          setDuplicates(prev => {
            if (!prev.includes(text)) {
              return [...prev, text];
            } else {
              return prev; 
            }
          });
        } else {
          uniqueWords.add(text);
        }
        setUniqueWords(uniqueWords);

        setTexts(prev => [...prev, text]);
      }
    
    /////////////////////////////////////////////////////


    return(
        <div>
            <Link to="/main" className="btn btn-light my-3">
                Quay về
            </Link>
        
            {loading ? (
            <Loader/>
            ) : error ? (
                < Message variant='danger'>{error}</ Message> 
            ) : (
            <div>
                
               <Container className="app-container">

                {testState === 'preparation' && (
                  <>
                    <div>Thời gian chuẩn bị: {prepTime}</div>
                    
                    {showQ1 && 
                      <Card className="p-3">
                      <Card.Title>Câu 1</Card.Title>
                      <Card.Subtitle>{test.question1}</Card.Subtitle>
                      </Card>
                      }

                    {showQ2 && (
                      <Card className="p-3">
                      <Card.Title>Câu 2</Card.Title>
                      <Card.Subtitle>{test.question2}</Card.Subtitle>
                      </Card>
                      )}
                    {showStart && <Button onClick={startTest}> <i  className="fa-solid fa-circle-play"/> Bắt đầu làm bài</Button>}
                  </>
                )}

                {testState === 'inProgress' && (
                  <>
                    <div>Thời gian còn lại: {testTime}</div>
                    {showQ1 && 
                      <Card className="p-3">
                      <Card.Title>Câu 1</Card.Title>
                      <Card.Subtitle>{test.question1}</Card.Subtitle>
                      </Card>
                      }

                    {showQ2 && (
                      <Card className="p-3">
                      <Card.Title>Câu 2</Card.Title>
                      <Card.Subtitle>{test.question2}</Card.Subtitle>
                      </Card>
                      )}
                  </>
                )}

                {testState === 'completed' && (
                  <>
                    {curQuestion === 1 && <Button onClick={nextQuestion}>Câu hỏi tiếp theo</Button>}
                    
                    {showResults && 
                      <div>
                        {audioURL && 
                          <audio controls src={audioURL} />
                        }
                  
                        {texts.map(text => (
                          <div key={text}>{text}</div>
                        ))}


                      <h3>Lỗi lặp từ</h3>
                        {duplicates.map(text => 
                          <div key={text}>{text}</div>  
                        )} 
                      </div>
                    }
                  </>
                )}
                </Container>
            </div>
          
            )}
        
        </div>
    )
}

export default TestScreen;