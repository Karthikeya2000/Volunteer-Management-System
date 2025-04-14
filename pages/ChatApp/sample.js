import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('private_message', (msg) => {
            setMessages([...messages, msg]);
        });

        return () => {
            socket.disconnect();
        };
    }, [messages]);

    const sendMessage = () => {
        socket.emit('private_message', {
            receiverId: 'receiver_user_id',
            message: message,
        });
        setMessage('');
    };

    return (
        <div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
