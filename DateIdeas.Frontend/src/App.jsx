import { useContext, useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as api from './api/dateIdeaApiService';
import { getIdeas } from './services/dateIdeaService';
import BottomNavigationBar from './components/BottomNavigationBar';
import HomeScreen from './pages/HomeScreen';
import RandomPage from './pages/RandomPage';
import ProfilePage from './pages/ProfilePage';
import AuthProvider from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuthContext } from './hooks/useAuthContext';
import CalendarPage from './pages/CalendarPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';

function App() {
  const [ideas, setIdeas] = useState([]);
  const [tags, setTags] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const dateIdeasData = await getIdeas();
          setIdeas(dateIdeasData);
          const tagsData = await api.getTags();
          setTags(tagsData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    fetchData();
  }
  }, [user]);

  useEffect(() => {
    if (user) {
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
            console.log('Received idea update:', updatedIdea);
            setIdeas((prevIdeas) =>
              prevIdeas.map((idea) => (idea.id === updatedIdea.id ? updatedIdea : idea))
            );
          });

          connection.on('DeleteDateIdea', (id) => {
            console.log('Received idea delete:', id);
            setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
          });

          connection.on('ReceiveTag', (newTag) => {
            console.log('Received new tag:', newTag);
            setTags((prevTags) => {
              if (!prevTags.some(tag => tag.id === newTag.id)) {
                return [...prevTags, newTag];
              }
              return prevTags;
            });
          });

          connection.on('UpdateTag', (updatedTag) => {
            console.log('Received tag update:', updatedTag);
            setTags((prevTags) =>
              prevTags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag))
            );
          });

          connection.on('DeleteTag', (id) => {
            console.log('Received tag delete:', id);
            setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
          });
        })
        .catch(e => console.log('Connection failed: ', e));
    }
  }, [user]);


  return (
    <Router>
      <div >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="/resetpassword" element={<ResetPasswordPage />} />
          <Route path="/confirmemail" element={<ConfirmEmailPage />} />
          <Route
            path="/"
            element={ 
            <ProtectedRoute> 
              <HomeScreen ideas={ideas} tags={tags} setIdeas={setIdeas} setTags={setTags} /> 
            </ProtectedRoute>
            }/>
          <Route path="/random" element={ 
            <ProtectedRoute>
              <RandomPage ideas={ideas.filter((idea) => !idea.scheduledDate && !idea.isCompleted)} /> 
            </ProtectedRoute>
            }/>
          <Route path="/calendar" element={
            <ProtectedRoute>
              <CalendarPage ideas={ideas} />
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