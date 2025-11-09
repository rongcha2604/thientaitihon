
export enum Page {
  Hoc = 'Hoc',
  OnTap = 'OnTap',
  Album = 'Album',
  HoSo = 'HoSo',
  PhuHuynh = 'PhuHuynh',
}

export interface Week {
  id: number;
  title: string;
  date: string;
  status: 'completed' | 'inprogress' | 'locked';
  progress?: number;
  totalTasks?: number;
  unlockCost?: number;
}

export interface AlbumItem {
    id: string | number; // String từ API, number từ mock
    name: string;
    category: 'character' | 'accessory' | 'frame' | 'sticker';
    unlocked?: boolean; // Legacy: từ mock data
    owned?: boolean; // Mới: từ API
    image: string;
    price?: number; // Giá coins để đổi
    description?: string; // Mô tả vật phẩm
}
