import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import MainHero from './components/Hero';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import InviteList from './components/InviteList';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProjectsPage from './pages/ProjectsPage';
import CreateProjectPage from './pages/CreateProjectPage';
import CreateInvitePage from './pages/CreateInvitePage';

function App() {
  React.useEffect(() => {
    document.body.style.background = '#161b22';
    document.body.style.minHeight = '100vh';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    return () => {
      document.body.style.background = '';
      document.body.style.minHeight = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
    };
  }, []);

  return (
    <BrowserRouter>
      <CssBaseline />
      <Navbar />
      <Box sx={{ 
        minHeight: '100vh', 
        width: '100vw', 
        maxWidth: '100vw',
        background: '#161b22',
        overflowX: 'hidden',
        paddingTop: '64px'
      }}>
        <Routes>
          <Route path="/" element={<MainHero />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/new" element={<CreateProjectPage />} />
          <Route path="/invites" element={<InviteList />} />
          <Route path="/invite/new" element={<CreateInvitePage />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
