import { IAuditFields } from "./common";

export interface IPostResponse extends IAuditFields {
  id: string;
  title: string;
  slug: string;
  mainImage: string | null;
  content: string;
  userId: string;
  score: number;
  readingTime: number;

  author: string;
  authorUsername: string;
  authorNickname: string;
  authorBio: string;
  authorRole: string;
  authorAvatar: string;

  topicId: string;
  topicTitle: string;
  topicSlug: string;
  topicTagId: string;

  parentId: string | null;
  parentTitle: string | null;
  parentSlug: string | null;
  parentContent: string | null;
  parentUserId: string | null;
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
  topicId: string;
  parentId: string | null;
  mainImage: string | null;
}
