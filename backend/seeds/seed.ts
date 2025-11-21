import { AppDataSource } from '../data-source';
import { Category } from '../entities/Category.entity';
import { Game } from '../entities/Game.entity';
import { GameDeveloper } from '../entities/GameDeveloper.entity';

class DatabaseSeeder {
  private developers: Record<string, GameDeveloper> = {};
  private categories: Record<string, Category> = {};
  private games: Record<string, Game> = {};

  async clearData(): Promise<void> {
    console.log('Clearing existing data...');
    await AppDataSource.getRepository(Game).deleteAll();
    await AppDataSource.getRepository(Category).deleteAll();
    await AppDataSource.getRepository(GameDeveloper).deleteAll();
  }

  async seedDevelopers(): Promise<void> {
    console.log('Seeding game developers...');
    const developerRepo = AppDataSource.getRepository(GameDeveloper);

    this.developers.cdProjektRed = await developerRepo.save({
      name: 'CD Projekt Red',
    });

    this.developers.rockstarGames = await developerRepo.save({
      name: 'Rockstar Games',
    });

    this.developers.valve = await developerRepo.save({
      name: 'Valve Corporation',
    });

    this.developers.fromSoftware = await developerRepo.save({
      name: 'FromSoftware',
    });

    this.developers.bethesda = await developerRepo.save({
      name: 'Bethesda Game Studios',
    });

    this.developers.nintendo = await developerRepo.save({
      name: 'Nintendo EPD',
    });

    this.developers.blizzard = await developerRepo.save({
      name: 'Blizzard Entertainment',
    });

    this.developers.ubisoft = await developerRepo.save({
      name: 'Ubisoft Montreal',
    });

    this.developers.ea = await developerRepo.save({
      name: 'Electronic Arts',
    });

    this.developers.naughtyDog = await developerRepo.save({
      name: 'Naughty Dog',
    });

    console.log(`✓ ${Object.keys(this.developers).length} game developers seeded`);
  }

  async seedCategories(): Promise<void> {
    console.log('Seeding categories...');
    const categoryRepo = AppDataSource.getRepository(Category);

    this.categories.rpg = await categoryRepo.save({
      name: 'RPG',
    });

    this.categories.actionAdventure = await categoryRepo.save({
      name: 'Action-Adventure',
    });

    this.categories.shooter = await categoryRepo.save({
      name: 'Shooter',
    });

    this.categories.soulsLike = await categoryRepo.save({
      name: 'Souls-like',
    });

    this.categories.openWorld = await categoryRepo.save({
      name: 'Open World',
    });

    this.categories.puzzle = await categoryRepo.save({
      name: 'Puzzle',
    });

    this.categories.moba = await categoryRepo.save({
      name: 'MOBA',
    });

    this.categories.strategy = await categoryRepo.save({
      name: 'Strategy',
    });

    this.categories.sports = await categoryRepo.save({
      name: 'Sports',
    });

    console.log(`✓ ${Object.keys(this.categories).length} categories seeded`);
  }

