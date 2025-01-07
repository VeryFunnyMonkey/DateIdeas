import { useContext, useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as api from './api/dateIdeaApiService';
import BottomNavigationBar from './components/BottomNavigationBar';
import HomeScreen from './pages/HomeScreen';
import RandomPage from './pages/RandomPage';
import ProfilePage from './pages/ProfilePage';
import AuthProvider from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const [ideas, setIdeas] = useState([]);
  const [tags, setTags] = useState([]);
  const { user } = useAuthContext();

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


  return (
    <Router>
      <div >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={ 
            <ProtectedRoute> 
              <HomeScreen ideas={ideas} tags={tags} setIdeas={setIdeas} setTags={setTags} /> 
            </ProtectedRoute>
            }/>
          <Route path="/random" element={ 
            <ProtectedRoute>
              <RandomPage ideas={ideas} /> 
            </ProtectedRoute>
            }/>
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
            }/>
        </Routes>
        {user && <BottomNavigationBar />}
      </div>
    </Router>
  );
}

export default App;