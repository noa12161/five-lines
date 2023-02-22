enum ConstNumbers {
  TILE_SIZE = 30,
  FPS = 30,
  SLEEP = 1000 / ConstNumbers.FPS,
  DX = 1,
  DY = 1,
}
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;
const TILE_COLORS = {
  PLAYER: "#ff0000",
  FLUX: "#ccffcc",
  UNBREAKABLE: "#999999",
  STONE: "#0000cc",
  BOX: "#8b4513",
  KEY1: "#ffcc00",
  LOCK1: "#ffcc00",
  KEY2: "#00ccff",
  LOCK2: "#00ccff",
};
const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE,
  FALLING_STONE,
  BOX,
  FALLING_BOX,
  KEY1,
  LOCK1,
  KEY2,
  LOCK2,
}

interface Tile {
  canFall(): boolean;
  isAir(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  draw(g: CanvasRenderingContext2D, y: number, x: number): void;
  moveHorizontal(map: Map, player: Player, dx: number): void;
  moveVertical(map: Map, player: Player, dy: number): void;
  update(map: Map, y: number, x: number): void;
  getBlockOnTopState(): FallingState;
}

interface Input {
  handle(map: Map, player: Player): void;
}

interface FallingState {
  isFalling(): boolean;
  moveHorizontal(map: Map, tile: Tile, dx: number): void;
  drop(map: Map, tile: Tile, y: number, x: number): void;
}

interface RemoveStrategy {
  check(tile: Tile): boolean;
}

class Map {
  private RawMap: RawTile[][] = [
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 3, 0, 1, 1, 2, 0, 2],
    [2, 4, 2, 6, 1, 2, 0, 2],
    [2, 8, 4, 1, 1, 2, 0, 2],
    [2, 4, 1, 1, 1, 9, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2],
  ];
  private map: Tile[][];
  constructor() {
    this.transform();
  }

  transform() {
    this.map = new Array(this.RawMap.length);
    for (let y = 0; y < this.RawMap.length; y++) {
      this.map[y] = new Array(this.RawMap[y].length);
      for (let x = 0; x < this.RawMap[y].length; x++) {
        this.map[y][x] = transformTile(this.RawMap[y][x]);
      }
    }
  }
  update() {
    for (let y = this.map.length - 1; y >= 0; y--) {
      for (let x = 0; x < this.map[y].length; x++) {
        this.map[y][x].update(this, y, x);
      }
    }
  }
  draw(g: CanvasRenderingContext2D) {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        this.map[y][x].draw(g, y, x);
      }
    }
  }
  remove(shouldRemove: RemoveStrategy) {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (shouldRemove.check(this.map[y][x])) {
          this.map[y][x] = new Air();
        }
      }
    }
  }
  drop(tile: Tile, y: number, x: number) {
    this.map[y + 1][x] = tile;
    this.map[y][x] = new Air();
  }
  getBlockOnTopState(y: number, x: number) {
    return this.map[y][x].getBlockOnTopState();
  }
  moveHorizontal(player: Player, y: number, x: number, dx: number) {
    this.map[y][x + dx].moveHorizontal(this, player, dx);
  }
  moveVertical(player: Player, y: number, x: number, dy: number) {
    this.map[y + dy][x].moveVertical(this, player, dy);
  }
  movePlayer(y: number, x: number, newy: number, newx: number) {
    this.map[y][x] = new Air();
    this.map[newy][newx] = new PlayerTile();
  }
  pushHorizontal(player: Player, tile: Tile, y: number, x: number, dx: number) {
    if (map.isAir(y, x + dx + dx) && !map.isAir(y + 1, x + dx)) {
      this.map[y][x + dx + dx] = tile;
      player.moveToTile(map, x + dx, y);
    }
  }
  isAir(y: number, x: number) {
    return this.map[y][x].isAir();
  }
}

class FallStrategy {
  constructor(private falling: FallingState) {}
  moveHorizontal(map: Map, tile: Tile, dx: number) {
    this.falling.moveHorizontal(map, tile, dx);
  }
  update(map: Map, tile: Tile, y: number, x: number) {
    this.falling = map.getBlockOnTopState(y + 1, x);
    this.falling.drop(map, tile, y, x);
  }
}

