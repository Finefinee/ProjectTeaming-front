import React from 'react';


const features = [
  {
    title: '프로젝트 생성/관리',
    desc: '팀 프로젝트를 손쉽게 만들고 관리하세요.',
    icon: '📁',
  },
  {
    title: '초대 기능',
    desc: '팀원을 초대하고, 수락/거절을 관리할 수 있습니다.',
    icon: '👥',
  },
  {
    title: 'JWT 인증',
    desc: '안전한 로그인과 회원가입을 제공합니다.',
    icon: '🔒',
  },
  {
    title: '모던 UI',
    desc: 'GitHub 스타일의 카드, 버튼, 네비게이션으로 쾌적한 경험을 제공합니다.',
    icon: '💻',
  },
];

const ServiceIntro: React.FC = () => {
  const [active, setActive] = React.useState(0);
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center', position: 'relative', background: '#000', boxShadow: 'none', border: 'none', padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
        {/* Teaming 로고 아이콘 */}
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 첫 번째 사람 */}
          <circle cx="11" cy="8" r="4" fill="#4285f4"/>
          <ellipse cx="11" cy="20" rx="7" ry="5" fill="#4285f4"/>
          {/* 두 번째 사람 */}
          <circle cx="21" cy="8" r="4" fill="#4285f4"/>
          <ellipse cx="21" cy="20" rx="7" ry="5" fill="#4285f4"/>
        </svg>
        <h1 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: 0, color: '#fff' }}>Teaming</h1>
      </div>
      <p style={{ fontSize: '1.1rem', color: '#fff', marginBottom: 24 }}>
        개발자와 팀원들이 쉽고 빠르게 프로젝트를 생성하고, 초대하고, 협업할 수 있도록 돕는 <b>Teaming</b> 서비스입니다.<br />
        <span style={{ color: '#fff', fontWeight: 500 }}>GitHub</span>의 깔끔한 UI를 참고하여 누구나 직관적으로 사용할 수 있습니다.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
        {features.map((f, i) => (
          <button
            key={f.title}
            className={`button${active === i ? ' active' : ''}`}
            style={{ background: active === i ? '#fff' : '#000', color: active === i ? '#000' : '#fff', fontSize: '1.1rem', padding: '8px 12px', border: 'none', boxShadow: 'none' }}
            onClick={() => setActive(i)}
          >
            {f.icon} {f.title}
          </button>
        ))}
      </div>
      <div style={{ minHeight: 60, transition: 'all 0.3s', fontSize: '1.08rem', color: '#fff', marginBottom: 16 }}>
        <strong>{features[active].title}</strong> - {features[active].desc}
      </div>
      <div style={{ marginTop: 32, color: '#fff', fontSize: '0.95rem' }}>
        지금 회원가입 후 팀 프로젝트를 시작해보세요!
      </div>
      <button
        className="button"
        style={{ marginTop: 24, maxWidth: 220, background: '#fff', color: '#000', fontWeight: 600, border: 'none', boxShadow: 'none' }}
        onClick={() => {
          const loginForm = document.querySelector('.card form');
          if (loginForm) {
            loginForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }}
      >
        계정이 없다면? 회원가입 하기
      </button>
    </div>
  );
};

export default ServiceIntro;
