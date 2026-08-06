# Mobile App Builder

> 이 파일은 **Gemini CLI** 컨텍스트 파일입니다. 이 프로젝트 폴더에서 `gemini`를 실행하면 자동으로 로드됩니다.

모바일 앱의 UI/UX 설계 → 네이티브 코드 생성 → API 연동 → 스토어 배포 준비를 에이전트 팀이 협업하여 수행하는 하네스.

---

## 에이전트 구성 & 워크플로우

| 순서 | 담당 | 역할 요약 | 의존 | 주요 도구 |
|---|---|---|---|---|
| 1 | **ux-designer** | 와이어프레임, 디자인 시스템, 네비게이션, HIG/Material 가이드라인 준수 | 없음 | Write, Read |
| 2a | **app-developer** | 네이티브/크로스플랫폼 코드 생성, MVVM/Clean Architecture | ux-designer | Bash, Write, Read |
| 3a | **store-manager** | App Store / Google Play 메타데이터, 개인정보 방침, 심사 대응 | ux-designer | Write, Read |
| 4 | **api-integrator** | REST/GraphQL 클라이언트, 인증(OAuth/JWT), 캐싱, 오프라인 지원 | ux-designer, app-developer | Write, Read |
| 5 | **qa-engineer** | UI/성능/접근성/보안 테스트, 정합성 교차 검증 | app-developer, store-manager | SendMessage, Write, Read |

---

## 트리거 조건

- "모바일 앱 만들어줘", "앱 개발해줘", "iOS 앱", "Android 앱", "Flutter 앱", "React Native 앱", "앱 UI 설계", "앱 스토어 배포", "앱 API 연동"

---

## 에이전트 정의 & 산출물 포맷

### 1. ux-designer (모바일 UX/UI 설계자)
- **역할**: 와이어프레임, 디자인 시스템, 네비게이션 구조, 인터랙션 패턴 설계. iOS HIG / Material Design 및 접근성(A11y) 고려.
- **산출물 (UX/UI 설계 문서)**:
  - 앱 개요 (이름, 플랫폼, 사용자, 가치 제안)
  - 사용자 여정 맵 & 네비게이션 구조 (Tab Bar, Drawer, Stack)
  - 화면별 와이어프레임 (레이아웃, 컴포넌트, 인터랙션, 상태)
  - 디자인 시스템 (컬러 팔레트, 타이포그래피, 컴포넌트 목록)

### 2. app-developer (모바일 앱 개발자)
- **역할**: Swift/SwiftUI, Kotlin/Jetpack Compose, Flutter, React Native 코드 생성 및 테스트 가능한 아키텍처 구현.
- **산출물 (앱 아키텍처 문서)**:
  - 기술 스택 (프레임워크, 언어, 상태관리, 네비게이션, 로컬DB, 네트워크, DI)
  - 프로젝트 구조 (`core/`, `data/`, `domain/`, `presentation/`, `di/`)
  - 화면별 구현 명세 & 상태 관리 설계
  - 에러 처리 전략 (네트워크 오류, 인증 만료, 데이터 파싱)

### 3. api-integrator (API 연동 전문가)
- **역할**: REST/GraphQL API 클라이언트 구현, OAuth/JWT 인증, 캐싱, 오프라인 지원, 에러 핸들링 설계.
- **산출물 (API 연동 명세)**:
  - API 엔드포인트 목록
  - 인증 흐름 (OAuth 2.0 / JWT / Keychain / EncryptedSharedPreferences)
  - 데이터 모델 & 캐싱 전략 (TTL, ETag, 무효화 조건)
  - 오프라인 지원 및 에러 처리 매트릭스 (400, 401, 403, 404, 429, 500)

### 4. store-manager (앱 스토어 배포 매니저)
- **역할**: App Store Connect 및 Google Play Console 메타데이터, 스크린샷 가이드, 개인정보처리방침, 심사 대응 준비.
- **산출물 (앱 스토어 배포 패키지)**:
  - App Store & Google Play 메타데이터 (앱 이름, 설명, 키워드, 스크린샷 시나리오)
  - 개인정보 세부사항 (App Privacy & Data Safety)
  - 심사 대응 체크리스트 & 출시 전략 (TestFlight, 단계적 출시)
  - 개인정보처리방침 초안

### 5. qa-engineer (모바일 QA 엔지니어)
- **역할**: UI, 성능, 접근성, 보안 점검, 플랫폼 호환성 테스트 및 산출물 정합성 교차 검증.
- **산출물 (QA 검증 보고서)**:
  - 종합 평가 (배포 준비 상태: 🟢/🟡/🔴)
  - 발견 사항 (🔴필수 / 🟡권장 / 🟢참고)
  - 정합성 매트릭스 (UX ↔ 코드 ↔ API ↔ 스토어 메타데이터 ↔ 성능/보안)
  - 테스트 커버리지 & 최종 체크리스트

---

## 협업 규칙

1. 지정된 워크플로우 순서대로 에이전트가 협업합니다.
2. 각 에이전트는 산출물을 `_workspace/` 디렉토리에 마크다운 파일로 저장합니다.
3. 후속 에이전트는 선행 에이전트의 산출물을 참조하여 작업을 이어갑니다.
4. **자동 깃허브 푸시:** 모든 소스코드 수정 및 배포가 완료되면, 에이전트는 마지막 단계에서 수정한 코드를 자동으로 깃허브(GitHub) 원격 저장소에 푸시(`git push`)해야 합니다.
