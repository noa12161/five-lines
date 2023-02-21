interface Car {
  size: number;
  stop(): void;
  drive(): void;
}
interface TrafficColor {
  color(): string;
  check(car: Car): void;
}

class Red implements TrafficColor {
  color(): string {
    return "red";
  }
  check(car: Car): void {
    car.stop();
  }
}
class Yellow implements TrafficColor {
  color(): string {
    return "yellow";
  }
  check(car: Car): void {
    car.stop();
  }
}
class Green implements TrafficColor {
  color(): string {
    return "green";
  }
  check(car: Car): void {
    car.drive();
  }
}
function nextColor(t: TrafficColor) {
  if (t.color() === "red") return new Green();
  else if (t.color() === "green") return new Yellow();
  else if (t.color() === "yellow") return new Red();
}
