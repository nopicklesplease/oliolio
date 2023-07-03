import axios from 'axios';

const users = (state = [], action) => {
    if(action.type === 'SET_USERS'){
        return action.users;
    }
    if(action.type === 'UPDATE_USER'){
        return state.map(user => {
            if(user.id === action.user.id){
                return action.user;
            }
        })
    }
    if(action.type === 'CREATE_USER'){
        return state = [...state, action.user];
    }
    return state;
}

export const fetchUsers = () => {
    return async(dispatch) => {
        const response = await axios.get('/api/users');
        dispatch({ type: 'SET_USERS', users: response.data });
    }
}

export const createUser = (user) => {
    return async(dispatch) => {
        const response = await axios.post('/api/users', user);
        dispatch({ type: 'CREATE_USER', user: response.data});
    }
}

export const updateUser = (user) => {
    return async(dispatch) => {
        const response = await axios.put(`/api/users/${ user.id }`, user);
        return dispatch({type: 'SET_AUTH', auth:response.data})
    }
}

export default users;