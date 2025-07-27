import React from 'react';

interface Props {
  lang: 'ko' | 'en';
}

const LoginRequired: React.FC<Props> = ({ lang }) => (
  <div className="card" style={{ marginTop: 40, textAlign: 'center', fontSize: '1.1rem', color: '#fff' }}>
    {lang === 'ko' ? '이 페이지를 사용하려면 로그인해주세요.' : 'Please log in to use this page.'}
  </div>
);

export default LoginRequired;
