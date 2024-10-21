import * as actionTypes from './actionTypes';

export const setAuthToken = (token) => {
    return {
        type: actionTypes.SET_USER_AUTH_TOKEN,
        payload: token
    }
};

export const logoutUser = () => {
    console.log('logout')
    return {
        type: actionTypes.SET_USER_LOGOUT
    }
}