# 디자인 시스템

어두운 보이드 배경 위에 **진주빛(pearl) 클레이·글래스** 재질을 올리는 방향입니다.  
레퍼런스는 유백 광택의 3D 클라우드, 앱 크롬은 둥근 검정 파비콘·플로팅 네비로 통일합니다.

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

Ambient: 좌상단 웜 피치 / 우상단 쿨 블루 radial glow (`body` background-image).

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
| `.glass-panel` | 카드·네비·검색창 — 맑은 반투명 글래스 |
| `.pearl-clay` | 주 CTA — **불투명** 크림·피치 진주 (탁한 반투명 지양) |
| `.pearl-clay-soft` | 보조 버튼·아이콘 칩 — 밝은 유리 + 선명 보더 |
| `.peach-glow` | `filter: drop-shadow` 글로우 (box-shadow를 덮지 않음) |
| `.spec-shine` | 스펙큘러 하이라이트 오버레이 |
| `.cloud-bubble` | 저널 말풍선 모서리 |

## 라운드 · 간격

- 카드/벤토: `rounded-2xl` ~ `rounded-3xl`
- 버튼/칩: `rounded-full`
- 페이지 패딩: `px-container-mobile` (20px) / `px-container-desktop` (40px)
- 하단 네비·FAB을 위해 `main`에 `pb-32`

## 파비콘 · 브랜드 마크

- `src/app/favicon.ico`, `icon.png`, `apple-icon.png`  
  → 라운드 검정 플레이트 + 클라우드 (Cursor형 가독성)
- TopAppBar: `/cloud.png` + 「몽글」 워드마크

## 모션

- 레일/카드: `animate-rail-in`, hover `-translate-y`
- 히어로 글로우: `animate-float`
- BottomNav expand↔compact: ~700ms `cubic-bezier(0.32, 0.72, 0, 1)`

## 하지 않을 것

- 히어로에 카드·뱃지·통계를 잔뜩 얹기  
- 반투명 CTA로 배경이 비쳐 탁해 보이게 만들기  
- Inter / 기본 system UI 스택을 브랜드 폰트로 쓰기
