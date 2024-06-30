import React, { useEffect, useRef, useState } from 'react';

const MyWebSock = () => {
    const socket = useRef();

    const [isConnectSuc, setIsConnectSuc] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nickname, setNickname] = useState('magrega');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:5000');

        socket.current.onopen = () => {
            const message = {
                event: 'connection',
                id: Date.now(),
                nickname
            }
            socket.current.send(JSON.stringify(message))
            console.log('Connection open');
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            console.log(message);
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            setIsConnectSuc(false);
            console.log('Socket закрыт')
        }
    }

    const onInputChange = (e) => setMessage(e.target.value);
    const getNickname = (e) => {
        e.preventDefault();
        setNickname(e.target[0].value);
        setIsConnectSuc(true);
        setIsLoggedIn(true);
    }

    const throwError = () => {
        console.log('Ошибка');
        setIsConnectSuc(false);
        socket.current.close(1000, "error");
    }

    const makeNewSocket = () => {
        socket.current = new WebSocket('ws://localhost:5000');
    }

    const sendMessage = (e) => {
        e.preventDefault();
        const chatMessage = {
            event: 'message',
            id: Date.now(),
            message,
            nickname
        }
        socket.current.send(JSON.stringify(chatMessage));
        setMessage('');
        console.log('Message sent!');
    }

    useEffect(() => {
        isLoggedIn && connect();
    }, [isLoggedIn]);

    if (!isLoggedIn) return (
        <div className="center">
            <form onSubmit={getNickname}>
                <input required type='text' placeholder='введи ник' />
                <button>Отправить</button>
            </form>
        </div>
    )

    return (
        <div className="center">
            <h1>{isConnectSuc ? "Соединение установлено" : "Ошибка соединения"}</h1>
            <h2>Привет, {nickname}</h2>
            <button onClick={throwError}>Кинуть ошибку</button>
            <button onClick={makeNewSocket}>Подключиться</button>

            <form>
                <input type='text' onChange={onInputChange} value={message} />
                <button onClick={sendMessage}>Отправить</button>
            </form>

            <div className='chat-window'>
                {messages.map((message, index) => <p key={index}>{message.nickname || 'server'}: {message.message}</p>)}
            </div>
        </div>
    );
};

export default MyWebSock;
