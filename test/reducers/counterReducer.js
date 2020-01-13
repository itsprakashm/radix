
/*state = Object.assign({}, state, { data: action.data, loading:false });
            return state;*/

import { combineReducers } from 'redux';
 
 //Import the actions types constant we defined in our actions
 
let dataState = { sim: "sim info", user_id:"0", loading:"loading",full_name:"" };
 
const dataReducer = (state = dataState, action) => {
    console.log(action.data);
    switch (action.type) {
        case 'UPDATESIM' :
            state = Object.assign({}, state, { sim: action.data });
            return state;
        case 'UPDATEUSER' :
            state = Object.assign({}, state, { user_id: action.data.user_id,loading:action.data.loading,full_name:action.data.full_name });
            return state;
        default :
            return state;
    }
};
const callReducer = (state = dataState, action) => {
    switch (action.type) {
        case 'UPDATESIM' :
            state = Object.assign({}, state, { sim: action.data });
            return state;
        case 'UPDATEUSER' :
            state = Object.assign({}, state, { user_id: action.data.user_id,loading:action.data.loading });
            return state;
        default :
            return state;
    }
};
 
// Combine all the reducers
const rootReducer = combineReducers({
    dataReducer
    // ,[ANOTHER REDUCER], [ANOTHER REDUCER] ....
})
 
export default rootReducer;