import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">TU Varna GameDev Catalogue</h1>
        <p className="text-xl text-gray-600 mb-8">
          Full-stack application with NestJS, Fastify, Next.js, and TypeORM
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Stack Overview</h2>
          <ul className="text-left space-y-2 text-gray-700">
            <li>✓ Backend: NestJS with Fastify</li>
            <li>✓ Frontend: Next.js 15 (App Router)</li>
            <li>✓ Database: PostgreSQL with TypeORM</li>
            <li>✓ Testing: Jest with coverage</li>
            <li>✓ Package Manager: pnpm</li>
            <li>✓ Language: TypeScript</li>
            <li>✓ UI: Tailwind CSS + Radix UI</li>
          </ul>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/game-developers">
            <Button size="lg">Browse Game Developers</Button>
          </Link>
          <Link href="/games">
            <Button size="lg" variant="outline">
              Browse Games
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
