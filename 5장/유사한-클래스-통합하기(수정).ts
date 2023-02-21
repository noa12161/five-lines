interface Car {
  size: number;
  stop(): void;
  drive(): void;
}

interface ITraffic {
  color: _TrafficColor;
  check(car: Car): void;
}

interface _TrafficColor {
  carAction(car: Car, trafic: ITraffic): void;
}

class _Traffic implements ITraffic {
  color = this.col;
  constructor(private col: _TrafficColor) {}
  check(car: Car): void {
    this.color.carAction(car, this);
  }
}

class _Red implements _TrafficColor {
  carAction(car: Car, trafic: ITraffic): void {
    car.stop();
    trafic.color = new _Green();
  }
}

class _Green implements _TrafficColor {
  carAction(car: Car): void {
    car.drive();
    trafic.color = new _Yellow();
  }
}

class _Yellow implements _TrafficColor {
  carAction(car: Car, trafic: ITraffic): void {
    car.stop();
    trafic.color = new _Red();
  }
}

const trafic = new _Traffic(new _Red());
