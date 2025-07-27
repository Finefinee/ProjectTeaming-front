import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getInvites, acceptInvite, refuseInvite } from '../api/invite';
import { InviteResponseDto } from '../types';
import { useAuth } from '../hooks/useAuth';

const InviteList: React.FC = () => {
  const [invites, setInvites] = useState<InviteResponseDto[]>([]);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    getInvites(token)
      .then((res) => setInvites((res as { data: InviteResponseDto[] }).data))
      .catch(() => setError('초대 목록을 불러올 수 없습니다.'));
  }, [token]);

  // 로그인하지 않은 경우 메시지 표시
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
        padding: '20px',
      }}>
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
          로그인이 필요합니다
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.7, textAlign: 'center' }}>
          초대 목록을 보려면 먼저 로그인해주세요.
        </Typography>
      </Box>
    );
  }

  const handleAccept = async (inviteId: number) => {
    if (!token) return;
    try {
      await acceptInvite(token, inviteId);
      setInvites(invites.map(i => i.id === inviteId ? { ...i, accepted: true } : i));
    } catch {
      setError('초대 수락에 실패했습니다.');
    }
  };

  const handleRefuse = async (inviteId: number) => {
    if (!token) return;
    try {
      await refuseInvite(token, inviteId);
      setInvites(invites.filter(i => i.id !== inviteId));
    } catch {
      setError('초대 거절에 실패했습니다.');
    }
  };

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
            초대 목록
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/invite/new')}
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
            새 초대 보내기
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
          받은 프로젝트 초대를 확인하고 응답해보세요!
        </Typography>

        {error && (
          <Box sx={{
            backgroundColor: '#21262d',
            border: '1px solid #f85149',
            borderRadius: '8px',
            padding: '16px',
            mb: 3,
            textAlign: 'center'
          }}>
            <Typography sx={{ color: '#f85149' }}>
              {error}
            </Typography>
          </Box>
        )}

        {invites.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8 
          }}>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
              받은 초대가 없습니다
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              프로젝트 초대를 기다려보세요!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: 3 
          }}>
            {invites.map(invite => (
              <Card key={invite.id} sx={{
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
                      프로젝트 초대
                    </Typography>
                    <Chip 
                      label={invite.accepted ? '수락됨' : '대기중'}
                      size="small"
                      sx={{
                        backgroundColor: invite.accepted ? '#238636' : '#f85149',
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)', 
                        mb: 1
                      }}
                    >
                      <strong>관리자:</strong> {invite.projectManagerUsername}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)' 
                      }}
                    >
                      <strong>초대받은 멤버:</strong> {invite.projectMemberUsername}
                    </Typography>
                  </Box>

                  {!invite.accepted && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => handleAccept(invite.id)}
                        sx={{
                          backgroundColor: '#238636',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#2ea043',
                          },
                          flex: 1,
                        }}
                      >
                        수락
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleRefuse(invite.id)}
                        sx={{
                          color: '#f85149',
                          borderColor: '#f85149',
                          '&:hover': {
                            backgroundColor: 'rgba(248, 81, 73, 0.1)',
                            borderColor: '#f85149',
                          },
                          flex: 1,
                        }}
                      >
                        거절
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InviteList;
