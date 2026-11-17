# 디자인 시스템

어두운 시네마 배경 위에 **평평한 면 + 얇은 헤어라인**으로 층을 나누는 차분한 방향입니다.  
글래스 질감은 떠 있는 크롬(하단 네비, 이미지 위 배지)에만 쓰고, 브랜드의 웜 피치는 단색 액센트로 남깁니다.

## 컬러

`tailwind.config.ts` + `globals.css` `:root`

| 토큰 | 값 | 용도 |
|------|-----|------|
| `background` | `#050607` | 거의 검정 베이스 |
| `on-surface` | `#f2f4f6` | 본문 |
| `on-surface-variant` | `#a8b4c0` | 보조 텍스트 |
| `primary` | `#ffe8e2` | 피치 하이라이트 |
| `primary-container` | `#ffc4b8` | 강조 컨테이너 |
| `secondary` | `#c9d8ff` | 쿨 블루 포인트 |
| `surface.container` | `#14181c` | 떠 있는 면 |

서피스·액센트 CSS 변수 (`globals.css` `:root`)

| 변수 | 값 | 용도 |
|------|-----|------|
| `--surface-1` | `white / 4%` | 기본 면 (`.surface-panel`) |
| `--surface-2` · `--surface-3` | `white / 7%` · `11%` | 한 단계 위 면 |
| `--hairline` · `--hairline-strong` | `white / 8%` · `14%` | 테두리 |
| `--accent` · `--accent-hover` | `#ffe6de` · `#fff1ec` | 주 CTA·활성 상태 |
| `--on-accent` | `#2b1c18` | 액센트 위 텍스트 |

Ambient: 상단 중앙에 아주 옅은 웜 radial 하나 (`body` background-image). 그림자·글로우는 최소화합니다.

## 타이포

| 역할 | 폰트 | CSS |
|------|------|-----|
| 로고 워드마크·푸터 | Dongle (「몽글Mongle」 8글자 서브셋) | `font-brand` |
| 제목 | Pretendard Variable 700–800, 자간 `-0.02 ~ -0.035em` | `font-display` |
| 영문 본문 | Nunito 가변 (라틴 범위) | `font-sans` |
| 한글 본문 | Pretendard Variable | `--font-ko` |

글꼴 파일은 모두 `src/app/fonts`에 두고 `next/font/local`로 불러온다 (빌드 때 Google Fonts에 접속하지 않음). 라이선스는 `src/app/fonts/licenses` (모두 SIL OFL 1.1).

- Dongle은 로고 글자만 담은 서브셋 — `font-brand`로 다른 글자를 쓰면 Pretendard로 표시됨. 글자를 늘리려면 `https://fonts.googleapis.com/css2?family=Dongle:wght@400;700&text=<글자>`로 다시 받아 교체
- Nunito에 없는 문자(라틴 확장 등)는 Pretendard가 받음

제목 크기 토큰 (`tailwind.config.ts`)

| 토큰 | 크기 | 용도 |
|------|------|------|
| `text-display-lg` | 2.75rem / 800 | 페이지 제목 (데스크톱) |
| `text-display-lg-mobile` | 1.875rem / 800 | 페이지 제목 (모바일) |
| `text-headline-md` | 1.375rem / 700 | 섹션 제목 |

- 홈 히어로 제목은 `clamp(2rem, 5.5cqi, 3.75rem)` + `text-balance` — 모바일은 포스터 그림 속 제목이 주인공이라 `text-2xl`로 한 단계 작게
- 섹션 제목은 본문색(`text-on-surface`) — 피치색 제목은 쓰지 않음
- UI 문구는 한국어 하나로 (영어 부제·`#해시태그` 병기 안 함)

브랜드 그라데이션 텍스트: `.mongle-gradient-text` (로고 전용)

## 서피스 유틸 (`globals.css`)

| 클래스 | 용도 |
|--------|------|
| `.surface-panel` | 카드·입력·패널 — 블러·그림자 없이 `--surface-1` + 헤어라인 |
| `.chrome-glass` | 떠 있는 크롬 전용 글래스 — 하단 네비, 이미지 위 배지 |
| `.accent-fill` | 주 CTA·선택된 탭/칩 — 단색 웜 오프화이트 |
| `.soft-fill` | 보조 버튼·아이콘 칩 — 뒤 배경을 어둡게 눌러 이미지 위에서도 읽힘 |
| `.cloud-bubble` | 저널 말풍선 모서리 |
| `.app-shell` | 중앙 `max-width: 1280px` 콘텐츠 프레임 |
| `.poster-card` | `--poster-w` 기반 세로 포스터 카드 |
| `.edge-fade-x` | 히어로 좌우 배경 페이드 |
| `.hero-fade-bottom` | 히어로 하단 페이드 (모바일 55%, sm+ 32%) |
| `.hero-frame` | 홈 키비주얼 높이 — 모바일 2:3, sm+ 16:9를 블리드 폭(`cqi`) 기준으로 계산 |

## 라운드 · 간격

