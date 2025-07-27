import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { signUp } from '../api/auth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '', name: '', email: '', class_code: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 홈에서 전달받은 이름 처리
  useEffect(() => {
    if (location.state && (location.state as any).name) {
      const receivedName = (location.state as any).name;
      setForm(prev => ({ ...prev, name: receivedName }));
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await signUp({ ...form, class_code: Number(form.class_code) });
      setSuccess('회원가입 성공! 로그인 페이지로 이동합니다.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      console.error('회원가입 에러:', err);
      if (err.response) {
        setError(err.response.data.message || '회원가입 중 오류가 발생했습니다.');
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  const textFieldStyle = {
    '& .MuiInputBase-input': { 
      color: 'white',
      backgroundColor: 'transparent',
    },
    '& .MuiInputLabel-root': { 
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiInputLabel-shrink': { 
      color: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#30363d',
      },
      '&:hover fieldset': {
        borderColor: '#58a6ff',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#58a6ff',
      },
      '& input': {
        color: 'white',
        fontSize: '16px',
      },
      '& input:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px #21262d inset !important',
        WebkitTextFillColor: 'white !important',
      },
    },
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 4 }}>회원가입</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: 350 }}>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: '#21262d', color: '#f85149', border: '1px solid #f85149' }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2, backgroundColor: '#21262d', color: '#238636', border: '1px solid #238636' }}>
            {success}
          </Alert>
        )}
        
        <TextField fullWidth margin="normal" name="name" label="이름" value={form.name} onChange={handleChange} sx={textFieldStyle} />
        <TextField fullWidth margin="normal" name="email" label="이메일" value={form.email} onChange={handleChange} sx={textFieldStyle} />
        <TextField fullWidth margin="normal" name="class_code" label="학번" value={form.class_code} onChange={handleChange} sx={textFieldStyle} />
        <TextField fullWidth margin="normal" name="username" label="아이디" value={form.username} onChange={handleChange} sx={textFieldStyle} />
        <TextField fullWidth margin="normal" name="password" label="비밀번호" type="password" value={form.password} onChange={handleChange} sx={textFieldStyle} />
        <Button 
          fullWidth 
          variant="contained" 
          type="submit" 
          sx={{ 
            mt: 2, 
            fontWeight: 600, 
            backgroundColor: '#238636 !important', 
            color: 'white !important', 
            borderRadius: 2, 
            boxShadow: 'none', 
            border: 'none',
            textTransform: 'none',
            '&:hover': { 
              backgroundColor: '#2ea043 !important',
              boxShadow: 'none',
            },
            '&.MuiButton-contained': {
              backgroundColor: '#238636 !important',
            }
          }}
        >
          회원가입
        </Button>
      </Box>
    </Box>
  );
}
