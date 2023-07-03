import axios from 'axios';

const btc = (state = {}, action) => {
    if(action.type === 'SET_BTC'){
        return action.btc;
    }
    return state;
}

export const fetchBtc = () => {
    return async(dispatch) => {
        const response = await axios.get('/api/coin/BTC');
        dispatch({ type: 'SET_BTC', btc: response.data })
    }
}

export default btc;