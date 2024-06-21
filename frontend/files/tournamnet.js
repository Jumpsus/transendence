socket.onmessage = function(event) {
    // console.log('Message received from server:', event.data);
    
    // Parse and handle the message from the server
    const message = JSON.parse(event.data);
    if (message['waiting'] != undefined) {
        console.log(message['waiting']);
    }
    if (message['game-start'] != undefined) {
        console.log(message['game-start']);
    }
    if (message['matches'] != undefined) {
        // try to connect to the game by order. and send back the result.

        // play one game, use the first uid //message['matches'][0]// to connect to the game room, once it finished, send this:
        // const sending_data1 = {
        //     type: 'game1',
        //     match: message['matches'][0],
        //     result: {'player1_name' : 11, 'player2_name': 5} // player 1 score, player 2 score
        // };
        // socket.send(JSON.stringify(sending_data1));
        // // play one game, use the second uid //message['matches'][1]// to connect to the game room, once it finished, send this:
        // const sending_data2 = {
        //     type: 'game2',
        //     match: message['matches'][1],
        //     result: {'player1_name' : 11, 'player2_name': 7} // player 1 score, player 2 score
        // };
        // socket.send(JSON.stringify(sending_data2));
        // // play one game, use the third uid //message['matches'][2]// to connect to the game room, once it finished, send this:
        // const sending_data3 = {
        //     type: 'game3',
        //     match: message['matches'][2],
        //     result: {'player1_name' : 2, 'player2_name': 11} // player 1 score, player 2 score
        // };
        socket.send(JSON.stringify(sending_data3));
    }
    if (message['results'] != undefined) {
        console.log(message['results']);
    }
    if (message['Error'] != undefined) {
        console.log(message['Error']);
    }
};


// tournament socket  -> 

// onmessage:
// (matches) {
//     loop through the game matches to connect to the websocket and start the game (It needs to loop and check if the game is over to move to the next one)
// }
// (Error) {
//     1. close the game socket, if they are still playing.
//     2. Prompt the page with the reason.
// }
// (results) {
//     show the results page
// }


// game socket ->
// 1. Send if the game is tournament
// (results) {
//     show the results page
// }



