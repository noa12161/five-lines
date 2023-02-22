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
enum RawInput {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

interface Tile {
  canFall(): boolean;
  isAir(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  draw(g: CanvasRenderingContext2D, y: number, x: number): void;
  moveHorizontal(player: Player, dx: number): void;
  moveVertical(player: Player, dy: number): void;
  update(y: number, x: number): void;
  getBlockOnTopState(): FallingState;
}

interface Input {
  handle(player: Player): void;
}

interface FallingState {
  isFalling(): boolean;
  moveHorizontal(tile: Tile, dx: number): void;
  drop(tile: Tile, y: number, x: number): void;
}

interface RemoveStrategy {
  check(tile: Tile): boolean;
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

class FallStrategy {
  constructor(private falling: FallingState) {}
  moveHorizontal(tile: Tile, dx: number) {
    this.falling.moveHorizontal(tile, dx);
  }
  update(tile: Tile, y: number, x: number) {
    this.falling = map[y + 1][x].getBlockOnTopState();
    this.falling.drop(tile, y, x);
  }
}

class Falling implements FallingState {
  isFalling(): boolean {
    return true;
  }
  moveHorizontal(tile: Tile, dx: number): void {}
  drop(tile: Tile, y: number, x: number) {
    if (map[y + 1][x].isAir()) {
      map[y + 1][x] = tile;
      map[y][x] = new Air();
    }
  }
}
class Resting implements FallingState {
  isFalling(): boolean {
    return false;
  }
  isResting(): boolean {
    return true;
  }
  moveHorizontal(tile: Tile, dx: number): void {
    player.pushHorizontal(tile, dx);
    // if (
    //   map[player.getY()][player.getX() + dx + dx].isAir() &&
    //   !map[player.getY() + 1][player.getX() + dx].isAir()
    // ) {
    //   map[player.getY()][player.getX() + dx + dx] = tile;
    //   moveToTile(player.getX() + dx, player.getY());
    // }
  }
  drop(tile: Tile, y: number, x: number) {}
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
    remove(this.removeStrategy);
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

class Player {
  private x = 1;
  private y = 1;
  private moveToTile(newx: number, newy: number) {
    map[this.y][this.x] = new Air();
    map[newy][newx] = new PlayerTile();
    this.y = newy;
    this.x = newx;
  }

  drawPlayer(g: CanvasRenderingContext2D) {
    g.fillStyle = TILE_COLORS.PLAYER;
    g.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    map[this.y][this.x + dx].moveHorizontal(this, dx);
  }
  moveVertical(dy: number) {
    map[this.y + dy][this.x].moveVertical(this, dy);
  }
  move(dx: number, dy: number) {
    this.moveToTile(this.x + dx, this.y + dy);
  }
  pushHorizontal(tile: Tile, dx: number) {
    if (
      map[this.y][this.x + dx + dx].isAir() &&
      !map[this.y + 1][this.x + dx].isAir()
    ) {
      map[this.y][this.x + dx + dx] = tile;
      this.moveToTile(this.x + dx, this.y);
    }
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
  moveHorizontal(player: Player, dx: number): void {
    player.move(dx, 0);
    // moveToTile(player.getX() + dx, player.getY());
  }
  moveVertical(player: Player, dy: number): void {
    player.move(0, dy);
  }
  update(y: number, x: number): void {}
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
  moveHorizontal(player: Player, dx: number): void {
    player.move(dx, 0);
  }
  moveVertical(player: Player, dy: number): void {
    player.move(0, dy);
  }
  update(y: number, x: number): void {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}
class Unbreakable implements Tile {
  update(y: number, x: number): void {}
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
  moveHorizontal(player: Player, dx: number): void {}
  moveVertical(player: Player, dy: number): void {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}

class PlayerTile implements Tile {
  update(y: number, x: number): void {}
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
  moveHorizontal(player: Player, dx: number): void {}
  moveVertical(player: Player, dy: number): void {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}
class Stone implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  update(y: number, x: number): void {
    this.fallStrategy.update(this, y, x);
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
  moveHorizontal(player: Player, dx: number): void {
    this.fallStrategy.moveHorizontal(this, dx);
  }
  moveVertical(player: Player, dy: number): void {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}
class Box implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  update(y: number, x: number): void {
    this.fallStrategy.update(this, y, x);
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
  moveHorizontal(player: Player, dx: number): void {
    this.fallStrategy.moveHorizontal(this, dx);
  }
  moveVertical(player: Player, dy: number): void {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}
class Key implements Tile {
  constructor(private keyConf: KeyConfiguration) {}
  update(y: number, x: number): void {}
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
  moveHorizontal(player: Player, dx: number): void {
    this.keyConf.removeLock();
    player.move(dx, 0);
  }
  moveVertical(player: Player, dy: number): void {
    this.keyConf.removeLock();
    player.move(0, dy);
  }
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}
class Lock_ implements Tile {
  constructor(private keyConf: KeyConfiguration) {}
  update(y: number, x: number): void {}
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
  moveHorizontal(player: Player, dx: number): void {}
  moveVertical(player: Player, dy: number): void {}
  getBlockOnTopState(): FallingState {
    return new Resting();
  }
}
class Right implements Input {
  handle(player: Player) {
    player.moveHorizontal(ConstNumbers.DX);
  }
}
class Left implements Input {
  handle(player: Player) {
    player.moveHorizontal(-ConstNumbers.DX);
  }
}
class Up implements Input {
  handle(player: Player) {
    player.moveVertical(-ConstNumbers.DY);
  }
}
class Down implements Input {
  handle(player: Player) {
    player.moveVertical(+ConstNumbers.DY);
  }
}

const player = new Player();
let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
let map: Tile[][];
let inputs: Input[] = [];

function remove(shouldRemove: RemoveStrategy) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (shouldRemove.check(map[y][x])) {
        map[y][x] = new Air();
      }
    }
  }
}

function update() {
  handleInputs();
  updateMap();
}
function handleInputs() {
  while (inputs.length > 0) {
    let input = inputs.pop();
    input.handle(player);
  }
}
function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].update(y, x);
    }
  }
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(g, y, x);
    }
  }
}

function createGrapics() {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);

  return g;
}

function draw() {
  let g = createGrapics();
  player.drawPlayer(g);
  drawMap(g);
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
  transformMap();
  gameLoop();
};
window.addEventListener("keydown", (e) => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});

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
function transformMap() {
  map = new Array(rawMap.length);
  for (let y = 0; y < rawMap.length; y++) {
    map[y] = new Array(rawMap[y].length);
    for (let x = 0; x < rawMap[y].length; x++) {
      map[y][x] = transformTile(rawMap[y][x]);
    }
  }
}
