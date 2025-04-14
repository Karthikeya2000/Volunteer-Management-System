import React, { useEffect, useState } from 'react';
import "./style.css";
import { useQuery } from '@tanstack/react-query';
import APIHandler from '../../handlers/APIHandler';
import axios from 'axios';


interface Message {
  id: string;
  text: string;
  me: boolean;
}

function ChatApp(): JSX.Element {
  const [contacts, setContacts] = useState();
  const [messages, setMessages] = useState();
  const [message, setMessage] = useState<string>('');
  const [activeUser, setActiveUser] = useState<string>('');

  const { data: proffessorsData } = useQuery({
    queryFn: () => APIHandler.getProfessorsList(
      JSON.parse(sessionStorage.getItem("user"))?.user_id,
      JSON.parse(sessionStorage.getItem("user"))?.token
    ),
    queryKey: ["proffessors"],
    select(data) {
      return data?.data?.users;
    },
  });
  
  useEffect(() => {
    getMessages(); // Call getMessages immediately when activeUser changes
    const intervalId = setInterval(() => {
      getMessages(); // Call getMessages every 5 seconds
    }, 5000);
  
    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [activeUser]);
  
  const getMessages = () => {
    if(activeUser && JSON.parse(sessionStorage.getItem("user"))?.user_id){
      axios.get(`https://wsd-chat.vercel.app/api/receiveMessages/${JSON.parse(sessionStorage.getItem("user"))?.user_id}/${activeUser}`)
        .then(response => {
          setMessages(response.data);
        })
        .catch(error => {
          console.error('Error fetching data: ', error);
        });
    }
  };
  

  useEffect(() => {
    if (proffessorsData) {
      setContacts(proffessorsData);
    }
  }, [proffessorsData]);

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  function ContactList({ items }: { items }): JSX.Element {
    return (
      <ul>
        {items?.map(item => (
          <li className={activeUser == item.id ? "active" : ""} onClick={(e) => {
            setActiveUser(item.id)
          }}>
            {`${item.first_name} ${item.last_name} `}
          </li>
        ))}
      </ul>
    );
  }

  function MessagesHistory({ items }: { items }): JSX.Element {
    {/* 
  // @ts-ignore */}
    return items?.map((item) => (
      <div className={"message " + (item.other_user == activeUser ? "other" : "me")}>
        <div className={`message-body`}>{item.message}</div>
      </div>
    ));
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if(message!==""){
      try {
        const response = await axios.post('https://wsd-chat.vercel.app/api/sendMessages', {
          current_user: JSON.parse(sessionStorage.getItem("user"))?.user_id,
          other_user: activeUser,
          message: message,
          type: 'S'
        });
        setMessage("");
        getMessages();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div>
      {
        !activeUser && <p>Please click on names on left side menu, to start a conversation</p>
      }
      <div className="app">
        <div className="contact-list">
          <h1 className="title">My messages</h1>
          <ContactList items={contacts} />
        </div>
        <div className="messages">
          <div className="messages-history">
            <MessagesHistory items={messages} />
          </div>
          <form className="messages-inputs" onSubmit={handleSubmit}>
            <input type="text" placeholder="Send a message" onChange={handleChange} value={message} hidden={!activeUser}/>
            <button type="submit" hidden={!activeUser}><i className="material-icons">send</i></button>
          </form>
        </div>
      </div>
    </div>
  );
}





export default ChatApp;
