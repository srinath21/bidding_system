import * as actionTypes from './actionTypes';

export const setAuthToken = (token) => {
    return {
        type: actionTypes.SET_USER_AUTH_TOKEN,
        payload: token
    }
};