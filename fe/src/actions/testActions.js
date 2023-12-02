import axios from 'axios'
import Cookie from 'universal-cookie';
import { 
    TEST_LIST_REQUEST,
    TEST_LIST_SUCCESS,
    TEST_LIST_FAIL,

    TEST_DETAILS_REQUEST,
    TEST_DETAILS_SUCCESS,
    TEST_DETAILS_FAIL 
} from "../constants/testConstants";

export const listTests = () => async (dispatch) => {
    try {
        dispatch({type: TEST_LIST_REQUEST})
        const {data} = await axios.get('/api/tests/')
        console.log("data",data)
        dispatch({
            type: TEST_LIST_SUCCESS,
            payload: data
        })
    } catch(error){
        dispatch({
            type: TEST_LIST_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        })
    }
} 

export const listTestDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: TEST_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/tests/${id}`)

        dispatch({
            type: TEST_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: TEST_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export async function getTokenOrRefresh() {
    const cookie = new Cookie();
    const speechToken = cookie.get('speech-token');

    if (speechToken === undefined) {
        try {
            const res = await axios.get('/api/get-speech-token');
            const token = res.data.token;
            const region = res.data.region;
            cookie.set('speech-token', region + ':' + token, {maxAge: 540, path: '/'});

            console.log('Token fetched from back-end: ' + token);
            return { authToken: token, region: region };
        } catch (err) {
            console.log(err.response.data);
            return { authToken: null, error: err.response.data };
        }
    } else {
        console.log('Token fetched from cookie: ' + speechToken);
        const idx = speechToken.indexOf(':');
        return { authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) };
    }
}