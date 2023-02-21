# 3장

## 규칙: 다섯 줄 제한

- 메서드는 다섯 줄 이하여야 한다는 말입니다. 이것은 두 가지 이상의 작업을 수행하는 메서드를 식별하는데 도움이 됩니다.
  리팩터링 패턴인 메서드 추출을 사용해서 긴 메서드를 분해하고 메서드 이름으로 주석을 대신합니다.

## 규칙: 호출 또는 전달, 한 가지만 할 것

- 함수 내에서는 객체에 있는 메서드를 호출하거나 객체를 인자로 전달할 수 있지만 둘을 석어 사용해서는 안 됩니다.
- 동일한 수준의 추상화를 유지하는 편이 코드를 읽기가 훨씨 더 쉽습니다.

## 좋은 함수 이름의 속성

- 정직해야 합니다. 함수의 의도를 설명해야 합니다.
- 완전해야 합니다. 함수가 하는 모든 것을 담아야 합니다.
- 도메인에서 일하는 사람이 이해할 수 있어야 합니다. 작업 중인 도메인에서 사용하는 단어를 사용하십시오

## 규칙: if 문은 함수의 시작에만 배치

- if 문이 있는경우 해당 if문은 함수의 첫번쨰 항목이어야 합니다.
- if 문이 메서드가 하는 유일한 일이어야 한다는 말은 곧 그 본문을 추출할 필요가 없으며, 또한 else 문 과 분리해서는 안 된다는 말입니다.

# 4장

## 규칙: if 문에서 else를 사용하지 말 것

- 이 리팩터링 패턴은 열거형을 인터페이스로 변환하고 열거형의 값들은 클래스가 됩니다. 그렇게 하면 각 값에 속성을 추가하고 해당 특정 값과 관련된 기능을 특성에 맞게 만들 수 있습니다.
- 프로그램에서 이해하지 못하는 타입(형) 인지를 검사하지 않는 한 if문에서 else를 사용하지 마십시오.
- if-else를 사용하면 코드에서 결정이 내려지는 지점을 고정하게 됩니다. 그럴경우 if-else가 있는 위치 이후에서는 다른 변형을 도입할 수 없기 떄문에
  코드의 유연성이 떨어집니다. if-else는 하드코딩된 결정으로 볼 수 있씁니다. 코드에서 하드코딩된 상수가 좋지 않는 것 처럼 하드코딩된 결정도 좋지 않습니다.
- 독립된 if문은 검사(check)로 간주하고, if-else 문은 의사결정(desision)으로 간주합니다.

## if-else 문에서 클래스로 타입코드 대체

- 임시 이름을 가진 새로운 인터페이스를 도입합니다. 인터페이스에는 열거형(enum)의 각 값에 대한 메서드가 있어야 합니다.

