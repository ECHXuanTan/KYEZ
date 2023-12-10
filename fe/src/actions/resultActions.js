import axios from 'axios'
import { 
    RESULT_CREATE_REQUEST,
    RESULT_CREATE_SUCCESS,
    RESULT_CREATE_FAIL,

    RESULT_CREATE_RESET,

    RESULT_LIST_MY_REQUEST,
    RESULT_LIST_MY_SUCCESS,
    RESULT_LIST_MY_FAIL,
    RESULT_LIST_MY_RESET

} from "../constants/resultConstants";

export const createResult = (result) => async (dispatch, getState) => {
    try {
        dispatch({
            type: RESULT_CREATE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

       

        const { data } = await axios.post(
            '/add/',
            {result},
            {
            baseURL: '/api/results',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
         }
        )

        dispatch({
            type: RESULT_CREATE_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: RESULT_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const listMyResults = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: RESULT_LIST_MY_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(
            `/api/results/mine/`,
            config
        )

        dispatch({
            type: RESULT_LIST_MY_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: RESULT_LIST_MY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}