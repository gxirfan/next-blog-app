import { IAuditFields } from "./common";

export interface IPostResponse extends IAuditFields {
  id: number;
  title: string;
  slug: string;
  mainImage: string | null;
  content: string;
  userId: number;
  score: number;
  readingTime: number;

  author: string;
  authorUsername: string;
  authorNickname: string;
  authorBio: string;
  authorRole: string;
  authorAvatar: string;

  topicId: number;
  topicTitle: string;
  topicSlug: string;
  topicTagId: number;

  parentId: number | null;
  parentTitle: string | null;
  parentSlug: string | null;
  parentContent: string | null;
  parentUserId: number | null;
  parentAuthor: string | null;
  parentAuthorUsername: string | null;
  parentAuthorNickname: string | null;
  parentAuthorBio: string | null;
  parentAuthorRole: string | null;
  parentAuthorAvatar: string | null;

  viewCount: number;
  postCount: number;

  lastPostAt: Date;

  status: boolean;
}

export interface ICreatePostDto {
  title: string;
  content: string;
  topicId: number;
  parentId: number | null;
  mainImage: string | null;
}
