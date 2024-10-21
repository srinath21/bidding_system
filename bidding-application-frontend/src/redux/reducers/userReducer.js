import * as actionTypes from '../actions/actionTypes'

const initState = {
    token: null,
    emailID: null,
    firstName: null,
    lastName: null,
    isAuth: false
};

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER_AUTH_TOKEN:
            return {
                ...state,
                token: action.payload.authToken,
                emailID: action.payload.emailID,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                isAuth: true
            }
        case actionTypes.SET_USER_LOGOUT:
            return {
                ...state,
                token: null,
                emailID: null,
                firstName: null,
                lastName: null,
                isAuth: false
            }
        default:
            return state;
    }
}

export default userReducer;