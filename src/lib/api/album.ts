import apiClient from './client';

export interface AlbumItem {
  id: string;
  name: string;
  category: 'character' | 'accessory' | 'frame' | 'sticker';
  image: string;
  price: number;
  description?: string;
  isActive: boolean;
  owned?: boolean; // Thêm khi lấy từ API
  createdAt: string;
  updatedAt: string;
}

export interface AlbumItemsResponse {
  items: AlbumItem[];
}

export interface PurchaseItemRequest {
  albumItemId: string;
}

export interface PurchaseItemResponse {
  success: boolean;
  item: AlbumItem;
  coins: number;
}

export interface MyItemsResponse {
  items: AlbumItem[];
}

// Lấy danh sách vật phẩm album
export async function getAlbumItems(category?: string): Promise<AlbumItemsResponse> {
  const params = category ? `?category=${category}` : '';
  const response = await apiClient.get<AlbumItemsResponse>(`/album/items${params}`);
  return response.data;
}

// Đổi vật phẩm bằng coins
export async function purchaseItem(data: PurchaseItemRequest): Promise<PurchaseItemResponse> {
  const response = await apiClient.post<PurchaseItemResponse>('/album/purchase', data);
  return response.data;
}

// Lấy vật phẩm user đã sở hữu
export async function getMyItems(category?: string): Promise<MyItemsResponse> {
  const params = category ? `?category=${category}` : '';
  const response = await apiClient.get<MyItemsResponse>(`/album/my-items${params}`);
  return response.data;
}

