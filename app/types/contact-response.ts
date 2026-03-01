import { IAuditFields } from "./common";

export interface IContactResponse extends IAuditFields {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
