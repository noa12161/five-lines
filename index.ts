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
  isAir(): boolean;
  isFlux(): boolean;
  isUnbreakable(): boolean;
  isPlayer(): boolean;
  isStone(): boolean;
  isFallingStone(): boolean;
  isBox(): boolean;
  isFallingBox(): boolean;
  isKey1(): boolean;
  isKey2(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  color(g: CanvasRenderingContext2D): void;
}

class Air implements Tile {
  isAir(): boolean {
    return true;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  color(g: CanvasRenderingContext2D): void {}
}
class Flux implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return true;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = TILE_COLORS.FLUX;
  }
}
class Unbreakable implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return true;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = TILE_COLORS.UNBREAKABLE;
  }
}
class Player implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return true;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = TILE_COLORS.PLAYER;
  }
}
class Stone implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return true;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = TILE_COLORS.STONE;
  }
}
class FallingStone implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return true;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = TILE_COLORS.STONE;
  }
}
class Box implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return true;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = TILE_COLORS.BOX;
  }
}
class FallingBox implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return true;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = TILE_COLORS.BOX;
  }
}
class Key1 implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return true;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = TILE_COLORS.KEY1;
  }
}
class Key2 implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return true;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = TILE_COLORS.KEY2;
  }
}
class Lock1 implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return true;
  }
  isLock2(): boolean {
    return false;
  }
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = TILE_COLORS.LOCK1;
  }
}
class Lock2 implements Tile {
  isAir(): boolean {
    return false;
  }
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return true;
  }
  color(g: CanvasRenderingContext2D): void {
    g.fillStyle = TILE_COLORS.LOCK2;
  }
}

enum RawInput {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}
interface Input {
  isRight(): boolean;
  isLeft(): boolean;
  isUp(): boolean;
  isDown(): boolean;
  handle(): void;
}

class Right implements Input {
  isRight(): boolean {
    return true;
  }
  isLeft(): boolean {
    return false;
  }
  isUp(): boolean {
    return false;
  }
  isDown(): boolean {
    return false;
  }
  handle() {
    moveHorizontal(1);
  }
}
class Left implements Input {
  isRight(): boolean {
    return false;
  }
  isLeft(): boolean {
    return true;
  }
  isUp(): boolean {
    return false;
  }
  isDown(): boolean {
    return false;
  }
  handle() {
    moveHorizontal(-1);
  }
}
class Up implements Input {
  isRight(): boolean {
    return false;
  }
  isLeft(): boolean {
    return false;
  }
  isUp(): boolean {
    return true;
  }
  isDown(): boolean {
    return false;
  }
  handle() {
    moveVertical(-1);
  }
}
class Down implements Input {
  isRight(): boolean {
    return false;
  }
  isLeft(): boolean {
    return false;
  }
  isUp(): boolean {
    return false;
  }
  isDown(): boolean {
    return true;
  }
  handle() {
    moveVertical(1);
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
      return new Stone();
    case RawTile.FALLING_STONE:
      return new FallingStone();
    case RawTile.BOX:
      return new Box();
    case RawTile.FALLING_BOX:
      return new FallingBox();
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

let inputs: Input[] = [];

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

function moveHorizontal(dx: number) {
  // 사용자 이동
  if (
    map[playery][playerx + dx].isFlux() ||
    map[playery][playerx + dx].isAir()
  ) {
    moveToTile(playerx + dx, playery);
    // STONE || BOX 밀기
  } else if (
    (map[playery][playerx + dx].isStone() ||
      map[playery][playerx + dx].isBox()) &&
    map[playery][playerx + dx + dx].isAir() &&
    !map[playery + 1][playerx + dx].isAir()
  ) {
    map[playery][playerx + dx + dx] = map[playery][playerx + dx];
    moveToTile(playerx + dx, playery);
  } else if (map[playery][playerx + dx].isKey1()) {
    removeLock1();
    moveToTile(playerx + dx, playery);
  } else if (map[playery][playerx + dx].isKey2()) {
    removeLock2();
    moveToTile(playerx + dx, playery);
  }
}

function moveVertical(dy: number) {
  if (
    map[playery + dy][playerx].isFlux() ||
    map[playery + dy][playerx].isAir()
  ) {
    moveToTile(playerx, playery + dy);
  } else if (map[playery + dy][playerx].isKey1()) {
    removeLock1();
    moveToTile(playerx, playery + dy);
  } else if (map[playery + dy][playerx].isKey2()) {
    removeLock2();
    moveToTile(playerx, playery + dy);
  }
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
      updateTile(y, x);
    }
  }
}

function updateTile(y: number, x: number) {
  if (
    (map[y][x].isStone() || map[y][x].isFallingStone()) &&
    map[y + 1][x].isAir()
  ) {
    map[y + 1][x] = new FallingStone();
    map[y][x] = new Air();
  } else if (
    (map[y][x].isBox() || map[y][x].isFallingBox()) &&
    map[y + 1][x].isAir()
  ) {
    map[y + 1][x] = new FallingBox();
    map[y][x] = new Air();
  } else if (map[y][x].isFallingStone()) {
    map[y][x] = new Stone();
  } else if (map[y][x].isFallingBox()) {
    map[y][x] = new Box();
  }
}

function drawPlayer(g: CanvasRenderingContext2D) {
  g.fillStyle = "#ff0000";
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].color(g);
      if (!map[y][x].isAir() && !map[y][x].isPlayer())
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
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

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", (e) => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});
