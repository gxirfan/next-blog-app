import { IAuditFields } from "./common";

export interface IUserResponse extends IAuditFields {
  id: number;
  username: string;
  nickname: string;
  firstName: string;
  lastName: string;
  bio?: string;
  email: string;
  isEmailVerified: boolean;
  isEmailPublic: boolean;
  role: string;
  status: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
  birthDate: Date;
  avatar?: string;
  cover?: string;
  location?: string;
  gender?: string;
}
