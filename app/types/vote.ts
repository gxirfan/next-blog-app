export interface IVoteStatusResponse {
  id: number;
  userId: number;
  username: string;
  nickname: string;
  postId: number;
  type: string;
  direction: number;
  post: {
    title: string;
    slug: string;
    content: string;
    score: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
