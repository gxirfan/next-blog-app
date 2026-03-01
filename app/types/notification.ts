import { IAuditFields } from "./common";

export interface INotification extends IAuditFields {
  id: number;
  senderId: number;
  senderUsername: string;
  senderAvatar: string;
  senderNickname: string;

  type: "vote_up" | "vote_down" | "flow_reply" | "post_reply";
  message: string;
  isRead: boolean;
  targetUrl: string;
}