- 페이지 셸: `--app-max: 80rem` (1280px), 패딩은 `.app-shell`
- 포스터 폭: `--poster-w` (`clamp`, 셸 안에서는 `cqi`)
- Tailwind 기본 반경 스케일을 쓰고, `rounded-3xl`만 20px로 낮춰 둠
- 포스터: `rounded-[8px]` (= `rounded-lg`) · 썸네일: `rounded-xl` (12px)
- 카드/패널: `rounded-2xl` (16px) ~ `rounded-3xl` (20px)
- 버튼/칩: `rounded-full`
- 모바일 하단 탭바를 위해 `main`에 `pb-[calc(3.5rem+safe-area)]`, 데스크톱(`md+`)은 `pb-0`

## 파비콘 · 브랜드 마크

- `src/app/favicon.ico`, `icon.png`, `apple-icon.png`  
  → 라운드 검정 플레이트 + 클라우드 (Cursor형 가독성)
- TopAppBar: `/cloud.png` + 「몽글」 워드마크

## 모션

토큰 (`tailwind.config.ts` = `globals.css` `--ease-*` / `--dur-*`)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `ease-standard` (기본) | `cubic-bezier(0.2, 0, 0, 1)` | 대부분의 상태 변화 |
| `ease-emphasized` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | 등장 |
| `duration-fast` | 150ms | 색·누름 |
| `duration-base` (기본 200ms) | 240ms | 작은 이동·FAB |
| `duration-slow` | 400ms | 이미지 줌·로드 페이드 |

규칙

- **누름:** `a`/`button`의 `.accent-fill`·`.soft-fill`은 `:active`에서 `scale(0.97)` (CSS 공통). 버튼에 `hover:scale-*` 쓰지 않기
- **카드 호버:** 카드 자체는 움직이지 않고, 안쪽 이미지만 `group-hover:scale-[1.04]` + `duration-slow`. 테두리는 `hover:border-white/20`
- **`transition-all` 금지:** 바뀌는 속성만 (`transition-colors`, `transition-[opacity,transform]` …)
- **스크롤 등장:** `.reveal` — CSS scroll-driven(`animation-timeline: view()`)으로 16px 떠오르며 페이드. 홈 레일·찾기 섹션·아카이브 카드에 사용. 미지원 브라우저는 정적으로 보임. 같은 요소에 hover transform을 함께 쓰지 않기 (애니메이션이 덮어씀)
- **상단바:** `.appbar-scrim` — 스크롤 0→120px 동안 배경 30%→78%, 헤어라인 등장
- **이미지 로드:** `MediaVisual`이 톤 배경 위로 `blur(8px)`→선명 + 페이드인 (`.media-img[data-loaded]`). `priority` 이미지는 LCP를 위해 처음부터 표시
- **포스터 → 상세 전환:** View Transitions API. `MediaLink`가 클릭한 포스터(`[data-vt-source]`)와 상세 백드롭(`.vt-media-hero`)을 `media-hero`로 이어 460ms 동안 커지게 하고, 제목·메타(`.vt-media-meta`)는 180ms 뒤 떠오름. 상단바·탭바는 `.vt-app-header`·`.vt-app-tabbar`로 분리해 이미지에 가리지 않음. 도착 이미지 디코딩을 최대 600ms 기다린 뒤 전환. 미지원 브라우저·움직임 줄이기·새 탭 클릭은 일반 이동
- **상세 → 목록 (돌아오기):** 상단바 ← 버튼은 `navigateBackWithTransition` — 전환으로 들어온 상세라면 출발했던 포스터(같은 작품이 여러 레일에 있어도 몇 번째 링크였는지 기억)로 상세 이미지가 줄어듦 (`html[data-vt-direction="back"]`: 큰 이미지는 320ms 동안 남고 포스터는 160ms 뒤 드러남). 스크롤은 Next보다 먼저 출발 위치로 맞춘 뒤 도착점을 잼. 포스터가 화면 밖이면 이미지는 그냥 사라짐. 브라우저 뒤로 가기·스와이프는 전환 없음 (브라우저 자체 제스처 애니메이션과 겹치므로)
- **이미지 재표시:** 한 번 로드된 이미지는 다시 그려질 때(뒤로 가기 등) 페이드인 없이 바로 보임
- **포스터 레일:** `PosterSwiper` (FreeMode · 마우스휠 · 페이지 단위 화살표)
- **움직임 줄이기:** `prefers-reduced-motion: reduce`면 모든 transition/animation을 사실상 끄고 `.reveal`·`.appbar-scrim`도 해제

## 하지 않을 것

- 히어로에 카드·뱃지·통계를 잔뜩 얹기  
- 반투명 CTA로 배경이 비쳐 탁해 보이게 만들기  
- 모든 카드에 글래스·블러·드롭섀도 얹기 (글래스는 떠 있는 크롬에만)  
- 글로우·스펙큘러·둥둥 뜨거나 깜빡이는 장식 애니메이션
- Inter / 기본 system UI 스택을 브랜드 폰트로 쓰기
- 홈에 가짜 “이어보기” 프로그레스 바를 두기
