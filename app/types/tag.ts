import { IAuditFields } from "./common";

export interface ITagResponse extends IAuditFields {
  id: number;
  title: string;
  description: string;
  slug: string;
  userId: number;
  authorNickname: string;
  author: string;
  authorAvatar: string;
  authorUsername: string;
  authorRole: string;
  email: string;
  status: boolean;
}
