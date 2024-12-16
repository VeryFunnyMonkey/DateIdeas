import { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as api from './api/dateIdeaApiService';
import BottomNavigationBar from './Components/BottomNavigationBar';
import HomeScreen from './Pages/HomeScreen';
import Random from './Pages/Random';
import Profile from './Pages/Profile';

function App() {
  const [ideas, setIdeas] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dateIdeasData = await api.getDateIdeas();
        setIdeas(dateIdeasData);
        const tagsData = await api.getTags();
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl('/hubs/dateIdeas')
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log('Connected to SignalR');
        connection.on('ReceiveDateIdea', (newIdea) => {
          setIdeas((prevIdeas) => {
            if (!prevIdeas.some(idea => idea.id === newIdea.id)) {
              console.log('Received new idea:', newIdea);
              return [...prevIdeas, newIdea];
            }
            return prevIdeas;
          });
        });

        connection.on('UpdateDateIdea', (updatedIdea) => {
          setIdeas((prevIdeas) =>
            prevIdeas.map((idea) => (idea.id === updatedIdea.id ? updatedIdea : idea))
          );
        });

        connection.on('DeleteDateIdea', (id) => {
          setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
        });

        connection.on('ReceiveTag', (newTag) => {
          setTags((prevTags) => {
            if (!prevTags.some(tag => tag.id === newTag.id)) {
              return [...prevTags, newTag];
            }
            return prevTags;
          });
        });

        connection.on('UpdateTag', (updatedTag) => {
          setTags((prevTags) =>
            prevTags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag))
          );
        });

        connection.on('DeleteTag', (id) => {
          setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
        });
      })
      .catch(e => console.log('Connection failed: ', e));
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Router>
      <div style={{ paddingBottom: '60px' }}> {/* Add padding-bottom to avoid overlap with the bottom navigation bar */}
        <Routes>
          <Route
            path="/"
            element={<HomeScreen ideas={ideas} tags={tags} setIdeas={setIdeas} setTags={setTags} />}
          />
          <Route path="/random" element={<Random ideas={ideas} />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNavigationBar />
      </div>
    </Router>
  );
}

export default App;