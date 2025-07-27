import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createInvite, CreateInviteDto } from '../api/invite';
import { getProjects, Project } from '../api/project';

export default function CreateInvitePage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [managedProjects, setManagedProjects] = useState<Project[]>([]); // 팀장인 프로젝트만

  const [formData, setFormData] = useState<CreateInviteDto>({
    projectId: 0, // 명시적으로 0으로 초기화
    projectMemberUsername: ''
  });

    // 컴포넌트 렌더링 시 디버깅
  console.log('CreateInvitePage 렌더링');

  // 프로젝트 목록 로드
  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) return;
      
      try {
        console.log('프로젝트 목록 조회 시작...');
        const actualToken = token || localStorage.getItem('token');
        if (actualToken) {
        const response = await getProjects(actualToken);
        console.log('프로젝트 목록 응답:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          console.log('=== 프로젝트 목록 상세 ===');
          
          // 백엔드에서 잘못된 형식으로 오는 데이터 정리
          const cleanedProjects = response.data.map((project: any) => {
            let cleanedProjectMember = project.projectMember;
            
            // projectMember가 Java toString() 형태인 경우 정리
            if (typeof project.projectMember === 'string' && project.projectMember.includes('Member(')) {
              // "Member(id=1, username=FineFinee, ..." 에서 username만 추출
              const usernames = project.projectMember
                .match(/username=([^,)]+)/g)
                ?.map((match: string) => match.replace('username=', ''))
                .join(', ') || '';
              cleanedProjectMember = usernames;
            }
            
            return {
              ...project,
              projectMember: cleanedProjectMember
            };
          });
          
          cleanedProjects.forEach((project: Project, index: number) => {
            console.log(`프로젝트 ${index}: ID=${project.id} (타입: ${typeof project.id}), Title=${project.title}, Manager=${project.projectManager}`);
          });
          
          // 현재 사용자 정보 확인
          const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
          console.log('현재 사용자:', currentUser);
          
          if (currentUser && currentUser.username) {
            // 팀장인 프로젝트만 필터링
            const userManagedProjects = cleanedProjects.filter((project: Project) => {
              const isManager = project.projectManager === currentUser.username;
              console.log(`프로젝트 "${project.title}": 매니저=${project.projectManager}, 현재유저=${currentUser.username}, 팀장여부=${isManager}`);
              return isManager;
            });
            
            console.log(`총 ${cleanedProjects.length}개 프로젝트 중 ${userManagedProjects.length}개가 팀장 프로젝트`);
            setProjects(cleanedProjects);
            setManagedProjects(userManagedProjects);
          } else {
            console.error('사용자 정보를 찾을 수 없습니다.');
            setError('사용자 정보를 확인할 수 없습니다.');
          }
        }
        }
      } catch (err) {
        console.error('프로젝트 목록 조회 실패:', err);
        setError('프로젝트 목록을 불러올 수 없습니다.');
      }
    };

    fetchProjects();
  }, [token]);

  // formData 변화 감지
  useEffect(() => {
    console.log('formData 변경:', formData);
  }, [formData]);

  const handleInputChange = (field: keyof CreateInviteDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('폼 제출 데이터:', formData);
    
    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!formData.projectId || formData.projectId <= 0) {
      setError('프로젝트를 선택해주세요.');
      return;
    }

    if (!formData.projectMemberUsername.trim()) {
      setError('초대할 사용자명을 입력해주세요.');
      return;
    }
    
    // 팀장 권한 재확인
    const selectedProject = managedProjects.find(p => p.id === formData.projectId);
    if (!selectedProject) {
      setError('선택한 프로젝트에 대한 팀장 권한이 없습니다.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('초대 생성 요청 데이터:');
      console.log('- projectId:', formData.projectId, '(타입:', typeof formData.projectId, ')');
      console.log('- projectMemberUsername:', formData.projectMemberUsername, '(타입:', typeof formData.projectMemberUsername, ')');
      console.log('- 전체 formData:', JSON.stringify(formData, null, 2));
      
      await createInvite(token, formData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/invites');
      }, 2000);
      
    } catch (err: any) {
      console.error('초대 생성 실패:', err);
      console.error('에러 응답:', err.response?.data);
      console.error('에러 상태:', err.response?.status);
      if (err.response?.status === 404) {
        setError('해당 사용자를 찾을 수 없습니다.');
      } else if (err.response?.status === 400) {
        setError('잘못된 요청입니다. 입력 정보를 확인해주세요.');
      } else {
        setError('초대 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
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
          초대를 생성하려면 먼저 로그인해주세요.
        </Typography>
      </Box>
    );
  }

  if (success) {
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
        <Typography variant="h4" sx={{ mb: 2, color: '#238636' }}>
          초대가 전송되었습니다!
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.7 }}>
          초대 목록으로 이동합니다...
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
      <Box sx={{ maxWidth: '600px', margin: '0 auto' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: 'white', 
            fontWeight: 700, 
            mb: 1,
            textAlign: 'center'
          }}
        >
          새 초대 보내기
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            mb: 4,
            textAlign: 'center'
          }}
        >
          프로젝트에 팀원을 초대해보세요!
        </Typography>

        <Card sx={{
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '8px',
        }}>
          <CardContent sx={{ padding: '24px' }}>
            <form onSubmit={handleSubmit}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                초대 정보
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2, backgroundColor: '#21262d', color: '#f85149' }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#7d8590', mb: 1 }}>
                  프로젝트 선택 *
                </Typography>
                <select
                  value={formData.projectId || ''}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    console.log(`=== 프로젝트 선택 이벤트 ===`);
                    console.log(`선택된 값: "${selectedValue}" (타입: ${typeof selectedValue})`);
                    console.log(`현재 formData.projectId: ${formData.projectId}`);
                    
                    if (selectedValue && selectedValue !== '') {
                      const id = parseInt(selectedValue, 10);
                      console.log(`변환된 ID: ${id} (타입: ${typeof id})`);
                      
                      if (!isNaN(id) && id > 0) {
                        console.log(`ID 유효함, formData 업데이트 중...`);
                        setFormData(prev => {
                          const newData = { ...prev, projectId: id };
                          console.log(`formData 업데이트: ${JSON.stringify(prev)} -> ${JSON.stringify(newData)}`);
                          return newData;
                        });
                      } else {
                        console.error(`유효하지 않은 ID: ${id}`);
                      }
                    } else {
                      console.log(`빈 값 또는 기본값 선택됨`);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#21262d',
                    color: '#e6edf3',
                    border: '1px solid #30363d',
                    borderRadius: '4px',
                    fontSize: '16px',
                  }}
                >
                  <option value="" key="placeholder">
                    {managedProjects.length === 0 ? '팀장인 프로젝트가 없습니다' : '프로젝트를 선택하세요'}
                  </option>
                  {managedProjects.map((project: Project) => (
                    <option key={`project-${project.id}`} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
                
                {managedProjects.length === 0 && (
                  <Typography variant="caption" sx={{ color: '#f85149', mt: 1, display: 'block' }}>
                    초대를 보내려면 프로젝트의 팀장이어야 합니다.
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#7d8590', mb: 1 }}>
                  초대할 사용자명 *
                </Typography>
                <TextField
                  fullWidth
                  value={formData.projectMemberUsername}
                  onChange={(e) => handleInputChange('projectMemberUsername', e.target.value)}
                  placeholder="username을 입력하세요"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#21262d',
                      color: '#e6edf3',
                      '& fieldset': { borderColor: '#30363d' },
                      '&:hover fieldset': { borderColor: '#58a6ff' },
                      '&.Mui-focused fieldset': { borderColor: '#58a6ff' },
                      '& input::placeholder': {
                        color: '#7d8590',
                        opacity: 1,
                      },
                    },
                  }}
                  required
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate('/invites')}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    borderColor: '#30363d',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: '#58a6ff',
                    },
                    flex: 1,
                  }}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    backgroundColor: '#238636',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#2ea043',
                    },
                    flex: 1,
                  }}
                >
                  {loading ? '전송 중...' : '초대 보내기'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
