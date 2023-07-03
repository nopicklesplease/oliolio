import axios from 'axios';

const wallets = (state = [], action) => {
    if(action.type === 'SET_WALLET'){
        return action.wallet;
    }

    if(action.type === 'CREATE_WALLET'){
        state = [...state, action.wallet];
    }

    if(action.type === 'DESTROY_WALLET'){
        return state.filter(_wallet => _wallet.id !== action.wallet.id);
    }

    if(action.type === 'UPDATE_WALLET'){
        state = state.map(wallet => {
            if(wallet.id === action.wallet.id){
                return action.wallet;
            }
            return wallet;
        })
    }
    return state;
}

export const createWallet = (wallet, navigate) => {

    const newWallet = async(dispatch) => {
        const response = await axios.post('/api/wallets', wallet);
        dispatch({ type: 'CREATE_WALLET', wallet: response.data });

        navigate(`#/api/wallets/${ response.data.id }`);
    }

    return newWallet;
}

export const fetchWallets = () => {
    return async(dispatch) => {
        const response = await axios.get('/api/wallets');
        dispatch({ type: 'SET_WALLET', wallet: response.data});
    }
}

export const updateWallet = (wallet) => {
    return async(dispatch) => {
        const response = await axios.put(`/api/wallets/${wallet.id}`, wallet)
        dispatch({ type: 'UPDATE_WALLET', wallet: response.data})
    }
}

export const destroyWallet = (wallet) => {
    return async(dispatch) => {
        await axios.delete(`/api/wallets/${ wallet.id }`);
        dispatch({ type: 'DESTROY_WALLET', wallet });
    }
}

export default wallets;



