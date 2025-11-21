'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categoriesApi } from '@/lib/api/categories';

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Името е задължително');
      return;
    }

    try {
      setLoading(true);
      await categoriesApi.create({ name: name.trim() });
      router.push('/categories');
    } catch (err) {
      setError('Неуспешно създаване на категория. Моля, опитайте отново.');
      console.error('Failed to create category:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href="/categories"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Обратно към категории
        </Link>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h1 className="text-2xl font-bold mb-6">Създай нова категория</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Име на категория</Label>
            <Input
              id="name"
              placeholder="Въведи име на категория"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Създаване...' : 'Създай категория'}
            </Button>
            <Link href="/categories">
              <Button type="button" variant="outline" disabled={loading}>
                Откажи
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
