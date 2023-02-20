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

- 프로그램에서 이해하지 못하는 타입(형) 인지를 검사하지 않는 한 if문에서 else를 사용하지 마십시오.
- if-else를 사용하면 코드에서 결정이 내려지는 지점을 고정하게 됩니다. 그럴경우 if-else가 있는 위치 이후에서는 다른 변형을 도입할 수 없기 떄문에
  코드의 유연성이 떨어집니다. if-else는 하드코딩된 결정으로 볼 수 있씁니다. 코드에서 하드코딩된 상수가 좋지 않는 것 처럼 하드코딩된 결정도 좋지 않습니다.
- 독립된 if문은 검사(check)로 간주하고, if-else 문은 의사결정(desision)으로 간주합니다.

## if-else 문에서 클래스로 타입코드 대체

- 임시 이름을 가진 새로운 인터페이스를 도입합니다. 인터페이스에는 열거형(enum)의 각 값에 대한 메서드가 있어야 합니다.
- 열거형의 각 값에 해당하는 클래스를 만듭니다. 클래스에 해당하는 메서드를 제외한 인터페이스의 모든 메서드는 false를 반환해야 합니다
- 열거형의 이름을 다른 이름으로 바꿉니다. 그렇게 하면 컴파일러가 열거형을 사용하는 모든 위치에서 오류를 발생시킵니다.
- 타입을 이전 이름에서 임시 이름으로 변경하고 일치성 검사를 새로운 메서드로 대체합니다.
- 남아있는 열거형 값에 대한 참조 대신 새로울 클래스를 인스턴스화하여 교체합니다.
- 오류가 더 이상 없으면 인터페이스의 이름을 모든 위칭[서 영구적인 것으로 바꿉니다.

## 리팩토리 패턴: 클래스로의 코드 이관