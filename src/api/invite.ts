import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export interface CreateInviteDto {
  projectId: number;
  projectMemberUsername: string;
}

export const getInvites = async (token: string) => {
  return axios.get(`${BASE_URL}/invites`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const createInvite = async (token: string, data: CreateInviteDto) => {
  console.log('createInvite 호출됨:');
  console.log('- token:', token ? '존재함' : '없음');
  console.log('- data:', data);
  console.log('- URL:', `${BASE_URL}/invites`);
  
  // ID가 null이나 0이 아닌지 확인
  if (!data.projectId || data.projectId === 0) {
    throw new Error('프로젝트 ID가 유효하지 않습니다.');
  }
  
  if (!data.projectMemberUsername || data.projectMemberUsername.trim() === '') {
    throw new Error('사용자명이 유효하지 않습니다.');
  }
  
  // 확실히 숫자로 변환
  const requestData = {
    projectId: Number(data.projectId),
    projectMemberUsername: data.projectMemberUsername.trim()
  };
  
  console.log('- 검증된 요청 데이터:', requestData);
  
  try {
    const response = await axios.post(`${BASE_URL}/invites`, requestData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('createInvite 성공:', response.data);
    return response;
  } catch (error: any) {
    console.error('createInvite 실패:');
    console.error('- 상태 코드:', error.response?.status);
    console.error('- 에러 메시지:', error.response?.data);
    console.error('- 전체 에러:', error);
    throw error;
  }
};

export const acceptInvite = async (token: string, inviteId: number) => {
  return axios.post(`${BASE_URL}/invites/accept`, { inviteId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const refuseInvite = async (token: string, inviteId: number) => {
  return axios.delete(`${BASE_URL}/invites/refuse`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { inviteId }
  });
};
