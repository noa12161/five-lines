import { car2 } from "./initCode";

interface TrafficLight {
  isRed(): boolean;
  isYellow(): boolean;
  isGreen(): boolean;
  updateCar(): void;
}

class Red implements TrafficLight {
  isRed(): boolean {
    return true;
  }
  isYellow(): boolean {
    return false;
  }
  isGreen(): boolean {
    return false;
  }
  updateCar() {
    car2.stop();
  }
}
class Yellow implements TrafficLight {
  isRed(): boolean {
    return false;
  }
  isYellow(): boolean {
    return true;
  }
  isGreen(): boolean {
    return false;
  }
  updateCar() {
    car2.drive();
  }
}
class Green implements TrafficLight {
  isRed(): boolean {
    return false;
  }
  isYellow(): boolean {
    return false;
  }
  isGreen(): boolean {
    return true;
  }
  updateCar() {
    car2.drive();
  }
}

const CYCLE = [new Red(), new Green(), new Yellow()];

function updateCarForLight(current: TrafficLight) {
  current.updateCar();
}

// const CYCLE_TIME = 60
// setTimeout(() => {
//   let count = 3
//   updateCarForLight(CYCLE[3%count])
//   count++
// }, CYCLE_TIME * 1000)
