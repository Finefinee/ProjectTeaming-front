import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Stack } from '@mui/material';
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
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#161b22',
    }}>
      <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, mb: 2, textAlign: 'center', letterSpacing: '-2px' }}>
        프로젝트 팀 빌딩 서비스
      </Typography>
      <Typography variant="h5" sx={{ color: 'white', opacity: 0.8, mb: 6, textAlign: 'center', fontWeight: 400 }}>
        팀원을 초대하고, 프로젝트를 관리하세요!
      </Typography>
      
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <TextField
          placeholder="멋진 이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            width: '300px',
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: '8px',
              '& fieldset': {
                borderColor: '#d0d7de',
              },
              '&:hover fieldset': {
                borderColor: '#0969da',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0969da',
              },
            },
            '& .MuiInputBase-input': {
              padding: '12px 16px',
              fontSize: '16px',
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSignUp}
          sx={{
            backgroundColor: '#238636',
            color: 'white',
            fontWeight: 600,
            fontSize: '16px',
            padding: '12px 24px',
            borderRadius: '8px',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#2ea043',
            },
          }}
        >
          회원가입하기
        </Button>
      </Stack>

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
          '&:hover': {
            backgroundColor: 'rgba(240, 246, 252, 0.1)',
            borderColor: 'white',
          },
        }}
      >
        프로젝트 보기
      </Button>
    </Box>
  );
}

export default MainHero;
