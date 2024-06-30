const ws = require('ws');

const userClients = {};

const wss = new ws.Server({
    port: 5000,
}, () => console.log(`Server started on 5000`))

wss.on('connection', function connection(ws) {
    const id = Math.floor(Math.random() * 10);
    userClients[id] = ws;

    ws.on('message', function (message) {
        message = JSON.parse(message)
        switch (message.event) {
            case 'connection':
                handleClient(message, userClients);
                break;
            case 'message':
                broadcastMessage(message, userClients)
                break;
        }
    })
})

function broadcastMessage(message, clients) {
    for (const key in clients) {
        clients[key].send(JSON.stringify(message));
    }
}

function handleClient(message, clients) {
    console.log(message.nickname + ` подключился!`);
    for (const key in clients) {
        clients[key].send(JSON.stringify({ nickname: 'server', message: `${message.nickname} подключился!` }));
    }
}
