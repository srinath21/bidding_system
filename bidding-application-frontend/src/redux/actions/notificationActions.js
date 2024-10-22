import * as actionTypes from './actionTypes';

export const addNotifications = (notifications) => {
    return {
        type: actionTypes.SET_NOTIFICATION,
        payload: notifications
    }
}

export const removeNotification = (index) => {
    return {
        type: actionTypes.SET_REMOVE_NOTIFICATION,
        payload: index
    }
}