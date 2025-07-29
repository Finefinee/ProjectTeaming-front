import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Alert } from "@mui/material";
import { login, signUp } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getUserInfoFromToken } from "../utils/jwt";

const AuthForm: React.FC = () => {
  const { login: setToken } = useAuth();
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    class_code: ""
  });
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    
    try {
      const res = await login(loginForm) as { data: { token: string; user?: { id: number; username: string; name?: string } } };
      console.log('AuthForm Login response:', res);
      
      if (res.data && res.data.token) {
        console.log('Token received:', res.data.token);
        
        const userInfo = getUserInfoFromToken(res.data.token);
        
        if (userInfo) {
          console.log('AuthForm - Final user info to save:', userInfo);
          setToken(res.data.token, userInfo);
          setLoginSuccess("로그인 성공!");
          
          setTimeout(() => {
            console.log('AuthForm 리다이렉트 전 localStorage 확인:');
            console.log('token:', localStorage.getItem('token'));
            console.log('user:', localStorage.getItem('user'));
            window.location.href = '/';
          }, 1000);
        } else {
          const fallbackUserInfo = {
            id: Date.now(),
            username: loginForm.username,
            name: loginForm.username
          };
          setToken(res.data.token, fallbackUserInfo);
          setLoginSuccess("로그인 성공!");
          setTimeout(() => navigate('/'), 1000);
        }
      }
    } catch (err: any) {
      console.error('로그인 에러:', err);
      if (err.response) {
        setLoginError(err.response.data.message || '로그인에 실패했습니다.');
      } else {
        setLoginError('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    
    try {
      await signUp({ ...signupForm, class_code: Number(signupForm.class_code) });
      setSignupSuccess("회원가입 성공!");
    } catch (err: any) {
      console.error('회원가입 에러:', err);
      if (err.response) {
        setSignupError(err.response.data.message || '회원가입에 실패했습니다.');
      } else {
        setSignupError('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  const textFieldStyle = {
    input: { color: 'white' },
    label: { color: 'white' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#30363d' },
    '& .MuiInputLabel-root': { color: 'white' },
    '& .MuiInputLabel-shrink': { color: 'white' },
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', gap: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 350, width: '100%', background: '#161b22', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.12)', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 700, mb: 2 }}>로그인</Typography>
        <Box component="form" onSubmit={handleLoginSubmit}>
          
          {loginError && (
            <Alert severity="error" sx={{ mb: 2, backgroundColor: '#21262d', color: '#f85149', border: '1px solid #f85149' }}>
              {loginError}
            </Alert>
          )}
          
          {loginSuccess && (
            <Alert severity="success" sx={{ mb: 2, backgroundColor: '#21262d', color: '#238636', border: '1px solid #238636' }}>
              {loginSuccess}
            </Alert>
          )}
          
          <TextField fullWidth margin="normal" name="username" label="아이디" value={loginForm.username} onChange={handleLoginChange} sx={textFieldStyle} />
          <TextField fullWidth margin="normal" name="password" label="비밀번호" type="password" value={loginForm.password} onChange={handleLoginChange} sx={textFieldStyle} />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2, fontWeight: 600, background: '#238636', color: 'white', borderRadius: 2, boxShadow: 'none', '&:hover': { background: '#2ea043' } }}>
            로그인
          </Button>
        </Box>
      </Paper>
      <Paper sx={{ p: 4, maxWidth: 350, width: '100%', background: '#161b22', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.12)', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 700, mb: 2 }}>회원가입</Typography>
        <Box component="form" onSubmit={handleSignupSubmit}>
          
          {signupError && (
            <Alert severity="error" sx={{ mb: 2, backgroundColor: '#21262d', color: '#f85149', border: '1px solid #f85149' }}>
              {signupError}
            </Alert>
          )}
          
          {signupSuccess && (
            <Alert severity="success" sx={{ mb: 2, backgroundColor: '#21262d', color: '#238636', border: '1px solid #238636' }}>
              {signupSuccess}
            </Alert>
          )}
          
          <TextField fullWidth margin="normal" name="name" label="이름" value={signupForm.name} onChange={handleSignupChange} sx={textFieldStyle} />
          <TextField fullWidth margin="normal" name="email" label="이메일" value={signupForm.email} onChange={handleSignupChange} sx={textFieldStyle} />
          <TextField fullWidth margin="normal" name="class_code" label="학번" value={signupForm.class_code} onChange={handleSignupChange} sx={textFieldStyle} />
          <TextField fullWidth margin="normal" name="username" label="아이디" value={signupForm.username} onChange={handleSignupChange} sx={textFieldStyle} />
          <TextField fullWidth margin="normal" name="password" label="비밀번호" type="password" value={signupForm.password} onChange={handleSignupChange} sx={textFieldStyle} />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2, fontWeight: 600, background: '#0969da', color: 'white', borderRadius: 2, boxShadow: 'none', '&:hover': { background: '#218bff' } }}>
            회원가입
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthForm;
 