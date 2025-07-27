import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Chip,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createProject, CreateProjectDto } from '../api/project';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CreateProjectDto>({
    name: '',
    description: '',
    technologies: []
  });

  const [newTech, setNewTech] = useState('');

  const handleInputChange = (field: keyof CreateProjectDto, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!formData.name.trim()) {
      setError('프로젝트 이름을 입력해주세요.');
      return;
    }

    if (!formData.description.trim()) {
      setError('프로젝트 설명을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await createProject(formData, token);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/projects');
      }, 2000);
      
    } catch (err: any) {
      console.error('프로젝트 생성 실패:', err);
      setError('프로젝트 생성에 실패했습니다. 다시 시도해주세요.');
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
          프로젝트를 생성하려면 먼저 로그인해주세요.
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
          프로젝트가 생성되었습니다!
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.7 }}>
          프로젝트 목록으로 이동합니다...
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
          새 프로젝트 만들기
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            mb: 4,
            textAlign: 'center'
          }}
        >
          멋진 프로젝트를 시작해보세요!
        </Typography>

        <Card sx={{
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '8px',
        }}>
          <CardContent sx={{ padding: '24px' }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  프로젝트 정보
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2, backgroundColor: '#21262d', color: '#f85149' }}>
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="프로젝트 이름"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#0d1117',
                      color: 'white',
                      '& fieldset': { borderColor: '#30363d' },
                      '&:hover fieldset': { borderColor: '#58a6ff' },
                      '&.Mui-focused fieldset': { borderColor: '#58a6ff' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="프로젝트 설명"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#0d1117',
                      color: 'white',
                      '& fieldset': { borderColor: '#30363d' },
                      '&:hover fieldset': { borderColor: '#58a6ff' },
                      '&.Mui-focused fieldset': { borderColor: '#58a6ff' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                  required
                />

                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  기술 스택
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    label="기술 추가"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#0d1117',
                        color: 'white',
                        '& fieldset': { borderColor: '#30363d' },
                        '&:hover fieldset': { borderColor: '#58a6ff' },
                        '&.Mui-focused fieldset': { borderColor: '#58a6ff' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  />
                  <Button
                    onClick={handleAddTechnology}
                    variant="outlined"
                    sx={{ 
                      color: '#58a6ff',
                      borderColor: '#30363d',
                      '&:hover': { 
                        backgroundColor: 'rgba(88, 166, 255, 0.1)',
                        borderColor: '#58a6ff'
                      }
                    }}
                  >
                    추가
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {formData.technologies.map((tech, index) => (
                    <Chip
                      key={index}
                      label={tech}
                      onDelete={() => handleRemoveTechnology(tech)}
                      sx={{
                        backgroundColor: 'rgba(88, 166, 255, 0.1)',
                        color: '#58a6ff',
                        '& .MuiChip-deleteIcon': {
                          color: 'rgba(88, 166, 255, 0.7)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate('/projects')}
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
                  {loading ? '생성 중...' : '프로젝트 생성'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
