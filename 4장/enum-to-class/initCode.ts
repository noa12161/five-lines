export enum CarCurrent {
  DRIVE = "DRIVE",
  STOP = "STOP",
}
interface ICar {
  current: CarCurrent;
  stop(): void;
  drive(): void;
}

class Car implements ICar {
  // current: string
  current = CarCurrent.DRIVE;

  stop() {
    this.current = CarCurrent.STOP;
  }

  drive() {
    this.current = CarCurrent.DRIVE;
  }
}

enum TrafficLight {
  RED,
  YELLOW,
  GREEN,
}

const car1 = new Car();
export const car2 = new Car();

const CYCLE = [TrafficLight.RED, TrafficLight.GREEN, TrafficLight.YELLOW];

function updateCarForLight(current: TrafficLight) {
  if (current === TrafficLight.RED) {
    car1.stop();
  } else {
    car1.drive();
  }
}

interface Tile {
  x: number;
  y: number;
}

function abs(x: number) {
  return x;
}

function canMove(start: Tile, end: Tile, dx: number, dy: number) {
  return dx * abs(start.x - end.x);
}
