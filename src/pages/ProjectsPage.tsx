import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Chip } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getProjects, Project } from '../api/project';

export default function ProjectsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // 토큰 상태 디버깅
        console.log('=== ProjectsPage fetchProjects 시작 ===');
        console.log('useAuth token:', token);
        console.log('localStorage token:', localStorage.getItem('token'));
        
        // localStorage에서 직접 토큰 가져오기
        const actualToken = token || localStorage.getItem('token');
        console.log('사용할 토큰:', actualToken);
        
        if (!actualToken) {
          console.log('토큰이 없어서 요청하지 않음');
          setError('로그인이 필요합니다.');
          return;
        }
        
        const response = await getProjects(actualToken);
        setProjects(response.data);
      } catch (err: any) {
        console.error('프로젝트 목록 조회 실패:', err);
        if (err.response?.status === 401) {
          setError('로그인이 필요합니다.');
        } else if (err.request) {
          setError('서버에 연결할 수 없습니다. 서버가 실행중인지 확인해주세요.');
        } else {
          setError('프로젝트 목록을 불러올 수 없습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '진행중': return '#238636';
      case '모집중': return '#0969da';
      case '완료': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  if (!token) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0d1117',
        color: 'white',
      }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          로그인이 필요합니다
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.7 }}>
          프로젝트를 보려면 먼저 로그인해주세요.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0d1117',
        color: 'white',
      }}>
        <Typography variant="h5">프로젝트를 불러오는 중...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0d1117',
        color: 'white',
      }}>
        <Typography variant="h4" sx={{ mb: 2, color: '#f85149' }}>
          오류 발생
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.7 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#0d1117',
      padding: '80px 20px 20px 20px',
    }}>
      <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 1,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: 'white', 
              fontWeight: 700,
            }}
          >
            프로젝트 목록
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/project/new')}
            sx={{
              backgroundColor: '#238636',
              color: 'white',
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#2ea043',
              },
            }}
          >
            새 프로젝트 만들기
          </Button>
        </Box>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            mb: 4,
            textAlign: 'center'
          }}
        >
          진행중인 프로젝트들을 확인하고 참여해보세요!
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: 3 
        }}>
          {projects.length === 0 ? (
            <Box sx={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              py: 8 
            }}>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                등록된 프로젝트가 없습니다
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                첫 번째 프로젝트를 만들어보세요!
              </Typography>
            </Box>
          ) : (
            projects.map((project) => (
              <Card key={project.id} sx={{
                backgroundColor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#58a6ff',
                },
              }}>
                <CardContent sx={{ padding: '20px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      {project.title}
                    </Typography>
                    <Chip 
                      label="진행중"
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor('진행중'),
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      mb: 2,
                      lineHeight: 1.5
                    }}
                  >
                    {project.content}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      관리자: {project.projectManager}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      멤버: {project.projectMember || '없음'}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      color: '#58a6ff',
                      borderColor: '#58a6ff',
                      '&:hover': {
                        backgroundColor: 'rgba(88, 166, 255, 0.1)',
                        borderColor: '#58a6ff',
                      },
                    }}
                  >
                    자세히 보기
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}
