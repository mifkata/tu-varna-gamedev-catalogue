import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { Category } from './Category.entity';
import { GameDeveloper } from './GameDeveloper.entity';

@Entity('games')
@Unique(['developer', 'name'])
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GameDeveloper, { nullable: false })
  @JoinColumn({ name: 'developer_id' })
  developer: GameDeveloper;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({
    name: 'min_cpu',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  minCpu: number;

  @Column({ name: 'min_memory', type: 'integer', nullable: false })
  minMemory: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  multiplayer: boolean;

  @Column({ name: 'release_year', type: 'integer', nullable: false })
  releaseYear: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
