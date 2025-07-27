import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

// axios interceptor 추가 (디버깅용)
axios.interceptors.request.use(
  (config) => {
    console.log('🚀 Axios 요청:', config.method?.toUpperCase(), config.url);
    console.log('🚀 Headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('🚨 Axios 요청 오류:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log('✅ Axios 응답:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('🚨 Axios 응답 오류:', error.response?.status, error.config?.url);
    console.error('🚨 오류 세부사항:', error.response?.data);
    return Promise.reject(error);
  }
);

export interface Project {
  id: number;
  title: string;          // name -> title로 변경
  content: string;        // description -> content로 변경
  projectManager: string;
  projectMember: string;  // 백엔드 응답에 맞게 수정
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;           // 프론트엔드에서는 name 사용
  description: string;    // 프론트엔드에서는 description 사용
  technologies: string[];
}

export interface JoinProjectDto {
  projectId: number;
  message?: string;
}

// 프로젝트 목록 조회
export const getProjects = async (token?: string) => {
  console.log('=== getProjects 시작 ===');
  console.log('입력된 token:', token);
  console.log('token 길이:', token?.length);
  console.log('token 첫 20자:', token?.substring(0, 20));
  
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  console.log('생성된 headers:', headers);
  console.log('Authorization 헤더:', headers.Authorization);
  
  const config = {
    method: 'GET',
    url: `${BASE_URL}/project`,
    headers: headers
  };
  console.log('axios config:', config);
  
  try {
    console.log('axios 요청 전송 중...');
    const response = await axios.get(`${BASE_URL}/project`, { headers });
    console.log('getProjects 성공:', response);
    return response;
  } catch (error: any) {
    console.error('getProjects 오류:', error);
    console.error('오류 응답:', error.response);
    console.error('요청 config:', error.config);
    console.error('요청 headers:', error.config?.headers);
    throw error;
  }
};

// 프로젝트 상세 조회
export const getProjectById = async (projectId: number, token?: string) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return axios.get(`${BASE_URL}/project/${projectId}`, { headers });
};

// 프로젝트 생성
export const createProject = async (data: CreateProjectDto, token: string) => {
  // 백엔드 스키마에 맞게 필드 매핑
  const backendData = {
    title: data.name,           // name -> title
    content: data.description,  // description -> content
    // project_manager는 백엔드에서 JWT 토큰으로부터 자동 설정될 것으로 예상
  };
  
  console.log('createProject - 원본 데이터:', data);
  console.log('createProject - 백엔드 전송 데이터:', backendData);
  
  return axios.post(`${BASE_URL}/project`, backendData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// 프로젝트 수정
export const updateProject = async (projectId: number, data: Partial<CreateProjectDto>, token: string) => {
  return axios.patch(`${BASE_URL}/project`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// 프로젝트 삭제
export const deleteProject = async (projectId: number, token: string) => {
  return axios.delete(`${BASE_URL}/project`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { projectId } // DELETE 요청의 body에 projectId 포함
  });
};

// 프로젝트 참여 요청 (백엔드에 해당 엔드포인트가 없어서 주석 처리)
// export const joinProject = async (data: JoinProjectDto, token: string) => {
//   return axios.post(`${BASE_URL}/projects/join`, data, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };

// 내가 참여한 프로젝트 목록 (백엔드에 해당 엔드포인트가 없어서 주석 처리)
// export const getMyProjects = async (token: string) => {
//   return axios.get(`${BASE_URL}/projects/my`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };

// 프로젝트 멤버 초대 (백엔드에 해당 엔드포인트가 없어서 주석 처리)
// export const inviteToProject = async (projectId: number, username: string, token: string) => {
//   return axios.post(`${BASE_URL}/projects/${projectId}/invite`, { username }, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };
