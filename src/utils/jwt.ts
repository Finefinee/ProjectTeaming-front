// JWT 토큰 디코딩 및 검증 유틸리티

export interface TokenPayload {
  sub: string; // subject (username)
  name?: string;
  email?: string;
  class_code?: number;
  iat: number; // issued at
  exp: number; // expiration
}

// Base64 URL 디코딩 함수 (한글 지원)
function base64UrlDecode(str: string): string {
  // Base64 URL을 Base64로 변환
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // 패딩 추가
  while (str.length % 4) {
    str += '=';
  }
  
  try {
    // UTF-8 디코딩을 위해 decodeURIComponent와 escape 사용
    return decodeURIComponent(escape(atob(str)));
  } catch (error) {
    console.error('Base64 decode error:', error);
    return atob(str); // 폴백
  }
}

export function decodeJWT(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    const payload = parts[1];
    const decodedString = base64UrlDecode(payload);
    const decoded = JSON.parse(decodedString);
    console.log('Decoded JWT payload:', decoded);
    
    return decoded;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJWT(token);
    if (!payload) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (error) {
    console.error('Token expiration check error:', error);
    return true;
  }
}

export function getUserInfoFromToken(token: string) {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  // 한글 이름이 제대로 디코딩되었는지 확인
  console.log('JWT에서 추출한 이름:', payload.name);
  console.log('JWT에서 추출한 사용자명:', payload.sub);
  
  return {
    id: Date.now(), // 임시 ID
    username: payload.sub,
    name: payload.name || payload.sub,
    email: payload.email,
    class_code: payload.class_code
  };
}
