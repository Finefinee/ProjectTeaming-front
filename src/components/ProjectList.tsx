import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../api/project';
import type { ProjectResponse } from '../types';
import { useAuth } from '../hooks/useAuth';
import ErrorMessage from './ErrorMessage';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    console.log('ProjectList - token:', token);
    if (token) {
      console.log('ProjectList - getProjects 호출 중...');
      getProjects(token)
        .then((res: any) => {
          console.log('ProjectList - getProjects 응답:', res);
          setProjects(res.data);
        })
        .catch((error: any) => {
          console.error('프로젝트 목록 조회 오류:', error);
          console.error('오류 응답:', error.response);
          console.error('오류 상태:', error.response?.status);
          console.error('오류 데이터:', error.response?.data);
          setError('프로젝트 목록을 불러올 수 없습니다.');
        });
    } else {
      console.log('ProjectList - 토큰이 없습니다');
    }
  }, [token]);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#000', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: '#fff' }}>프로젝트 목록</h2>
        <button
          style={{ background: '#000', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '1rem', padding: '8px 18px', cursor: 'pointer', boxShadow: 'none' }}
          onClick={() => navigate('/project/new')}
        >
          새 프로젝트 만들기
        </button>
      </div>
      <ErrorMessage message={error} />
      {projects.map((p, idx) => (
        <div className="card" key={idx} style={{ background: '#000', color: '#fff', border: '1px solid #fff', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>{p.title}</div>
          <div style={{ marginBottom: 8 }}>{p.content}</div>
          <div style={{ color: '#fff', fontSize: '0.95rem' }}>관리자: {p.projectManager}</div>
          <div style={{ color: '#fff', fontSize: '0.95rem' }}>멤버: {p.projectMember}</div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
