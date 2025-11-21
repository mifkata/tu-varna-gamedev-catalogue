import type {
  GameDeveloperListItem,
  GameDeveloperResponse,
  CreateGameDeveloperDto,
  UpdateGameDeveloperDto,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const gameDevelopersApi = {
  async getAll(): Promise<GameDeveloperListItem[]> {
    const res = await fetch(`${API_URL}/api/game-developers`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch game developers');
    return res.json();
  },

  async getById(id: string): Promise<GameDeveloperResponse> {
    const res = await fetch(`${API_URL}/api/game-developers/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch game developer');
    return res.json();
  },

  async create(data: CreateGameDeveloperDto): Promise<GameDeveloperResponse> {
    const res = await fetch(`${API_URL}/api/game-developers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create game developer');
    return res.json();
  },

  async update(id: string, data: UpdateGameDeveloperDto): Promise<GameDeveloperResponse> {
    const res = await fetch(`${API_URL}/api/game-developers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update game developer');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/game-developers/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete game developer');
  },

  async bulkDelete(ids: string[]): Promise<void> {
    const res = await fetch(`${API_URL}/api/game-developers/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Failed to bulk delete game developers');
  },
};
