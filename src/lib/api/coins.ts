import apiClient from './client';

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface CoinsResponse {
  coins: number;
}

export interface AwardCoinsRequest {
  amount: number;
  reason: string;
  metadata?: Record<string, any>;
}

export interface AwardCoinsResponse {
  coins: number;
  awarded: number;
  reason: string;
}

export interface CoinTransactionsResponse {
  transactions: CoinTransaction[];
}

// Lấy số coins của user
export async function getUserCoins(): Promise<CoinsResponse> {
  const response = await apiClient.get<CoinsResponse>('/api/coins');
  return response.data;
}

// Tặng coins cho user
export async function awardCoins(data: AwardCoinsRequest): Promise<AwardCoinsResponse> {
  const response = await apiClient.post<AwardCoinsResponse>('/api/coins/award', data);
  return response.data;
}

// Lấy lịch sử giao dịch coins
export async function getCoinTransactions(limit?: number, offset?: number): Promise<CoinTransactionsResponse> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());
  
  const response = await apiClient.get<CoinTransactionsResponse>(
    `/api/coins/transactions?${params.toString()}`
  );
  return response.data;
}

