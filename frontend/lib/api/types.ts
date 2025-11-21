export interface GameDeveloperListItem {
  id: string;
  name: string;
  gamesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GameDeveloperResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGameDeveloperDto {
  name: string;
}

export interface UpdateGameDeveloperDto {
  name?: string;
}

export interface CategoryListItem {
  id: string;
  name: string;
  gamesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name?: string;
}

export interface GameDeveloperNested {
  id: string;
  name: string;
}

export interface CategoryNested {
  id: string;
  name: string;
}

export interface GameResponse {
  id: string;
  name: string;
  developer: GameDeveloperNested;
  category: CategoryNested;
  minCpu: number;
  minMemory: number;
  multiplayer: boolean;
  releaseYear: number;
  price: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGameDto {
  name: string;
  developerId: string;
  categoryId: string;
  minCpu: number;
  minMemory: number;
  multiplayer: boolean;
  releaseYear: number;
  price: number;
  amount: number;
}

export interface UpdateGameDto {
  name?: string;
  developerId?: string;
  categoryId?: string;
  minCpu?: number;
  minMemory?: number;
  multiplayer?: boolean;
  releaseYear?: number;
  price?: number;
  amount?: number;
}