class Falling implements FallingState {
  isFalling(): boolean {
    return true;
  }
  moveHorizontal(map: Map, tile: Tile, dx: number): void {}
  drop(map: Map, tile: Tile, y: number, x: number) {
    map.drop(tile, y, x);
  }
}
class Resting implements FallingState {
  isFalling(): boolean {
    return false;
  }
  isResting(): boolean {
    return true;
  }
  moveHorizontal(map: Map, tile: Tile, dx: number): void {
    player.pushHorizontal(map, tile, dx);
  }
  drop(map: Map, tile: Tile, y: number, x: number) {}
}

class KeyConfiguration {
  constructor(
    private color: string,
    private _1: boolean,
    private removeStrategy: RemoveStrategy
  ) {}
  setColor(g: CanvasRenderingContext2D) {
    g.fillStyle = this.color;
  }
  setRect(g: CanvasRenderingContext2D, y: number, x: number) {
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  is1() {
    return this._1;
  }
  removeLock() {
    map.remove(this.removeStrategy);
  }
}
class RemoveLock1 implements RemoveStrategy {
  check(tile: Tile) {
    return tile.isLock1();
  }
}
class RemoveLock2 implements RemoveStrategy {
  check(tile: Tile) {
    return tile.isLock2();
  }
}

class Player {
  private x = 1;
  private y = 1;

