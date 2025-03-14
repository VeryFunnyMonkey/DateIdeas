import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as api from './api/dateIdeaApiService';
import { getIdeas } from './services/dateIdeaService';
import BottomNavigationBar from './components/BottomNavigationBar';
import HomeScreen from './pages/HomeScreen';
import RandomPage from './pages/RandomPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuthContext } from './hooks/useAuthContext';
import CalendarPage from './pages/CalendarPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import useSignalR from './hooks/useSignalR';

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

  useSignalR(user, setIdeas, setTags);

  return (
    <Router>
      <div>
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
            }
          />
          <Route
            path="/random"
            element={
              <ProtectedRoute>
                <RandomPage ideas={ideas.filter((idea) => !idea.scheduledDate && !idea.isCompleted)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage ideas={ideas} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
        {user && <BottomNavigationBar />}
      </div>
    </Router>
  );
}

export default App;
