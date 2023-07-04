const hidden = (state = false, action) => {
    if(action.type === 'SET_HIDDEN'){
        return action.hidden;
    }
    state = !state;
    return state;
}

export const setHidden = () => {
    return (dispatch) => {
        dispatch({ type: 'SET_HIDDEN', hidden: !hidden.state})
    }
}

export default hidden;