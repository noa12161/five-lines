interface Bird {
  hasBeak(): boolean;
  canFly(): boolean;
  canSwim(): boolean;
}

class CommonBird implements Bird {
  hasBeak(): boolean {
    return true;
  }

  canFly(): boolean {
    return true;
  }

  canSwim(): boolean {
    return false;
  }
}

class Penguin implements Bird {
  private bird = new CommonBird();

  hasBeak(): boolean {
    return this.bird.hasBeak();
  }

  canFly(): boolean {
    return false;
  }

  canSwim(): boolean {
    return false;
  }
}