  moveToTile(map: Map, newx: number, newy: number) {
    map.movePlayer(this.y, this.x, newy, newx);
    this.y = newy;
    this.x = newx;
  }
  drawPlayer(g: CanvasRenderingContext2D) {
    g.fillStyle = TILE_COLORS.PLAYER;
    g.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, dx: number) {
    map.moveHorizontal(this, this.y, this.x, dx);
  }
  moveVertical(map: Map, dy: number) {
    map.moveVertical(this, this.y, this.x, dy);
  }
  move(map: Map, dx: number, dy: number) {
    this.moveToTile(map, this.x + dx, this.y + dy);
  }
  pushHorizontal(map: Map, tile: Tile, dx: number) {
    map.pushHorizontal(this, tile, this.y, this.x, dx);
  }
}

class PlayerTile implements Tile {
  update(map: Map, y: number, x: number): void {}
  canFall(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, y: number, x: number) {
    g.fillStyle = TILE_COLORS.PLAYER;
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number): void {}
  moveVertical(map: Map, player: Player, dy: number): void {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class Air implements Tile {
  canFall(): boolean {
    return false;
  }
  isAir(): boolean {
    return true;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, y: number, x: number) {}
  moveHorizontal(map: Map, player: Player, dx: number): void {
    player.move(map, dx, 0);
  }
  moveVertical(map: Map, player: Player, dy: number): void {
    player.move(map, 0, dy);
  }
  update(map: Map, y: number, x: number): void {}
  getBlockOnTopState(): FallingState {
    return new Falling();
  }
}
class Flux implements Tile {
  canFall(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, y: number, x: number) {
    g.fillStyle = TILE_COLORS.FLUX;
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number): void {
    player.move(map, dx, 0);
  }
  moveVertical(map: Map, player: Player, dy: number): void {
    player.move(map, 0, dy);
  }
  update(map: Map, y: number, x: number): void {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}
class Unbreakable implements Tile {
  update(map: Map, y: number, x: number): void {}
  canFall(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, y: number, x: number) {
    g.fillStyle = TILE_COLORS.UNBREAKABLE;
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number): void {}
  moveVertical(map: Map, player: Player, dy: number): void {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class Stone implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  update(map: Map, y: number, x: number): void {
    this.fallStrategy.update(map, this, y, x);
  }
  canFall(): boolean {
    return true;
  }
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, y: number, x: number) {
    g.fillStyle = TILE_COLORS.STONE;
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number): void {
    this.fallStrategy.moveHorizontal(map, this, dx);
  }
  moveVertical(map: Map, player: Player, dy: number): void {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}
class Box implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  update(map: Map, y: number, x: number): void {
    this.fallStrategy.update(map, this, y, x);
  }
  canFall(): boolean {
    return true;
  }
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, y: number, x: number) {
    g.fillStyle = TILE_COLORS.BOX;
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(map: Map, player: Player, dx: number): void {
    this.fallStrategy.moveHorizontal(map, this, dx);
  }
  moveVertical(map: Map, player: Player, dy: number): void {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}
class Key implements Tile {
  constructor(private keyConf: KeyConfiguration) {}
  update(map: Map, y: number, x: number): void {}
  canFall(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, y: number, x: number) {
    this.keyConf.setColor(g);
    this.keyConf.setRect(g, y, x);
  }
  moveHorizontal(map: Map, player: Player, dx: number): void {
    this.keyConf.removeLock();
    player.move(map, dx, 0);
  }
  moveVertical(map: Map, player: Player, dy: number): void {
    this.keyConf.removeLock();
    player.move(map, 0, dy);
  }
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}
class Lock_ implements Tile {
  constructor(private keyConf: KeyConfiguration) {}
  update(map: Map, y: number, x: number): void {}
  canFall(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return this.keyConf.is1();
  }
  isLock2(): boolean {
    return !this.keyConf.is1();
  }
  draw(g: CanvasRenderingContext2D, y: number, x: number) {
    this.keyConf.setColor(g);
    this.keyConf.setRect(g, y, x);
  }
  moveHorizontal(map: Map, player: Player, dx: number): void {}
  moveVertical(map: Map, player: Player, dy: number): void {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}
class Right implements Input {
  handle(map: Map, player: Player) {
    player.moveHorizontal(map, ConstNumbers.DX);
  }
}
class Left implements Input {
  handle(map: Map, player: Player) {
    player.moveHorizontal(map, -ConstNumbers.DX);
  }
}
class Up implements Input {
  handle(map: Map, player: Player) {
    player.moveVertical(map, -ConstNumbers.DY);
  }
}
class Down implements Input {
  handle(map: Map, player: Player) {
    player.moveVertical(map, +ConstNumbers.DY);
  }
}

class Inputs {
  private inputs: Input[] = [];

  push(input: Input) {
    this.inputs.push(input);
  }
  handle() {
    while (this.inputs.length > 0) {
      const input = this.inputs.pop();
      input.handle(map, player);
    }
  }
}

const YELLOW_KEY = new KeyConfiguration(
  TILE_COLORS.KEY1,
  true,
  new RemoveLock1()
);
const RED_KEY = new KeyConfiguration(
  TILE_COLORS.KEY2,
  false,
  new RemoveLock2()
);
const map = new Map();
const player = new Player();
const inputs = new Inputs();

function update() {
  inputs.handle();
  map.update();
}

function draw() {
  let g = createGrapics();
  player.drawPlayer(g);
  map.draw(g);
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
  gameLoop();
};
window.addEventListener("keydown", (e) => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});

function createGrapics() {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);

  return g;
}
function assertExhausted(x: never) {
  throw new Error("Unexpected object: " + x);
}
function transformTile(tile: RawTile) {
  switch (tile) {
    case RawTile.AIR:
      return new Air();
    case RawTile.PLAYER:
      return new PlayerTile();
    case RawTile.UNBREAKABLE:
      return new Unbreakable();
    case RawTile.STONE:
      return new Stone(new Resting());
    case RawTile.FALLING_STONE:
      return new Stone(new Falling());
    case RawTile.BOX:
      return new Box(new Resting());
    case RawTile.FALLING_BOX:
      return new Box(new Falling());
    case RawTile.FLUX:
      return new Flux();
    case RawTile.KEY1:
      return new Key(YELLOW_KEY);
    case RawTile.LOCK1:
      return new Lock_(YELLOW_KEY);
    case RawTile.KEY2:
      return new Key(RED_KEY);
    case RawTile.LOCK2:
      return new Lock_(RED_KEY);
    default:
      assertExhausted(tile);
  }
}
