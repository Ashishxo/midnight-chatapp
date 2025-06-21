import { nanoid } from "nanoid";

/*
Chat{
    ChatID,
    message,
    userID
}


rooms: roomid, Room
users: userid, User

Room: {
    roomid,
    users[],
    chats[]
}

users in room: [userid, name]

users in users: {userid, connection}

*/

function createStore(){
    const users = new Map();
    const rooms = new Map();

    return{
        createUser(socket){
            userID = nanoid()
            

            return userID;
        }
    }


}

export default createStore;