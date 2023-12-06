import { 
    RESULT_CREATE_REQUEST,
    RESULT_CREATE_SUCCESS,
    RESULT_CREATE_FAIL,

    RESULT_CREATE_RESET
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
                error: action.payload
            }

        case RESULT_CREATE_RESET:
            return {}


        default:
            return state
    }
}