1. 열거형의 각 값에 해당하는 클래스를 만듭니다. 클래스에 해당하는 메서드를 제외한 인터페이스의 모든 메서드는 false를 반환해야 합니다
2. 열거형의 이름을 다른 이름으로 바꿉니다. 그렇게 하면 컴파일러가 열거형을 사용하는 모든 위치에서 오류를 발생시킵니다.
3. 타입을 이전 이름에서 임시 이름으로 변경하고 일치성 검사를 새로운 메서드로 대체합니다.
4. 남아있는 열거형 값에 대한 참조 대신 새로울 클래스를 인스턴스화하여 교체합니다.
5. 오류가 더 이상 없으면 인터페이스의 이름을 모든 위칭[서 영구적인 것으로 바꿉니다.

- 예제 (클래스로 타입코드 대체 전)
  ```typescript
  enum TrafficLight {
    RED,
    YELLOW,
    GREEN,
  }
  const CYCLE = [TrafficLight.RED, TrafficLight.YELLOW, TrafficLight.GREEN];
  function updateCarForLight(current: TrafficLight) {
    if (current === TraficLight.RED) {
      car.stop();
    } else {
      car.drive();
    }
  }
  ```
- 예제 (클래스로 타입코드 대체 이후)
  ```typescript
  interface TrafficLight {
    isRed(): boolean;
    isYellow(): boolean;
    isGreen(): boolean;
  }
  class Red implements TrafficLight {
    isRed(): {return true}
    isYellow(): {return false}
    isGreen(): {return false}
  }
  class Yellow implements TrafficLight {
    isRed(): {return false}
    isYellow(): {return true}
    isGreen(): {return false}
  }
  class Green implements TrafficLight {
    isRed(): {return false}
    isYellow(): {return false}
    isGreen(): {return true}
  }
  const CYCLE = [new Red(), new Green(), new Yellow()]
  function updateCarForLight(current: TrafficLight) {
    if (current.isRed()) {
      car.stop()
    } else {
      car.drive
    }
  }
  ```

## 리팩토리 패턴: 클래스로의 코드 이관

- 이 리팩터링 패턴은 기능을 클래스로 옮기기 떄문에 클래스로 탕비 코드 대체 패턴의 자연스러운 연장선에 있습니다. 결과적으로 if 구분이 제거되고 기능이 데이터에 더 가까이 이동합니다.
- 가장단순한 형태로, 항상 메서드 전체를 클래스로 옮긴다고 가정합니다.

1. 원래 함수를 복사하여 모든 클래스로 붙여 넣습니다. 이제 메서드이므로 function 키워드를 제거합니다. 컨텍스트를 this로 바꾼 후 사용하지 않는 매개변수를 제거합니다.
   메서드에 여전히 잘못된 이름이 존재하기 때문에 오류가 계속 발생합니다.
2. 메서드 선언부분의 메서드 이름과 매개변수 리스트(메서드 시그니처)를 인터페이스에 복사하고 원래 메서드와 약간 다른 이름으로 지정합니다.
3. 모든 클래스에서 새로운 메서드를 점검힙니다.

   - 클래스에서 맞게 조건식들의 true, false를 결정합니다.
   - 미리 계산할 수 있는 모든 계산을 수행합니다. 일반적으로 if (true) 와 if(false) {...} 를 제거하는 것과 같지만 먼저 조건을 단순화해야 할 수도 있습니다
     e.g. (false || true) === true
   - 메서드 처리가 완료되었음을 알릴 수 있는 적절한 이름으로 변경합니다. 이떄 컴파일러에서 에러가 발생하면 안 됩니다.

4. 원래 함수의 본문을 새로운 메서드에 대한 호출로 바꿉니다.

- 예제 (클래스로 타입코드 대체의 연장...)
  ```typescript
  interface TrafficLight {
    isRed(): boolean;
    isYellow(): boolean;
    isGreen(): boolean;
    // new
    updateCar(): void
  }
  class Red implements TrafficLight {
    isRed(): {return true}
    isYellow(): {return false}
    isGreen(): {return false}
    // new
    updateCar(): {car.stop()}
  }
  class Yellow implements TrafficLight {
    isRed(): {return false}
    isYellow(): {return true}
    isGreen(): {return false}
    // new
    updateCar(): {car.drive()}
  }
  class Green implements TrafficLight {
    isRed(): {return false}
    isYellow(): {return false}
    isGreen(): {return true}
    // new
    updateCar(): {car.drive()}
  }
  const CYCLE = [new Red(), new Green(), new Yellow()]
  function updateCarForLight(current: TrafficLight) {
    current.updateCar()
    /*
    if (current.isRed()) {
      car.stop()
    } else {
      car.drive
    }
    */
  }
  ```

## 규칙: switch를 사용하지 말 것

- default 케이스가 없고 모든 case에 반환 값이 있는 경우가 아니라면 switch를 사용하지 마십시오.

## 규칙: 인터페이스에서만 상속받을 것

- 상속은 오직 인터페이스를 통해서만 받습니다.
- 사람들이 추상 클래스를 사용하는 가장 일반적인 이유는 일부 ㅁ[서드에는 기본 구현을 제공하고 다른 메서드는 추상화하기 위한 것입니다.
  이것은 중복을 줄이고 코드의 줄을 줄이고자 할 경우 편리합니다.
  그러나 안타깝게도 단점이 훨씬 더 많습니다. 코드 공유는 커플링(결함)을 유발합니다. 이 경우 커플링은 추상 클래스의 코드입니다.

# 5장. 유사한 코드 융합하기

## 리팩터링 패턴: 유사 클래스 통합

- 두 개의 클래스를 합치는 것은 두 단계로 이루어지는데, 절차는 분수를 더하는 알고리즘과 유사합니다.
- 분수를 더한는 첫 번째 단계는 분모를 동일하게 만드는 것이고 클래스를 결합하는 첫 번째 단계는 `상수 메서드`를 제외한 클래스의 모든 것을 동일하게 만드는 것입니다.
- 분수를 더하는 두 번째 단계는 실제 더하기 입니다. 클래스의 경우에는 실제로 합치는 것입니다.
- 예제(클래스 통합 전)

  ```typescript
  class Stone implements Tile {
    // ...
    moveHorizontal(dx: number) {
      if (
        map[playery][playerx + dx + dx].isAir() &&
        !mpa[playert + 1][playerx + dx].isAir()
      ) {
        map[playery][playerx + dx + dx] = this;
        moveToTile(playerx + dx, playery);
      }
    }
  }

  class FallingStone implements Tile {
    // ...
    moveHorizontal(dx: number) {}
  }
  ```

- 예제 (클래스 통합 이후)
  ```typescript
  class Stone implements Tile {
    constructor(private falling: boolean);
    isFallingStone() {
      return this.falling;
    }
    // ...
    moveHorizontal(dx: number) {
      if (this.isFallingStone() !== true) {
        if (
          map[playery][playerx + dx + dx].isAir() &&
          !mpa[playert + 1][playerx + dx].isAir()
        ) {
          map[playery][playerx + dx + dx] = this;
          moveToTile(playerx + dx, playery);
        }
      } else if (this.isFallingStone()) {
      }
    }
  }
  /*
  Stone 클래스에 통합됨
  class FallingStone implements Tile {
    // ...
    moveHorizontal(dx: number) {}
  }
  */
  ```

## 리팩터링 패턴: 전략 패턴의 도입

- 다른 클래스를 인스턴스화해서 변형을 도입하는 개념을 `전략 패턴` 이라고 합니다.

  1. 분리하려른 코드에 대해 `메서드 추출`을 수행합니다. 다른 것과 통합하려면 메서드가 동일한지 확인합니다.
  2. 새로운 클래스를 만듭니다.
  3. 생성자에서 새로운 클래스를 인스터스화합니다.
  4. 메서드를 새로운 클래스로 옮깁니다.
  5. 필드에 종속성이 있을 경우 다음을 수행합니다.

  - 필드를 새로운 클래스로 옮기고 옮긴 필드에 대한 접근자를 만듭니다.
  - 새로운 접근자를 사용해서 원래 클래스에 발생하는 오류를 바로잡습니다.

  6. 새로운 클래스의 나머지 오류에 대해 해당 값을 대체할 매개변수를 추가합니다.
  7. `메서드의 인라인화`를 사용해서 1단계의 추출을 반대로 합니다.

- 예제 (리팩터링 전)

```typescript
class ArrayMinimum {
  constructor(private acc: number) {}
  proccess(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
      if (this.acc > arr[i]) this.acc = arr[i];
    }
    return this.acc;
  }
}
class ArraySum {
  constructor(private acc: number) {}
  proccess(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
      this.acc += arr[i];
    }
    return this.acc;
  }
}
```

- 예제 (리팩터링 후)

```typescript
class MinimumProcessor {
  contructor(private acc: number) {}
  getAcc() {
    return this.acc;
  }
  proccessElement(e: number) {
    if (this.acc > e) this.acc = e;
  }
}
class SumProcessor {
  contructor(private acc: number) {}
  getAcc() {
    return this.acc;
  }
  proccessElement(e: number) {
    this.acc += e;
  }
}
class ArrayMinimum {
  private processor: MinimumProcessor;
  constructor(acc: number) {
    this.processor = new MinimumProcessor(acc);
  }
  proccess(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
      this.processor.processElement(arr[i]);
    }
    return this.processor.getAcc();
  }
}
class ArraySum {
  private processor: SumProcessor;
  constructor(acc: number) {
    this.processor = new SumProcessor(acc);
  }
  proccess(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
      this.processor.processElement(arr[i]);
    }
    return this.processor.getAcc();
  }
}
```

## 규칙: 구현체가 하나뿐인 인터페이스를 만들지 말 것

# 6장. 데이터 보호

## 규칙: getter와 setter를 사용하지 말 것

- 부울(boolean) 이 아닌 필드에 setter나 getter를 사용하지 마십시오.
- 여기서 setter 또는 getter를 언급할 떄는 각각 부울이 아닌 필드를 직접 할당하거나 반환하는 메서드를 의미합니다.
- 객체의 필드에 대한 getter가 존재하는 순간 캡슐화를 해제하고 불변속성을 전역적으로 만들게 됩니다.
- 이론적으로 setter는 내부데이터 구조를 변경하고 해당 setter를 수정해도 시그니처를 유지할수 있는 또다른 간접겆ㄱ인 레이어를 도입할수 있습니다.
  이 규칙의 정의에 따르면 이러한 메서드는 더 이상 setter가 아니므로 문제가 되지 않습니다. 그러나 실제로 일어나는 일은,
  setter를 통한 새로운 데이터 구조를 반환하도록 getter를 수정하는 것입니다.
