import * as actionTypes from '../actions/actionTypes'

const initState = {
    token: null
};

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER_AUTH_TOKEN:
            return {
                ...state,
                token: action.payload
            }
        default:
            return state;
    }
}

export default userReducer;