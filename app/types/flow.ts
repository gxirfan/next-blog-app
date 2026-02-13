import { IAuditFields } from "./common";

export interface IFlow extends IAuditFields {
    id: string;
    content: string;
    author: {
        id: string;
        username: string;
        nickname: string;
        role: string;
        avatar?: string;
    };
    parentId?: string;
    parentContent?: string;
    parentSlug?: string;
    slug: string;
    replyCount?: number;
}