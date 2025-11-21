'use client';

import { ArrowUpDown, Pencil, Plus, Trash2, X, Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { gameDevelopersApi } from '@/lib/api/game-developers';
import type { GameDeveloperListItem } from '@/lib/api/types';

type SortField = 'name' | 'gamesCount' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function GameDevelopersPage() {
  const [developers, setDevelopers] = useState<GameDeveloperListItem[]>([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState<GameDeveloperListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [developerToDelete, setDeveloperToDelete] = useState<GameDeveloperListItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadDevelopers();
  }, []);

  useEffect(() => {
    // Filter and sort
    const filtered = developers.filter((dev) =>
      dev.name.toLowerCase().includes(filterText.toLowerCase()),
    );

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    setFilteredDevelopers(filtered);
  }, [developers, filterText, sortField, sortOrder]);

  async function loadDevelopers() {
    try {
      setLoading(true);
      const data = await gameDevelopersApi.getAll();
      setDevelopers(data);
    } catch (error) {
      console.error('Failed to load developers:', error);
    } finally {
      setLoading(false);
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

  function openDeleteDialog(developer: GameDeveloperListItem) {
    setDeveloperToDelete(developer);
    setDeleteDialogOpen(true);
  }

  async function handleDelete() {
    if (!developerToDelete) return;

    try {
      await gameDevelopersApi.delete(developerToDelete.id);
      await loadDevelopers();
      setDeleteDialogOpen(false);
      setDeveloperToDelete(null);
    } catch (error) {
      console.error('Failed to delete developer:', error);
    }
  }

  function startEditing(developer: GameDeveloperListItem) {
    setEditingId(developer.id);
    setEditingName(developer.name);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingName('');
  }

  async function saveEditing(id: string) {
    try {
      await gameDevelopersApi.update(id, { name: editingName });
      await loadDevelopers();
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Failed to update developer:', error);
    }
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredDevelopers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDevelopers.map((dev) => dev.id)));
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
      await gameDevelopersApi.bulkDelete(Array.from(selectedIds));
      await loadDevelopers();
      setSelectedIds(new Set());
      setBulkDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to bulk delete developers:', error);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Game Developers</h1>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <Button variant="destructive" onClick={openBulkDeleteDialog}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selectedIds.size})
            </Button>
          )}
          <Link href="/game-developers/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Developer
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Filter by name..."
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
                  checked={
                    filteredDevelopers.length > 0 && selectedIds.size === filteredDevelopers.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-full">
                <Button variant="ghost" onClick={() => handleSort('name')} className="-ml-4">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-1">
                <Button variant="ghost" onClick={() => handleSort('gamesCount')} className="-ml-4">
                  Games Count
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-1">
                <Button variant="ghost" onClick={() => handleSort('createdAt')} className="-ml-4">
                  Created At
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-1" className="text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevelopers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No game developers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDevelopers.map((developer) => (
                <TableRow
                  className="cursor-pointer"
                  key={developer.id}
                  onClick={() => toggleSelectOne(developer.id)}
                >
                  <TableCell>
                    <Checkbox checked={selectedIds.has(developer.id)} />
                  </TableCell>
                  {editingId === developer.id ? (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveEditing(developer.id);
                            } else if (e.key === 'Escape') {
                              cancelEditing();
                            }
                          }}
                          className="h-8"
                          autoFocus
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => saveEditing(developer.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={cancelEditing}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  ) : (
                    <TableCell
                      className="font-medium cursor-text"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(developer);
                      }}
                    >
                      <span className="text-nowrap">{developer.name}</span>
                    </TableCell>
                  )}
                  <TableCell className="text-center">{developer.gamesCount}</TableCell>
                  <TableCell className="text-center">
                    {new Date(developer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId !== developer.id && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(developer);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openDeleteDialog(developer)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{developerToDelete?.name}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedIds.size} game developer
              {selectedIds.size === 1 ? '' : 's'}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
