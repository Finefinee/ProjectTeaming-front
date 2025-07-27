import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { login } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getUserInfoFromToken } from '../utils/jwt';

export default function LoginPage() {
  const { login: setToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const res = await login(form) as { data?: { token?: string; user?: { id: number; username: string; name?: string } } };
      console.log('Login response:', res);
      
      if (res.data && res.data.token) {
        console.log('Token received:', res.data.token);
        
        const userInfo = getUserInfoFromToken(res.data.token);
        
        if (userInfo) {
          console.log('Final user info to save:', userInfo);
          setToken(res.data.token, userInfo);
          setSuccess('로그인 성공!');
          
          setTimeout(() => {
            console.log('리다이렉트 전 localStorage 확인:');
            console.log('token:', localStorage.getItem('token'));
            console.log('user:', localStorage.getItem('user'));
            window.location.href = '/';
          }, 1000);
        } else {
          const fallbackUserInfo = {
            id: Date.now(),
            username: form.username,
            name: form.username
          };
          setToken(res.data.token, fallbackUserInfo);
          setSuccess('로그인 성공!');
          setTimeout(() => navigate('/'), 1000);
        }
      } else {
        setError('로그인 응답에 토큰이 없습니다.');
      }
    } catch (err: any) {
      console.error('로그인 에러:', err);
      if (err.response) {
        setError(err.response.data.message || '잘못된 사용자명 또는 비밀번호입니다.');
      } else if (err.request) {
        setError('서버에 연결할 수 없습니다. 서버가 실행중인지 확인해주세요.');
      } else {
        setError('로그인 중 오류가 발생했습니다.');
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
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 4 }}>로그인</Typography>
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
        
        <TextField fullWidth margin="normal" name="username" label="아이디" value={form.username} onChange={handleChange} sx={textFieldStyle} />
        <TextField fullWidth margin="normal" name="password" label="비밀번호" type="password" value={form.password} onChange={handleChange} sx={textFieldStyle} />
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2, fontWeight: 600, background: '#238636', color: 'white', borderRadius: 2, boxShadow: 'none', '&:hover': { background: '#2ea043' } }}>
          로그인
        </Button>
      </Box>
    </Box>
  );
}
