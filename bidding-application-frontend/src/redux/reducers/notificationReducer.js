import * as actionTypes from '../actions/actionTypes';
const initState = {
    items: []
}

const notificationReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.SET_NOTIFICATION: return {
            ...state,
            items: [
                ...state.items,
                ...action.payload
            ]
        }
        case actionTypes.SET_REMOVE_NOTIFICATION: return {
            ...state,
            items: state.items.filter(n => n.index !== action.payload)
        }
        default: return state;
    }
}

export default notificationReducer;