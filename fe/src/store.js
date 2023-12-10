import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'

import { userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
} from './reducers/userReducer'

import { testListReducer,
  testDetailsReducer,
} from './reducers/testReducer'

import { resultCreateReducer, resultListMyReducer } from './reducers/resultReducer';

const reducer = combineReducers({

  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,

  testList: testListReducer,
  testDetails: testDetailsReducer,

  resultCreate: resultCreateReducer,
  resultListMy: resultListMyReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo') ?
JSON.parse(localStorage.getItem('userInfo')) : null

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
}

const middleware = [thunk]

const store = createStore(reducer, initialState,
  composeWithDevTools(applyMiddleware(...middleware)))

export default store