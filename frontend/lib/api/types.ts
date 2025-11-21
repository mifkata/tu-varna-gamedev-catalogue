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
