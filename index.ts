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
  moveHorizontal(dx: number): void;
  moveVertical(dy: number): void;
  update(y: number, x: number): void;
}

interface Input {
  handle(): void;
}

interface FallingState {
  isFalling(): boolean;
  moveHorizontal(tile: Tile, dx: number): void;
}

class FallStrategy {
  constructor(private falling: FallingState) {}
  getFalling() {
    return this.falling;
  }
  update(tile: Tile, y: number, x: number) {
    this.falling = map[y + 1][x].isAir() ? new Falling() : new Resting();
    this.drop(tile, y, x);
  }
  private drop(tile: Tile, y: number, x: number) {
    if (map[y + 1][x].isAir()) {
      map[y + 1][x] = tile;
      map[y][x] = new Air();
    }
  }
}

class Falling implements FallingState {
  isFalling(): boolean {
    return true;
  }
  moveHorizontal(tile: Tile, dx: number): void {}
}
class Resting implements FallingState {
  isFalling(): boolean {
    return false;
  }
  isResting(): boolean {
    return true;
  }
  moveHorizontal(tile: Tile, dx: number): void {
    if (
      map[playery][playerx + dx + dx].isAir() &&
      !map[playery + 1][playerx + dx].isAir()
    ) {
      map[playery][playerx + dx + dx] = tile;
      moveToTile(playerx + dx, playery);
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
  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    moveToTile(playerx, playery + dy);
  }
  update(y: number, x: number): void {}
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
  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    moveToTile(playerx, playery + dy);
  }
  update(y: number, x: number): void {}
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
  moveHorizontal(dx: number): void {}
  moveVertical(dy: number): void {}
}
class Player implements Tile {
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
  moveHorizontal(dx: number): void {}
  moveVertical(dy: number): void {}
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
  moveHorizontal(dx: number): void {
    this.fallStrategy.getFalling().moveHorizontal(this, dx);
  }
  moveVertical(dy: number): void {}
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
  moveHorizontal(dx: number): void {
    this.fallStrategy.getFalling().moveHorizontal(this, dx);
  }
  moveVertical(dy: number): void {}
}
class Key1 implements Tile {
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
    g.fillStyle = TILE_COLORS.KEY1;
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {
    removeLock1();
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    removeLock1();
    moveToTile(playerx, playery + dy);
  }
}
class Key2 implements Tile {
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
    g.fillStyle = TILE_COLORS.KEY2;
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {
    removeLock2();
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    removeLock2();
    moveToTile(playerx, playery + dy);
  }
}
class Lock1 implements Tile {
  update(y: number, x: number): void {}
  canFall(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isLock1(): boolean {
    return true;
  }
  isLock2(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, y: number, x: number) {
    g.fillStyle = TILE_COLORS.LOCK1;
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {}
  moveVertical(dy: number): void {}
}
class Lock2 implements Tile {
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
    return true;
  }
  draw(g: CanvasRenderingContext2D, y: number, x: number) {
    g.fillStyle = TILE_COLORS.LOCK2;
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {}
  moveVertical(dy: number): void {}
}

class Right implements Input {
  handle() {
    map[playery][playerx + ConstNumbers.DX].moveHorizontal(ConstNumbers.DX);
  }
}
class Left implements Input {
  handle() {
    map[playery][playerx + -ConstNumbers.DX].moveHorizontal(-ConstNumbers.DX);
  }
}
class Up implements Input {
  handle() {
    map[playery - ConstNumbers.DY][playerx].moveVertical(-ConstNumbers.DX);
  }
}
class Down implements Input {
  handle() {
    map[playery + ConstNumbers.DY][playerx].moveVertical(ConstNumbers.DX);
  }
}

let playerx = 1;
let playery = 1;
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

function assertExhausted(x: never) {
  throw new Error("Unexpected object: " + x);
}
function transformTile(tile: RawTile) {
  switch (tile) {
    case RawTile.AIR:
      return new Air();
    case RawTile.PLAYER:
      return new Player();
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
      return new Key1();
    case RawTile.LOCK1:
      return new Lock1();
    case RawTile.KEY2:
      return new Key2();
    case RawTile.LOCK2:
      return new Lock2();
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

function min(result: number, arr: number[][], x: number, y: number) {
  if (result > arr[y][x]) {
    result = arr[y][x];
  }
}

function minimum(arr: number[][]) {
  let result = Number.NEGATIVE_INFINITY;
  for (let y = 0; y < arr.length; y++) {
    for (let x = 0; x < arr[y].length; x++) {
      min(result, arr, x, y);
    }
  }
  return result;
}

function containsEven(arr: number[][]) {
  for (let y = 0; y < arr.length; y++) {
    for (let x = 0; x < arr[y].length; x++) {
      if (arr[y][x] % 2 === 0) {
        return true;
      }
    }
  }
  return false;
}

function removeLock1() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock1()) {
        map[y][x] = new Air();
      }
    }
  }
}
function removeLock2() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock2()) {
        map[y][x] = new Air();
      }
    }
  }
}

function moveToTile(newx: number, newy: number) {
  map[playery][playerx] = new Air();
  map[newy][newx] = new Player();
  playerx = newx;
  playery = newy;
}

function update() {
  handleInputs();
  updateMap();
}
function handleInputs() {
  while (inputs.length > 0) {
    let input = inputs.pop();
    input.handle();
  }
}
function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].update(y, x);
    }
  }
}

function drawPlayer(g: CanvasRenderingContext2D) {
  g.fillStyle = TILE_COLORS.PLAYER;
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
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
  drawPlayer(g);
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
