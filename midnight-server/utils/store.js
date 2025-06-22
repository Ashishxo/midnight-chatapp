
function createStore(){
    const users = new Map();

    return{
        createUser(username, socket){
            users.set(username, socket);
        },

        getUser(username){
            return users.get(username);
        },

        deleteUser(username) {
            users.delete(username);
        },
    }


}


export default createStore;