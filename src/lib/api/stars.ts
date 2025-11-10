import apiClient from './client';

export interface StarTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface StarsResponse {
  stars: number;
}

export interface AwardStarsRequest {
  amount: number;
  reason: string;
  metadata?: Record<string, any>;
}

export interface AwardStarsResponse {
  stars: number;
  awarded: number;
  reason: string;
}

export interface StarTransactionsResponse {
  transactions: StarTransaction[];
}

// Lấy số sao của user
export async function getUserStars(): Promise<StarsResponse> {
  const response = await apiClient.get<StarsResponse>('/api/stars');
  return response.data;
}

// Tặng sao cho user
export async function awardStars(data: AwardStarsRequest): Promise<AwardStarsResponse> {
  const response = await apiClient.post<AwardStarsResponse>('/api/stars/award', data);
  return response.data;
}

// Lấy lịch sử giao dịch sao
export async function getStarTransactions(limit?: number, offset?: number): Promise<StarTransactionsResponse> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());
  
  const response = await apiClient.get<StarTransactionsResponse>(
    `/api/stars/transactions?${params.toString()}`
  );
  return response.data;
}

