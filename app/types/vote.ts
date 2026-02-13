export interface IVoteStatusResponse {
    id: string;
    userId: string;
    username: string;
    nickname: string;
    postId: string;
    title: string;
    content: string;
    slug: string;
    type: string;
    direction: number;
    createdAt: Date;
    updatedAt: Date;
}