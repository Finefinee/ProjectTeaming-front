import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MainHero() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (name) {
      navigate('/signup', { state: { name } });
    } else {
      navigate('/signup');
    }
  };

  const handleViewProjects = () => {
    navigate('/projects');
  };

  return (
    <>
      <style>
        {`
          .email-signup-container {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-start !important;
          }
          .email-signup-container * {
            display: inline-block !important;
          }
        `}
      </style>
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#161b22',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        padding: '0 20px',
        boxSizing: 'border-box',
      }}>
      {/* 로고와 제목 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
        <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 첫 번째 사람 */}
          <circle cx="11" cy="8" r="4" fill="#4285f4"/>
          <ellipse cx="11" cy="20" rx="7" ry="5" fill="#4285f4"/>
          {/* 두 번째 사람 */}
          <circle cx="21" cy="8" r="4" fill="#4285f4"/>
          <ellipse cx="21" cy="20" rx="7" ry="5" fill="#4285f4"/>
        </svg>
        <Typography variant="h1" sx={{ color: 'white', fontWeight: 700, letterSpacing: '-2px', fontSize: '3rem' }}>
          Teaming
        </Typography>
      </Box>
      <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, mb: 2, textAlign: 'center', letterSpacing: '-2px' }}>
        프로젝트 팀 빌딩 서비스
      </Typography>
      <Typography variant="h5" sx={{ color: 'white', opacity: 0.8, mb: 6, textAlign: 'center', fontWeight: 400 }}>
        팀원을 초대하고, 프로젝트를 관리하세요!
      </Typography>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: '24px',
        width: '100%',
        maxWidth: '600px'
      }}>
        <div 
          className="email-signup-container"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            border: '1px solid #d0d7de',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'white',
            width: 'auto',
            height: '50px',
            minWidth: '460px',
            position: 'relative',
          }}
        >
          <input
            type="text"
            placeholder="멋진 이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '320px',
              height: '100%',
              padding: '0 16px',
              fontSize: '16px',
              color: '#24292f',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              flex: '1',
            }}
          />
          <button
            type="button"
            onClick={handleSignUp}
            style={{
              backgroundColor: '#238636',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              padding: '0 24px',
              border: 'none',
              borderRadius: '0',
              cursor: 'pointer',
              height: '100%',
              minWidth: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#2ea043';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#238636';
            }}
          >
            회원가입하기
          </button>
        </div>

        <Button
          variant="outlined"
          onClick={handleViewProjects}
          sx={{
            color: 'white',
            borderColor: '#f0f6fc',
            fontWeight: 600,
            fontSize: '16px',
            padding: '12px 24px',
            borderRadius: '8px',
            textTransform: 'none',
            height: '50px',
            minWidth: '150px',
            '&:hover': {
              backgroundColor: 'rgba(240, 246, 252, 0.1)',
              borderColor: 'white',
            },
          }}
        >
          프로젝트 보기
        </Button>
      </div>
    </Box>
    </>
  );
}

export default MainHero;