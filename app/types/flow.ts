import { IAuditFields } from "./common";

export interface IFlow extends IAuditFields {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    nickname: string;
    role: string;
    avatar?: string;
  };
  parentId?: number;
  parentContent?: string;
  parentSlug?: string;
  slug: string;
  replyCount?: number;
}
