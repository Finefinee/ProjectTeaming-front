export interface InviteResponseDto {
  id: number;
  projectManagerUsername: string;
  projectMemberUsername: string;
  accepted: boolean;
}

export interface AcceptInviteRequestDto {
  inviteId: number;
}

export interface ProjectResponse {
  id: number;
  title: string;
  content: string;
  projectManager: string;
  projectMember: string;
  createdAt: string;
  updatedAt: string;
}
