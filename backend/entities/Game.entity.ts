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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  minCpu: number;

  @Column({ type: 'integer', nullable: false })
  minMemory: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  multiplayer: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
