import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Container } from 'reactstrap';
import { Row, Col, Image, ListGroup, Button, Card, Form} from 'react-bootstrap'
import '../styles/TestScreen.css'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listTestDetails } from '../actions/testActions'
import { getTokenOrRefresh } from '../actions/testActions';
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';

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
    
    const handleNext = () => {
        setShowQ1(false);
        setShowQ2(true);
      }
    

    //speech to text
    const [displayText, setDisplayText] = useState('INITIALIZED: ready to test speech...');
    const [player, updatePlayer] = useState({p: undefined, muted: false});

    async function sttFromMic() {
        const tokenObj = await getTokenOrRefresh();
        const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
        speechConfig.speechRecognitionLanguage = 'zh-CN';
        
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

        setDisplayText('speak into your microphone...');
        
        recognizer.recognizeOnceAsync(result => {
            if (result.reason === ResultReason.RecognizedSpeech) {
                setDisplayText(`RECOGNIZED: Text=${result.text}`);
            } else {
                setDisplayText('ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.');
            }
        });
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
                 <Button onClick={handleNext}>
                     Next Question
                 </Button>
            </div>
            //speech to text
            )}
             <Container className="app-container">
            <div className="row main-container">
                <div className="col-6">
                    <i className="fas fa-microphone fa-lg mr-2" onClick={() => sttFromMic()}></i>
                    Convert speech to text from your mic.
                    <div>
                </div>
                </div>
                <div className="col-6 output-display rounded">
                    <code>{displayText}</code>
                </div>
            </div>
        </Container>
        </div>


    )
}

export default TestScreen;