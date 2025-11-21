'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categoriesApi } from '@/lib/api/categories';
import { gameDevelopersApi } from '@/lib/api/game-developers';
import { gamesApi } from '@/lib/api/games';
import type { CategoryListItem, GameDeveloperListItem } from '@/lib/api/types';

export default function NewGamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [name, setName] = useState('');
  const [developerId, setDeveloperId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minCpu, setMinCpu] = useState('');
  const [minMemory, setMinMemory] = useState('');
  const [multiplayer, setMultiplayer] = useState(false);
  const [releaseYear, setReleaseYear] = useState('');
  const [price, setPrice] = useState('');

  const [developers, setDevelopers] = useState<GameDeveloperListItem[]>([]);
  const [categories, setCategories] = useState<CategoryListItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  const isEditMode = !!editId;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (editId && developers.length > 0 && categories.length > 0) {
      loadGame(editId);
    }
  }, [editId, developers.length, categories.length]);

  async function loadData() {
    try {
      setDataLoading(true);
      const [devsData, catsData] = await Promise.all([
        gameDevelopersApi.getAll(),
        categoriesApi.getAll(),
      ]);
      setDevelopers(devsData);
      setCategories(catsData);
    } catch (err) {
      setError('Failed to load data');
      console.error('Failed to load data:', err);
    } finally {
      setDataLoading(false);
    }
  }

  async function loadGame(id: string) {
    try {
      const game = await gamesApi.getById(id);
      setName(game.name);
      setDeveloperId(game.developer.id);
      setCategoryId(game.category.id);
      setMinCpu(game.minCpu.toString());
      setMinMemory(game.minMemory.toString());
      setMultiplayer(game.multiplayer);
      setReleaseYear(game.releaseYear.toString());
      setPrice(game.price.toString());
    } catch (err) {
      setError('Failed to load game');
      console.error('Failed to load game:', err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!developerId) {
      setError('Developer is required');
      return;
    }

    if (!categoryId) {
      setError('Category is required');
      return;
    }

    const minCpuNum = parseFloat(minCpu);
    if (isNaN(minCpuNum) || minCpuNum < 0) {
      setError('Valid minimum CPU is required');
      return;
    }

    const minMemoryNum = parseInt(minMemory, 10);
    if (isNaN(minMemoryNum) || minMemoryNum < 0) {
      setError('Valid minimum memory is required');
      return;
    }

    const releaseYearNum = parseInt(releaseYear, 10);
    if (isNaN(releaseYearNum) || releaseYearNum < 1970 || releaseYearNum > 2100) {
      setError('Valid release year is required (1970-2100)');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Valid price is required');
      return;
    }

    try {
      setLoading(true);
      const gameData = {
        name: name.trim(),
        developerId,
        categoryId,
        minCpu: minCpuNum,
        minMemory: minMemoryNum,
        multiplayer,
        releaseYear: releaseYearNum,
        price: priceNum,
      };

      if (isEditMode) {
        await gamesApi.update(editId, gameData);
      } else {
        await gamesApi.create(gameData);
      }

      router.push('/games');
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} game. Please try again.`);
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} game:`, err);
    } finally {
      setLoading(false);
    }
  }

  if (dataLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href="/games"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Link>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Game' : 'Create New Game'}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Game Name</Label>
            <Input
              id="name"
              placeholder="Enter game name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="developer">Developer</Label>
            <select
              id="developer"
              value={developerId}
              onChange={(e) => setDeveloperId(e.target.value)}
              disabled={loading}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a developer</option>
              {developers.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loading}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minCpu">Minimum CPU (GHz)</Label>
              <Input
                id="minCpu"
                type="number"
                step="0.01"
                min="0"
                placeholder="2.5"
                value={minCpu}
                onChange={(e) => setMinCpu(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minMemory">Minimum Memory (MB)</Label>
              <Input
                id="minMemory"
                type="number"
                min="0"
                placeholder="4096"
                value={minMemory}
                onChange={(e) => setMinMemory(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="releaseYear">Release Year</Label>
            <Input
              id="releaseYear"
              type="number"
              min="1970"
              max="2100"
              placeholder="2024"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="29.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="multiplayer"
              checked={multiplayer}
              onCheckedChange={(checked) => setMultiplayer(checked as boolean)}
              disabled={loading}
            />
            <Label htmlFor="multiplayer" className="cursor-pointer">
              Multiplayer support
            </Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading
                ? isEditMode
                  ? 'Updating...'
                  : 'Creating...'
                : isEditMode
                  ? 'Update Game'
                  : 'Create Game'}
            </Button>
            <Link href="/games">
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
