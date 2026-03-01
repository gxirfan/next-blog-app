import { IAuditFields } from "./common";

export interface ITopicResponse extends IAuditFields {
  id: number;
  title: string;
  slug: string;
  content: string;
  tagId: number;
  tagTitle: string;
  tagSlug: string;
  tagDescription: string;
  userId: number;
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
