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
| 브랜드·큰 제목 | Dongle | `font-brand` / `font-display` |
| 영문 본문 | Nunito | `font-sans` |
| 한글 본문 | Pretendard Variable | `--font-ko` |

브랜드 그라데이션 텍스트: `.mongle-gradient-text`

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
| `.hero-fade-bottom` | 히어로 하단 페이드 |

## 라운드 · 간격

- 페이지 셸: `--app-max: 80rem` (1280px), 패딩은 `.app-shell`
- 포스터 폭: `--poster-w` (`clamp`, 셸 안에서는 `cqi`)
- Tailwind 기본 반경 스케일을 쓰고, `rounded-3xl`만 20px로 낮춰 둠
- 포스터: `rounded-[8px]` (= `rounded-lg`) · 썸네일: `rounded-xl` (12px)
- 카드/패널: `rounded-2xl` (16px) ~ `rounded-3xl` (20px)
- 버튼/칩: `rounded-full`
- 하단 네비·FAB을 위해 `main`에 `pb-32`

## 파비콘 · 브랜드 마크

- `src/app/favicon.ico`, `icon.png`, `apple-icon.png`  
  → 라운드 검정 플레이트 + 클라우드 (Cursor형 가독성)
- TopAppBar: `/cloud.png` + 「몽글」 워드마크

## 모션

- 레일/카드: `animate-rail-in`, hover `-translate-y`
- 포스터 레일: `PosterSwiper` (FreeMode · 마우스휠 · 페이지 단위 화살표)
- BottomNav expand↔compact: ~700ms `cubic-bezier(0.32, 0.72, 0, 1)` (그림자 transition은 width/padding만)

## 하지 않을 것

- 히어로에 카드·뱃지·통계를 잔뜩 얹기  
- 반투명 CTA로 배경이 비쳐 탁해 보이게 만들기  
- 모든 카드에 글래스·블러·드롭섀도 얹기 (글래스는 떠 있는 크롬에만)  
- 글로우·스펙큘러·둥둥 뜨는 장식 애니메이션
- Inter / 기본 system UI 스택을 브랜드 폰트로 쓰기
- 홈에 가짜 “이어보기” 프로그레스 바를 두기
