import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Container } from 'reactstrap';
import { Button, Card, Form} from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify';
import '../styles/TestScreen.css'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listTestDetails } from '../actions/testActions'
import { getTokenOrRefresh } from '../actions/testActions';
import { getPhrase } from '../actions/testActions';
import { storage } from '../firebase';
import { ref,  uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from "uuid";
import { createResult } from '../actions/resultActions';
import { RESULT_CREATE_RESET } from '../constants/resultConstants';

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
    const [audioUploadURL, setAudioUploadURL] = useState('');
    const [resultURL1, setResultURL1] = useState('');
    const [resultTexts, setResultTexts] = useState([]);
    const [duplicates, setDuplicates] = useState([]);
    const [keywords1, setKeywords1] = useState([]);
    const [keywords2, setKeywords2] = useState([]);
    // Test time
  
    const [testState, setTestState] = useState('preparation');

    // Timers  
    const [prepTime, setPrepTime] = useState(300); 
    const [testTime, setTestTime] = useState(10);

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
      setTestTime(10);
      setPrepTime(300);
      setTexts([]);
      setShowNext(false);
      setShowResults(false);
      setTestState('preparation');
      setShowStart(true); 
      setCurQuestion(cur => cur + 1);
      setResultURL1(audioUploadURL);
      setResultTexts(texts);
    }
  
    function completeTest() {
      sttFromMic();
      toggleRecording();
      setTestState('completed');
      setShowNext(true);
      setShowResults(true);
      const myTexts = texts;
      const doc = convertToStr(myTexts);
      checkDuplicates(doc);
      findMatchedKeyords1(test.keywords1, doc)
      findMatchedKeyords2(test.keywords2, doc)
      // console.log("texts",texts)
    }

    //////////////////////////////////////////////////////////// Test time


    //save result
    const resultCreate = useSelector(state => state.resultCreate)
    const { result, resultError, success } = resultCreate
    const history = useNavigate()

    useEffect(() => {
      if (success) {
          history(`/main`)
          dispatch({ type: RESULT_CREATE_RESET })
      }
  }, [success, history])
    
    function saveResult() {
      dispatch(createResult({
        testName: test.name,
        question1: test.question1,
        keywords1: test.keywords1,
        answer1: resultTexts,
        audioURL1: resultURL1,
        question2: test.question2,
        keywords2: test.keywords2,
        answer2: texts,
        audioURL2: audioUploadURL,
    }))
    }



    //speech to text

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
                  console.log("audioUploadURL",audioUploadURL);
                  } catch (error) {
                  console.error('Error uploading audio:', error);
                }
              
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
    
      const stopRecording = async () => {
        mediaRecorder.stop();
      }
      

      // Check for duplicates
      function convertToStr(data) {

        let textStr = "";
        
        if(Array.isArray(data)) {
          // array, convert each item
          data.forEach(item => {
            if (item !== undefined) { 
              textStr += String(item);  
            }
          });
        } else {  
          // single item, convert directly 
          textStr = String(data);
        }
      
        return textStr;

      }

      const checkDuplicates = async (doc) => {
        const object = await getPhrase(doc)
        
        try {
          const strs = object.phrase_list.phrase.map(p => p.str);
          const wordCounts = {};
    
          strs.forEach(word => {
            let cleanedWord = word.replace(/[\s,.!?]/g,'');
            if(!wordCounts[cleanedWord]) {
              wordCounts[cleanedWord] = 0; 
            }
            wordCounts[cleanedWord]++;
          });
          
          const duplicates = [];
          
          for(let word in wordCounts) {
            if(wordCounts[word] > 1) {
              duplicates.push(word); 
            }
          }
          
          const filteredWords = duplicates.filter(word => {
            return word && 
              !/\s|\.|,|\?/.test(word); 
          })
          .filter(word => {
            return word !== "。";
          });
          console.log(filteredWords.word); 
          setDuplicates(filteredWords); 
        } catch (error) {
         
          toast.error("Error getting duplicates");
          throw error;
        }        
    
      }


      // Check for keywords
      const findMatchedKeyords1= async (arr1, doc) => {
        
        let matchedKeyords = [];
        const object = await getPhrase(doc)
    
        const arr2 = object.phrase_list.phrase.map(p => p.str);
        arr1.forEach(word1 => {
          if(arr2.includes(word1)) {
            if(!matchedKeyords.includes(word1)) {
              matchedKeyords.push(word1);  
            }
          }
        });
        setKeywords1(matchedKeyords);

      }

      const findMatchedKeyords2= async (arr1, doc) => {
        
        let matchedKeyords = [];
        const object = await getPhrase(doc)
    
        const arr2 = object.phrase_list.phrase.map(p => p.str);
        arr1.forEach(word1 => {
          if(arr2.includes(word1)) {
            if(!matchedKeyords.includes(word1)) {
              matchedKeyords.push(word1);  
            }
          }
        });
        setKeywords2(matchedKeyords);

      }


    
    /////////////////////////////////////////////////////

    const textParagraph = convertToStr(texts);

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
                        <div>
                        <p className="text-display"> 
                          Nội dung đã nói: {textParagraph}
                          </p>
                        {curQuestion === 1 && 
                        <p>
                          Từ đề xuất: {test.keywords1.join(", ")}
                          </p>
                        }

                          {curQuestion === 1 && 
                          <p>
                          Từ đề xuất hiện trong bài: {keywords1.join(", ")}
                          </p>
                         }


                        {curQuestion === 2 && 
                            <p>
                          Từ đề xuất: {test.keywords2.join(", ")}
                          </p>
                        }

                        {curQuestion === 2 && 
                          <p>
                          Từ đề xuất hiện trong bài: {keywords2.join(", ")}
                          </p>
                         }
                        
                        <p>
                          Lỗi lặp từ: {duplicates.join(", ")}
                        </p>
                                
                        </div>

                    </div>
                    }

                    {curQuestion === 2 && <Button onClick={saveResult}>Lưu kết quả thi</Button>}
                    {resultError && <Message variant='danger'>{resultError}</Message>}
                    
                  </>
                )}
                </Container>
            </div>
          
            )}
        
        </div>
    )
}

export default TestScreen;