import React, {useEffect, useState} from 'react';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js';
import axios from './axios';

import './App.css';

function App() {
const [messages,setMessages] = useState([]);

  useEffect(()=>{
    axios.get('/messages/sync').then(response=>{
      setMessages(response.data);
    });
  },[]);

  useEffect(() => {
    const pusher = new Pusher('80d6b942f4d697d76363', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      setMessages([...messages, newMessage]);
    });

    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  console.log(messages);

  return (
    <div className="app">    
      <div className="app__body">
        <Sidebar/>
        <Chat/>    
      </div> 
    </div>
  );
}

export default App;