  async seedGames(): Promise<void> {
    console.log('Seeding games...');
    const gameRepo = AppDataSource.getRepository(Game);

    // CD Projekt Red games
    this.games.witcher3 = await gameRepo.save({
      name: 'The Witcher 3: Wild Hunt',
      developer: this.developers.cdProjektRed,
      category: this.categories.rpg,
      minCpu: 3.3,
      minMemory: 8192,
      multiplayer: false,
      releaseYear: 2015,
      price: 39.99,
      amount: 150,
    });

    this.games.cyberpunk = await gameRepo.save({
      name: 'Cyberpunk 2077',
      developer: this.developers.cdProjektRed,
      category: this.categories.rpg,
      minCpu: 3.2,
      minMemory: 8192,
      multiplayer: false,
      releaseYear: 2020,
      price: 59.99,
      amount: 200,
    });

    // Rockstar Games
    this.games.gtaV = await gameRepo.save({
      name: 'Grand Theft Auto V',
      developer: this.developers.rockstarGames,
      category: this.categories.actionAdventure,
      minCpu: 2.4,
      minMemory: 4096,
      multiplayer: true,
      releaseYear: 2013,
      price: 29.99,
      amount: 300,
    });

    this.games.rdr2 = await gameRepo.save({
      name: 'Red Dead Redemption 2',
      developer: this.developers.rockstarGames,
      category: this.categories.actionAdventure,
      minCpu: 2.8,
      minMemory: 8192,
      multiplayer: true,
      releaseYear: 2018,
      price: 59.99,
      amount: 175,
    });

    // Valve games
    this.games.halfLifeAlyx = await gameRepo.save({
      name: 'Half-Life: Alyx',
      developer: this.developers.valve,
      category: this.categories.shooter,
      minCpu: 3.0,
      minMemory: 12288,
      multiplayer: false,
      releaseYear: 2020,
      price: 29.99,
      amount: 120,
    });

    this.games.portal2 = await gameRepo.save({
      name: 'Portal 2',
      developer: this.developers.valve,
      category: this.categories.puzzle,
      minCpu: 3.0,
      minMemory: 2048,
      multiplayer: true,
      releaseYear: 2011,
      price: 29.99,
      amount: 250,
    });

    this.games.counterStrike2 = await gameRepo.save({
      name: 'Counter-Strike 2',
      developer: this.developers.valve,
      category: this.categories.shooter,
      minCpu: 3.0,
      minMemory: 8192,
      multiplayer: true,
      releaseYear: 2023,
      price: 29.99,
      amount: 500,
    });

    // Classic Valve games
    this.games.halfLife = await gameRepo.save({
      name: 'Half-Life',
      developer: this.developers.valve,
      category: this.categories.shooter,
      minCpu: 0.5,
      minMemory: 512,
      multiplayer: false,
      releaseYear: 1998,
      price: 29.99,
      amount: 100,
    });

    this.games.counterStrike16 = await gameRepo.save({
      name: 'Counter-Strike 1.6',
      developer: this.developers.valve,
      category: this.categories.shooter,
      minCpu: 0.5,
      minMemory: 512,
      multiplayer: true,
      releaseYear: 2000,
      price: 29.99,
      amount: 150,
    });

    this.games.portal = await gameRepo.save({
      name: 'Portal',
      developer: this.developers.valve,
      category: this.categories.puzzle,
      minCpu: 1.7,
      minMemory: 512,
      multiplayer: false,
      releaseYear: 2007,
      price: 29.99,
      amount: 200,
    });

    // FromSoftware games
    this.games.eldenRing = await gameRepo.save({
      name: 'Elden Ring',
      developer: this.developers.fromSoftware,
      category: this.categories.soulsLike,
      minCpu: 3.3,
      minMemory: 12288,
      multiplayer: true,
      releaseYear: 2022,
      price: 29.99,
      amount: 220,
    });

    this.games.darkSouls3 = await gameRepo.save({
      name: 'Dark Souls III',
      developer: this.developers.fromSoftware,
      category: this.categories.soulsLike,
      minCpu: 3.1,
      minMemory: 8192,
      multiplayer: true,
      releaseYear: 2016,
      price: 29.99,
      amount: 180,
    });

    this.games.sekiro = await gameRepo.save({
      name: 'Sekiro: Shadows Die Twice',
      developer: this.developers.fromSoftware,
      category: this.categories.soulsLike,
      minCpu: 3.0,
      minMemory: 8192,
      multiplayer: false,
      releaseYear: 2019,
      price: 29.99,
      amount: 160,
    });

    // Bethesda games
    this.games.skyrim = await gameRepo.save({
      name: 'The Elder Scrolls V: Skyrim',
      developer: this.developers.bethesda,
      category: this.categories.rpg,
      minCpu: 2.0,
      minMemory: 4096,
      multiplayer: false,
      releaseYear: 2011,
      price: 29.99,
      amount: 350,
    });

    this.games.fallout4 = await gameRepo.save({
      name: 'Fallout 4',
      developer: this.developers.bethesda,
      category: this.categories.rpg,
      minCpu: 2.8,
      minMemory: 8192,
      multiplayer: false,
      releaseYear: 2015,
      price: 29.99,
      amount: 200,
    });

    this.games.morrowind = await gameRepo.save({
      name: 'The Elder Scrolls III: Morrowind',
      developer: this.developers.bethesda,
      category: this.categories.rpg,
      minCpu: 0.5,
      minMemory: 256,
      multiplayer: false,
      releaseYear: 2002,
      price: 29.99,
      amount: 80,
    });

    // Nintendo games
    this.games.zelda = await gameRepo.save({
      name: 'The Legend of Zelda: Breath of the Wild',
      developer: this.developers.nintendo,
      category: this.categories.openWorld,
      minCpu: 1.02,
      minMemory: 4096,
      multiplayer: false,
      releaseYear: 2017,
      price: 29.99,
      amount: 280,
    });

    // Blizzard games
    this.games.overwatch2 = await gameRepo.save({
      name: 'Overwatch 2',
      developer: this.developers.blizzard,
      category: this.categories.shooter,
      minCpu: 2.5,
      minMemory: 6144,
      multiplayer: true,
      releaseYear: 2022,
      price: 29.99,
      amount: 400,
    });

    this.games.diablo4 = await gameRepo.save({
      name: 'Diablo IV',
      developer: this.developers.blizzard,
      category: this.categories.rpg,
      minCpu: 2.5,
      minMemory: 8192,
      multiplayer: true,
      releaseYear: 2023,
      price: 29.99,
      amount: 300,
    });

    this.games.wow = await gameRepo.save({
      name: 'World of Warcraft',
      developer: this.developers.blizzard,
      category: this.categories.rpg,
      minCpu: 2.7,
      minMemory: 8192,
      multiplayer: true,
      releaseYear: 2004,
      price: 29.99,
      amount: 500,
    });

    this.games.starcraft2 = await gameRepo.save({
      name: 'StarCraft II',
      developer: this.developers.blizzard,
      category: this.categories.strategy,
      minCpu: 2.6,
      minMemory: 4096,
      multiplayer: true,
      releaseYear: 2010,
      price: 29.99,
      amount: 220,
    });

    // Classic Blizzard games
    this.games.starcraft = await gameRepo.save({
      name: 'StarCraft',
      developer: this.developers.blizzard,
      category: this.categories.strategy,
      minCpu: 0.09,
      minMemory: 128,
      multiplayer: true,
      releaseYear: 1998,
      price: 29.99,
      amount: 120,
    });

    this.games.warcraft3 = await gameRepo.save({
      name: 'Warcraft III: Reign of Chaos',
      developer: this.developers.blizzard,
      category: this.categories.strategy,
      minCpu: 0.4,
      minMemory: 256,
      multiplayer: true,
      releaseYear: 2002,
      price: 29.99,
      amount: 150,
    });

    this.games.diablo2 = await gameRepo.save({
      name: 'Diablo II',
      developer: this.developers.blizzard,
      category: this.categories.rpg,
      minCpu: 0.233,
      minMemory: 256,
      multiplayer: true,
      releaseYear: 2000,
      price: 29.99,
      amount: 100,
    });

    // Ubisoft games
    this.games.assassinsCreed = await gameRepo.save({
      name: "Assassin's Creed Valhalla",
      developer: this.developers.ubisoft,
      category: this.categories.actionAdventure,
      minCpu: 3.0,
      minMemory: 8192,
      multiplayer: false,
      releaseYear: 2020,
      price: 29.99,
      amount: 190,
    });

    this.games.farcry6 = await gameRepo.save({
      name: 'Far Cry 6',
      developer: this.developers.ubisoft,
      category: this.categories.shooter,
      minCpu: 3.2,
      minMemory: 8192,
      multiplayer: true,
      releaseYear: 2021,
      price: 29.99,
      amount: 170,
    });

    // EA games
    this.games.fifa23 = await gameRepo.save({
      name: 'EA SPORTS FC 24',
      developer: this.developers.ea,
      category: this.categories.sports,
      minCpu: 3.1,
      minMemory: 8192,
      multiplayer: true,
      releaseYear: 2023,
      price: 29.99,
      amount: 350,
    });

    this.games.apexLegends = await gameRepo.save({
      name: 'Apex Legends',
      developer: this.developers.ea,
      category: this.categories.shooter,
      minCpu: 3.0,
      minMemory: 6144,
      multiplayer: true,
      releaseYear: 2019,
      price: 29.99,
      amount: 450,
    });

    // Naughty Dog games
    this.games.lastOfUs = await gameRepo.save({
      name: 'The Last of Us Part I',
      developer: this.developers.naughtyDog,
      category: this.categories.actionAdventure,
      minCpu: 3.5,
      minMemory: 16384,
      multiplayer: false,
      releaseYear: 2022,
      price: 29.99,
      amount: 160,
    });

    this.games.uncharted4 = await gameRepo.save({
      name: "Uncharted 4: A Thief's End",
      developer: this.developers.naughtyDog,
      category: this.categories.actionAdventure,
      minCpu: 3.5,
      minMemory: 8192,
      multiplayer: true,
      releaseYear: 2016,
      price: 29.99,
      amount: 140,
    });

    console.log(`✓ ${Object.keys(this.games).length} games seeded`);
  }

  async seed(): Promise<void> {
    try {
      await AppDataSource.initialize();
      console.log('Data Source has been initialized!\n');

      await this.clearData();
      await this.seedDevelopers();
      await this.seedCategories();
      await this.seedGames();

      console.log('\n✅ All fixtures seeded successfully!');
      console.log('\nSummary:');
      console.log(`- ${Object.keys(this.developers).length} Game Developers`);
      console.log(`- ${Object.keys(this.categories).length} Categories`);
      console.log(`- ${Object.keys(this.games).length} Games`);
    } catch (error) {
      console.error('Error during seeding:', error);
      process.exit(1);
    } finally {
      await AppDataSource.destroy();
    }
  }
}

const seeder = new DatabaseSeeder();
void seeder.seed();
