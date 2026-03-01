export interface IMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IAuditFields {
  createdAt: Date;
  updatedAt: Date;
}

export interface IBaseResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}
