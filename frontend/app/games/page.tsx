'use client';

import { ArrowUpDown, Plus, Trash2, X, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { categoriesApi } from '@/lib/api/categories';
import { gameDevelopersApi } from '@/lib/api/game-developers';
import { gamesApi } from '@/lib/api/games';
import type { GameResponse, CategoryListItem, GameDeveloperListItem } from '@/lib/api/types';

type SortField =
  | 'name'
  | 'developer'
  | 'category'
  | 'releaseYear'
  | 'minCpu'
  | 'minMemory'
  | 'price'
  | 'amount'
  | 'multiplayer'
  | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface FilterTag {
  type: 'developer' | 'category' | 'multiplayer';
  id: string;
  name: string;
}

function GamesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [games, setGames] = useState<GameResponse[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [filterTags, setFilterTags] = useState<FilterTag[]>([]);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<GameResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDeveloperId, setEditDeveloperId] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editMinCpu, setEditMinCpu] = useState('');
  const [editMinMemory, setEditMinMemory] = useState('');
  const [editMultiplayer, setEditMultiplayer] = useState(false);
  const [editReleaseYear, setEditReleaseYear] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const [developers, setDevelopers] = useState<GameDeveloperListItem[]>([]);
  const [categories, setCategories] = useState<CategoryListItem[]>([]);

  useEffect(() => {
    loadGames();
    loadDropdownData();
  }, []);

  useEffect(() => {
    if (editId) {
      setEditModalOpen(true);
      loadGameForEdit(editId);
    } else {
      setEditModalOpen(false);
    }
  }, [editId]);

  useEffect(() => {
    // Apply filters
    let filtered = games.filter((game) =>
      game.name.toLowerCase().includes(filterText.toLowerCase()),
    );

    // Apply tag filters
    filterTags.forEach((tag) => {
      if (tag.type === 'developer') {
        filtered = filtered.filter((game) => game.developer.id === tag.id);
      } else if (tag.type === 'category') {
        filtered = filtered.filter((game) => game.category.id === tag.id);
      } else if (tag.type === 'multiplayer') {
        filtered = filtered.filter((game) => game.multiplayer === (tag.id === 'yes'));
      }
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: string | number | boolean;
      let bVal: string | number | boolean;

      if (sortField === 'developer') {
        aVal = a.developer.name;
        bVal = b.developer.name;
      } else if (sortField === 'category') {
        aVal = a.category.name;
        bVal = b.category.name;
      } else {
        aVal = a[sortField];
        bVal = b[sortField];
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        return sortOrder === 'asc'
          ? aVal === bVal
            ? 0
            : aVal
              ? 1
              : -1
          : aVal === bVal
            ? 0
            : aVal
              ? -1
              : 1;
      }

      return 0;
    });

    setFilteredGames(filtered);
  }, [games, filterText, filterTags, sortField, sortOrder]);

  async function loadGames() {
    try {
      setLoading(true);
      const data = await gamesApi.getAll();
      setGames(data);
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadDropdownData() {
    try {
      const [devsData, catsData] = await Promise.all([
        gameDevelopersApi.getAll(),
        categoriesApi.getAll(),
      ]);
      setDevelopers(devsData);
      setCategories(catsData);
    } catch (error) {
      console.error('Failed to load dropdown data:', error);
    }
  }

  async function loadGameForEdit(id: string) {
    try {
      const game = await gamesApi.getById(id);
      setEditName(game.name);
      setEditDeveloperId(game.developer.id);
      setEditCategoryId(game.category.id);
      setEditMinCpu(game.minCpu.toString());
      setEditMinMemory(game.minMemory.toString());
      setEditMultiplayer(game.multiplayer);
      setEditReleaseYear(game.releaseYear.toString());
      setEditPrice(game.price.toString());
      setEditAmount(game.amount.toString());
      setEditError('');
    } catch (error) {
      console.error('Failed to load game:', error);
      setEditError('Неуспешно зареждане на игра');
    }
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }

  function addFilterTag(type: 'developer' | 'category' | 'multiplayer', id: string, name: string) {
    const exists = filterTags.some((tag) => tag.type === type && tag.id === id);
    if (!exists) {
      setFilterTags([...filterTags, { type, id, name }]);
    }
  }

  function removeFilterTag(type: 'developer' | 'category' | 'multiplayer', id: string) {
    setFilterTags(filterTags.filter((tag) => !(tag.type === type && tag.id === id)));
  }

  function openDeleteDialog(game: GameResponse) {
    setGameToDelete(game);
    setDeleteDialogOpen(true);
  }

  async function handleDelete() {
    if (!gameToDelete) return;

    try {
      await gamesApi.delete(gameToDelete.id);
      await loadGames();
      setDeleteDialogOpen(false);
      setGameToDelete(null);
    } catch (error) {
      console.error('Failed to delete game:', error);
    }
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredGames.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredGames.map((game) => game.id)));
    }
  }

  function toggleSelectOne(id: string) {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  }

  function openBulkDeleteDialog() {
    setBulkDeleteDialogOpen(true);
  }

  async function handleBulkDelete() {
    try {
      await gamesApi.bulkDelete(Array.from(selectedIds));
      await loadGames();
      setSelectedIds(new Set());
      setBulkDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to bulk delete games:', error);
    }
  }

  function openEditModal(id: string) {
    router.push(`/games?edit=${id}`, { scroll: false });
  }

  function closeEditModal() {
    router.push('/games', { scroll: false });
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;

    setEditError('');

    if (!editName.trim()) {
      setEditError('Името е задължително');
      return;
    }

    if (!editDeveloperId) {
      setEditError('Разработчикът е задължителен');
      return;
    }

    if (!editCategoryId) {
      setEditError('Категорията е задължителна');
      return;
    }

    const minCpuNum = parseFloat(editMinCpu);
    if (isNaN(minCpuNum) || minCpuNum < 0) {
      setEditError('Валиден минимален CPU е задължителен');
      return;
    }

    const minMemoryNum = parseInt(editMinMemory, 10);
    if (isNaN(minMemoryNum) || minMemoryNum < 0) {
      setEditError('Валидна минимална памет е задължителна');
      return;
    }

    const releaseYearNum = parseInt(editReleaseYear, 10);
    if (isNaN(releaseYearNum) || releaseYearNum < 1970 || releaseYearNum > 2100) {
      setEditError('Валидна година на издаване е задължителна (1970-2100)');
      return;
    }

    const priceNum = parseFloat(editPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      setEditError('Валидна цена е задължителна');
      return;
    }

    const amountNum = parseInt(editAmount, 10);
    if (isNaN(amountNum) || amountNum < 0) {
      setEditError('Валидно количество е задължително');
      return;
    }

    try {
      setEditLoading(true);
      await gamesApi.update(editId, {
        name: editName.trim(),
        developerId: editDeveloperId,
        categoryId: editCategoryId,
        minCpu: minCpuNum,
        minMemory: minMemoryNum,
        multiplayer: editMultiplayer,
        releaseYear: releaseYearNum,
        price: priceNum,
        amount: amountNum,
      });
      await loadGames();
      closeEditModal();
    } catch (error) {
      setEditError('Неуспешно актуализиране на игра. Моля, опитайте отново.');
      console.error('Failed to update game:', error);
    } finally {
      setEditLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Зареждане...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Игри</h1>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <Button variant="destructive" onClick={openBulkDeleteDialog}>
              <Trash2 className="mr-2 h-4 w-4" />
              Изтрий избраните ({selectedIds.size})
            </Button>
          )}
          <Link href="/games/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Добави игра
            </Button>
          </Link>
        </div>
      </div>

      {filterTags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {filterTags.map((tag) => (
            <div
              onClick={() => removeFilterTag(tag.type, tag.id)}
              key={`${tag.type}-${tag.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm cursor-pointer"
            >
              <span>
                <strong>
                  {tag.type === 'developer' ? 'dev' : tag.type === 'category' ? 'cat' : 'multi'}:
                </strong>{' '}
                {tag.name}
              </span>
              <button className="hover:text-destructive cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4">
        <Input
          placeholder="Филтрирай по име..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={filteredGames.length > 0 && selectedIds.size === filteredGames.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-1">
                <Button variant="ghost" onClick={() => handleSort('developer')} className="-ml-4">
                  Разработчик
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-full">
                <Button variant="ghost" onClick={() => handleSort('name')} className="-ml-4">
                  Име
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-1">
                <Button variant="ghost" onClick={() => handleSort('category')} className="-ml-4">
                  Категория
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-1">
                <Button variant="ghost" onClick={() => handleSort('releaseYear')} className="-ml-4">
                  Година
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-1 text-nowrap">
                <Button variant="ghost" onClick={() => handleSort('minCpu')} className="-ml-4">
                  CPU (GHz)
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-1 text-nowrap">
                <Button variant="ghost" onClick={() => handleSort('minMemory')} className="-ml-4">
                  RAM (MB)
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-1 text-nowrap">
                <Button variant="ghost" onClick={() => handleSort('price')} className="-ml-4">
                  Цена
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-1 text-nowrap">
                <Button variant="ghost" onClick={() => handleSort('amount')} className="-ml-4">
                  Количество
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-1 text-nowrap">
                <Button variant="ghost" onClick={() => handleSort('multiplayer')} className="-ml-4">
                  Мултиплейър
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-1 text-center">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGames.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center text-muted-foreground">
                  Няма намерени игри.
                </TableCell>
              </TableRow>
            ) : (
              filteredGames.map((game) => (
                <TableRow
                  className="cursor-pointer"
                  key={game.id}
                  onClick={() => toggleSelectOne(game.id)}
                >
                  <TableCell>
                    <Checkbox checked={selectedIds.has(game.id)} />
                  </TableCell>
                  <TableCell
                    className="cursor-pointer hover:underline text-nowrap"
                    onClick={(e) => {
                      e.stopPropagation();
                      addFilterTag('developer', game.developer.id, game.developer.name);
                    }}
                  >
                    {game.developer.name}
                  </TableCell>
                  <TableCell
                    className="font-medium text-nowrap cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(game.id);
                    }}
                  >
                    {game.name}
                  </TableCell>

                  <TableCell
                    className="cursor-pointer hover:underline text-nowrap"
                    onClick={(e) => {
                      e.stopPropagation();
                      addFilterTag('category', game.category.id, game.category.name);
                    }}
                  >
                    {game.category.name}
                  </TableCell>
                  <TableCell className="text-center">{game.releaseYear}</TableCell>
                  <TableCell className="text-center">{game.minCpu}</TableCell>
                  <TableCell className="text-center">{game.minMemory}</TableCell>
                  <TableCell className="text-center">${game.price.toFixed(2)}</TableCell>
                  <TableCell className="text-center">{game.amount}</TableCell>
                  <TableCell
                    className="text-center cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      const tag = game.multiplayer ? 'yes' : 'no';
                      addFilterTag('multiplayer', tag, tag);
                    }}
                  >
                    {game.multiplayer ? 'Да' : 'Не'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(game.id);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(game);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={(open) => !open && closeEditModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактирай игра</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Име на игра</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={editLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-developer">Разработчик</Label>
              <select
                id="edit-developer"
                value={editDeveloperId}
                onChange={(e) => setEditDeveloperId(e.target.value)}
                disabled={editLoading}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Избери разработчик</option>
                {developers.map((dev) => (
                  <option key={dev.id} value={dev.id}>
                    {dev.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Категория</Label>
              <select
                id="edit-category"
                value={editCategoryId}
                onChange={(e) => setEditCategoryId(e.target.value)}
                disabled={editLoading}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Избери категория</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-minCpu">Минимален CPU (GHz)</Label>
                <Input
                  id="edit-minCpu"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editMinCpu}
                  onChange={(e) => setEditMinCpu(e.target.value)}
                  disabled={editLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-minMemory">Минимална памет (MB)</Label>
                <Input
                  id="edit-minMemory"
                  type="number"
                  min="0"
                  value={editMinMemory}
                  onChange={(e) => setEditMinMemory(e.target.value)}
                  disabled={editLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-releaseYear">Година на издаване</Label>
              <Input
                id="edit-releaseYear"
                type="number"
                min="1970"
                max="2100"
                value={editReleaseYear}
                onChange={(e) => setEditReleaseYear(e.target.value)}
                disabled={editLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Цена</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                min="0"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                disabled={editLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-amount">Количество (налични копия)</Label>
              <Input
                id="edit-amount"
                type="number"
                min="0"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                disabled={editLoading}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-multiplayer"
                checked={editMultiplayer}
                onCheckedChange={(checked) => setEditMultiplayer(checked as boolean)}
                disabled={editLoading}
              />
              <Label htmlFor="edit-multiplayer" className="cursor-pointer">
                Поддръжка на мултиплейър
              </Label>
            </div>

            {editError && <p className="text-sm text-destructive">{editError}</p>}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeEditModal}
                disabled={editLoading}
              >
                Откажи
              </Button>
              <Button type="submit" disabled={editLoading}>
                {editLoading ? 'Актуализиране...' : 'Актуализирай игра'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Потвърди изтриването</DialogTitle>
            <DialogDescription>
              Сигурни ли сте, че искате да изтриете &quot;{gameToDelete?.name}&quot;? Това действие
              не може да бъде отменено.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Откажи
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Изтрий
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Потвърди масово изтриване</DialogTitle>
            <DialogDescription>
              Сигурни ли сте, че искате да изтриете {selectedIds.size} игр
              {selectedIds.size === 1 ? 'а' : 'и'}? Това действие не може да бъде отменено.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteDialogOpen(false)}>
              Откажи
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Изтрий
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={<div>Зареждане...</div>}>
      <GamesPageContent />
    </Suspense>
  );
}
