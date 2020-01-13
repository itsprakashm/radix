export function updatesim(simname){
    return (dispatch) => {
            dispatch({type: 'UPDATESIM', data:simname});
 
    };
}
export function updateuser(userid){
    return (dispatch) => {
            dispatch({type: 'UPDATEUSER', data:userid});
 
    };
}