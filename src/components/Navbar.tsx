import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Stack, Box } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 상태 변화 감지
  useEffect(() => {
    console.log('Navbar useEffect - token 변화:', token);
    console.log('Navbar useEffect - user 변화:', user);
    console.log('Navbar useEffect - localStorage token:', localStorage.getItem('token'));
    console.log('Navbar useEffect - localStorage user:', localStorage.getItem('user'));
  }, [token, user]);

  // 디버깅용 로그
  console.log('Navbar 렌더링 - token:', token);
  console.log('Navbar 렌더링 - user:', user);
  console.log('Navbar 렌더링 - localStorage user:', localStorage.getItem('user'));

  const handleLogout = () => {
    logout();
    navigate('/'); // 홈으로 리다이렉트
  };

  return (
    <AppBar position="fixed" sx={{ 
      background: '#161b22', 
      boxShadow: 'none', 
      borderBottom: '1px solid #30363d',
      zIndex: 1200
    }}>
      <Toolbar sx={{ minHeight: 64, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Teaming 로고 아이콘 */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* 첫 번째 사람 */}
              <circle cx="11" cy="8" r="4" fill="#4285f4"/>
              <ellipse cx="11" cy="20" rx="7" ry="5" fill="#4285f4"/>
              {/* 두 번째 사람 */}
              <circle cx="21" cy="8" r="4" fill="#4285f4"/>
              <ellipse cx="21" cy="20" rx="7" ry="5" fill="#4285f4"/>
            </svg>
            <Typography
              variant="h6"
              sx={{ color: 'white', fontWeight: 700, letterSpacing: '-1px', cursor: 'pointer', textDecoration: 'none', fontFamily: 'Montserrat, Pretendard, sans-serif', fontSize: '1.5rem' }}
              component={Link}
              to="/"
            >
              Teaming
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} sx={{ ml: 3 }}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{ color: location.pathname === '/' ? '#238636' : 'white', fontWeight: 600, borderRadius: 2, px: 2, py: 1.2, fontSize: '1rem', background: location.pathname === '/' ? 'rgba(35,134,54,0.08)' : 'transparent', transition: 'all 0.2s', '&:hover': { color: '#238636', background: 'rgba(35,134,54,0.08)' } }}
            >홈</Button>
            <Button
              color="inherit"
              component={Link}
              to="/projects"
              sx={{ color: location.pathname === '/projects' ? '#238636' : 'white', fontWeight: 600, borderRadius: 2, px: 2, py: 1.2, fontSize: '1rem', background: location.pathname === '/projects' ? 'rgba(35,134,54,0.08)' : 'transparent', transition: 'all 0.2s', '&:hover': { color: '#238636', background: 'rgba(35,134,54,0.08)' } }}
            >프로젝트</Button>
            <Button
              color="inherit"
              component={Link}
              to="/invites"
              sx={{ color: location.pathname === '/invites' ? '#238636' : 'white', fontWeight: 600, borderRadius: 2, px: 2, py: 1.2, fontSize: '1rem', background: location.pathname === '/invites' ? 'rgba(35,134,54,0.08)' : 'transparent', transition: 'all 0.2s', '&:hover': { color: '#238636', background: 'rgba(35,134,54,0.08)' } }}
            >초대</Button>
          </Stack>
        </Box>
        <Stack direction="row" spacing={2}>
          {token ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body1" sx={{ color: 'white', fontWeight: 500, fontSize: '1rem' }}>
                안녕하세요, <span style={{ color: '#238636', fontWeight: 600 }}>
                  {user?.name || user?.username || '사용자'}
                </span>님
              </Typography>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ color: 'white', fontWeight: 600, borderRadius: 2, px: 3, py: 1.2, fontSize: '1rem', border: '1px solid #30363d', background: 'rgba(48,54,61,0.2)', boxShadow: 'none', transition: 'all 0.2s', '&:hover': { color: '#f85149', borderColor: '#f85149', background: 'rgba(248,81,73,0.08)' } }}
              >로그아웃</Button>
            </Stack>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ color: 'white', fontWeight: 600, borderRadius: 2, px: 3, py: 1.2, fontSize: '1rem', border: '1px solid #30363d', background: 'rgba(48,54,61,0.2)', boxShadow: 'none', transition: 'all 0.2s', '&:hover': { color: '#238636', borderColor: '#238636', background: 'rgba(35,134,54,0.08)' } }}
              >로그인</Button>
              <Button
                color="inherit"
                component={Link}
                to="/signup"
                sx={{ color: 'white', fontWeight: 600, borderRadius: 2, px: 3, py: 1.2, fontSize: '1rem', border: '1px solid #30363d', background: 'rgba(48,54,61,0.2)', boxShadow: 'none', transition: 'all 0.2s', '&:hover': { color: '#238636', borderColor: '#238636', background: 'rgba(9,105,218,0.08)' } }}
              >회원가입</Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
