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


export const resultCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case RESULT_CREATE_REQUEST:
            return {
                loading: true
            }

        case RESULT_CREATE_SUCCESS:
            return {
                loading: false,
                success: true,
                result: action.payload
            }

        case RESULT_CREATE_FAIL:
            return {
                loading: false,
                resultError: action.payload
            }

        case RESULT_CREATE_RESET:
            return {}


        default:
            return state
    }
}

export const resultListMyReducer = (state = { results: [] }, action) => {
    switch (action.type) {
        case RESULT_LIST_MY_REQUEST:
            return {
                loading: true
            }

        case RESULT_LIST_MY_SUCCESS:
            return {
                loading: false,
                results: action.payload
            }

        case RESULT_LIST_MY_FAIL:
            return {
                loading: false,
                resultError: action.payload
            }

        case RESULT_LIST_MY_RESET:
            return {
                results: []
            }

        default:
            return state
    }
}
