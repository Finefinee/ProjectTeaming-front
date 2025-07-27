import { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  name?: string;
  email?: string;
  class_code?: number;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // 초기화 시 localStorage에서 데이터 로드
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    console.log('useAuth 초기화 - savedToken:', savedToken);
    console.log('useAuth 초기화 - savedUser:', savedUser);
    
    if (savedToken) {
      // 토큰 만료 확인
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        console.log('토큰 만료 시간 (exp):', payload.exp);
        console.log('현재 시간:', now);
        console.log('토큰 유효성:', payload.exp > now ? '유효' : '만료됨');
        
        if (payload.exp > now) {
          setToken(savedToken);
        } else {
          console.log('토큰이 만료되어 제거합니다');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('토큰 파싱 오류:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('useAuth 초기화 - parsedUser:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (newToken: string, userData?: User) => {
    console.log('useAuth login called with:', { newToken, userData }); // 디버깅용
    
    // 토큰 설정
    setToken(newToken);
    localStorage.setItem('token', newToken);
    console.log('Token set in localStorage:', newToken);
    
    if (userData) {
      console.log('Setting user data:', userData); // 디버깅용
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('User saved to localStorage:', JSON.stringify(userData)); // 디버깅용
      
      // 상태 업데이트 확인을 위한 지연된 로그
      setTimeout(() => {
        console.log('useAuth 상태 확인 - token:', newToken);
        console.log('useAuth 상태 확인 - user:', userData);
        console.log('localStorage 확인 - token:', localStorage.getItem('token'));
        console.log('localStorage 확인 - user:', localStorage.getItem('user'));
      }, 100);
    } else {
      console.log('No user data provided'); // 디버깅용
    }
  };

  const logout = () => {
    console.log('로그아웃 실행');
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.clear(); // 모든 localStorage 데이터 삭제
  };

  return { token, user, login, logout };
}

export default useAuth;
