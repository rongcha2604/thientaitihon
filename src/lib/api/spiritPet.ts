import apiClient from './client';
import axios from 'axios';
import { API_BASE_URL } from './config.js';

export interface SpiritPetLevel {
  star: number;
  name_vi: string;
  effect: Record<string, any>;
  unlock_cost: {
    STAR: number;
    EVOL_CRYSTAL?: number;
  };
}

export interface SpiritPet {
  id: string;
  code: string;
  baseNameVi: string;
  maxStars: number;
  levels: SpiritPetLevel[];
  theme?: string;
  color?: string;
  specialEffect?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSpiritPet {
  id: string;
  userId: string;
  spiritPetId: string;
  currentLevel: number;
  isActive: boolean;
  unlockedAt: string;
  lastUpgradedAt?: string;
  spiritPet: SpiritPet;
}

export interface SpiritPetsResponse {
  pets: SpiritPet[];
}

export interface UserSpiritPetsResponse {
  pets: UserSpiritPet[];
}

export interface UnlockPetRequest {
  spiritPetId: string;
}

export interface UnlockPetResponse {
  message: string;
  userPet: UserSpiritPet;
  remainingStars: number;
}

export interface UpgradePetRequest {
  userSpiritPetId: string;
}

export interface UpgradePetResponse {
  message: string;
  userPet: UserSpiritPet;
  remainingStars: number;
}

export interface ToggleActiveRequest {
  userSpiritPetId: string;
}

export interface ToggleActiveResponse {
  message: string;
  isActive: boolean;
}

// Lấy danh sách tất cả linh vật (public, không cần auth)
export async function getSpiritPets(): Promise<SpiritPetsResponse> {
  // Public endpoint - dùng axios trực tiếp không qua apiClient
  const response = await axios.get<SpiritPetsResponse>(`${API_BASE_URL}/api/spirit-pets/pets`);
  return response.data;
}

// Lấy linh vật user đã sở hữu
export async function getUserSpiritPets(): Promise<UserSpiritPetsResponse> {
  const response = await apiClient.get<UserSpiritPetsResponse>('/api/spirit-pets/user/pets');
  return response.data;
}

// Unlock linh vật cấp 1
export async function unlockSpiritPet(data: UnlockPetRequest): Promise<UnlockPetResponse> {
  const response = await apiClient.post<UnlockPetResponse>('/api/spirit-pets/user/pets/unlock', data);
  return response.data;
}

// Nâng cấp linh vật
export async function upgradeSpiritPet(data: UpgradePetRequest): Promise<UpgradePetResponse> {
  const response = await apiClient.post<UpgradePetResponse>('/api/spirit-pets/user/pets/upgrade', data);
  return response.data;
}

// Toggle active linh vật (equip/unequip)
export async function toggleActiveSpiritPet(data: ToggleActiveRequest): Promise<ToggleActiveResponse> {
  const response = await apiClient.post<ToggleActiveResponse>('/api/spirit-pets/user/pets/toggle-active', data);
  return response.data;
}

