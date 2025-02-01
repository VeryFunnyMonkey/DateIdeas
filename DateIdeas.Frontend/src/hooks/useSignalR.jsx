import { useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

const useSignalR = (user, setIdeas, setTags) => {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    if (!user) return;

    let isReconnecting = false;

    const connect = async () => {
      if (isReconnecting) return;
      isReconnecting = true;

      const newConnection = new HubConnectionBuilder()
        .withUrl('/hubs/dateIdeas')
        .withAutomaticReconnect([0, 2000, 5000, 10000]) // Retry with backoff
        .build();

      newConnection.on('ReceiveDateIdea', (newIdea) => {
        setIdeas((prevIdeas) => {
          if (!prevIdeas.some((idea) => idea.id === newIdea.id)) {
            return [...prevIdeas, newIdea];
          }
          return prevIdeas;
        });
      });

      newConnection.on('UpdateDateIdea', (updatedIdea) => {
        setIdeas((prevIdeas) =>
          prevIdeas.map((idea) => (idea.id === updatedIdea.id ? updatedIdea : idea))
        );
      });

      newConnection.on('DeleteDateIdea', (id) => {
        setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
      });

      newConnection.on('ReceiveTag', (newTag) => {
        setTags((prevTags) => {
          if (!prevTags.some((tag) => tag.id === newTag.id)) {
            return [...prevTags, newTag];
          }
          return prevTags;
        });
      });

      newConnection.on('UpdateTag', (updatedTag) => {
        setTags((prevTags) =>
          prevTags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag))
        );
      });

      newConnection.on('DeleteTag', (id) => {
        setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
      });

      newConnection.onclose(() => {
        console.log("SignalR connection closed. Attempting to reconnect...");
        setTimeout(() => connect(), 5000);
      });
    // this works for now, eventually I will implement a heartbeat system instead of relying on the client to reconnect
    // TODO: Implement heartbeat system from server to client
      try {
        await newConnection.start();
        console.log('Connected to SignalR');
        setConnection(newConnection);
      } catch (error) {
        console.error('Connection failed:', error);
        setTimeout(() => connect(), 5000);
      }

      isReconnecting = false;
    };

    connect();

    const handleFocus = () => {
      if (connection?.state !== HubConnectionState.Connected) {
        console.log("Reconnecting SignalR due to window focus...");
        connect();
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      connection?.stop();
    };
  }, [user]);

  return connection;
};

export default useSignalR;
