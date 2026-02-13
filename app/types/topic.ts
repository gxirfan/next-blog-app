import { IAuditFields } from "./common";

export interface ITopicResponse extends IAuditFields {
    id: string;
    title: string;
    slug: string;
    content: string;
    tagId: string;
    tagTitle: string;
    tagSlug: string;
    tagDescription: string;
    userId: string;
    author: string;
    authorAvatar: string;
    authorUsername: string;
    authorNickname: string;
    authorBio: string;
    authorRole: string;
    lastPostAt: Date;
    postCount: number;
    viewCount: number;
    status: boolean;
}