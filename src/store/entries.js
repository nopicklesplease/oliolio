import axios from 'axios';

const entries = (state = [], action) => {
    if(action.type === 'SET_ENTRY'){
        return action.entry;
    }

    if(action.type === 'CREATE_ENTRY'){
        state = [...state, action.entry]
    }

    if(action.type === 'DESTROY_ENTRY'){
        return state.filter(_entry => _entry.id !== action.entry.id);
    }

    if(action.type === 'UPDATE_ENTRY'){
        state = state.map(entry => {
            if(entry.id === action.entry.id){
                return action.entry;
            }
            return entry;
        })
    }
    return state;
}

export const fetchEntries = () => {
    return async(dispatch) => {
        const response = await axios.get('/api/entries');
        dispatch({ type: 'SET_ENTRY', entry: response.data});
    }
}

export const createEntry = (entry) => {
    return async(dispatch) => {
        const response = await axios.post('/api/entries', entry);
        dispatch({ type: 'CREATE_ENTRY', entry: response.data });
    }
}

export const updateEntry = (entry) => {
    return async(dispatch) => {
        const response = await axios.put(`/api/entries/${ entry.id }`, entry)
        dispatch({ type: 'UPDATE_ENTRY', entry: response.data})
    }
}

export const destroyEntry = (entry) => {
    return async(dispatch) => {
        await axios.delete(`/api/entries/${ entry.id }`);
        dispatch({ type: 'DESTROY_ENTRY', entry });
    }
}

export default entries;