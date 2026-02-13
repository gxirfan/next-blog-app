import { IAuditFields } from "./common";

export interface INotification extends IAuditFields {
    id: string;
    senderId: string;
    senderUsername: string;
    senderAvatar: string;
    senderNickname: string;

    type: 'vote_up' | 'vote_down' | 'reply';
    message: string;
    isRead: boolean;
    targetUrl: string;
}
