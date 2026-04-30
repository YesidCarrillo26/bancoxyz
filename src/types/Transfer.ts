export interface Payeer {
  document: string;
  name: string;
}

export interface Transfer {
  value: number;
  date: string;
  currency: string;
  payeer: Payeer;
}

export interface TransferListResponse {
  message: string;
  transfers: Transfer[];
}

export interface TransferRequest {
  value: number;
  currency: string;
  payeerDocument: string;
  transferDate: string;
}

export interface TransferResponse {
  message: string;
}
