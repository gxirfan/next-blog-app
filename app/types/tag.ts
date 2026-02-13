import { IAuditFields } from './common';

export interface ITagResponse extends IAuditFields {
    id: string;
    title: string;
    description: string;
    slug: string;
    userId: string;
    authorNickname: string;
    author: string;
    authorAvatar: string;
    authorUsername: string;
    authorRole: string;
    email: string;
    status: boolean;
}