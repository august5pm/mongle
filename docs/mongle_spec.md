# Mongle(몽글) - Technical Implementation Guide for Cursor

이 문서는 몽글(Mongle) 서비스의 디자인 시스템과 화면 구조를 Cursor(VS Code)에서 실제 코드로 구현하기 위한 가이드입니다.

## 1. 프로젝트 스택 추천
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React 또는 Google Material Icons
- **Fonts**: Playfair Display (Serif), Inter (Sans-serif)

## 2. 디자인 시스템 (Tailwind Config)

디자인 시스템 {{DATA:DESIGN_SYSTEM:DESIGN_SYSTEM_1}}의 핵심 토큰입니다. `tailwind.config.js`에 적용하세요.

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#FFB3A7', // 피치 (Main Point)
        secondary: '#B39DDB', // 바이올렛 (Sub Point)
        surface: {
          DEFAULT: '#101415', // 배경색
          bright: '#363a3b',
          container: '#1d2021',
        },
        on: {
          surface: '#E1E3E3',
          primary: '#45211B',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'mongle-gradient': 'linear-gradient(to right, #FFB3A7, #B39DDB)',
      },
      borderRadius: {
        'mongle': '2rem', // 부드러운 라운딩 처리
      }
    },
  },
}
```

## 3. 핵심 컴포넌트 구조

### TopAppBar (상단 네비게이션)
- `fixed top-0`, `backdrop-blur-xl` 적용
- 브랜드 로고: {{DATA:IMAGE:IMAGE_2}} 사용 또는 텍스트(`font-serif text-primary`)

### BottomNavBar (하단 탭바)
- `fixed bottom-0`, `rounded-t-xl`
- 메뉴: Home, Explore, Journal, Profile

## 4. 페이지 리스트 및 데이터 구조

1. **Home (`/`)**: {{DATA:SCREEN:SCREEN_7}} 기반
   - Featured Hero Section
   - Horizontal Scroll: 'Continue Watching', 'Soft & Fluffy Stories'
2. **Explore (`/explore`)**: {{DATA:SCREEN:SCREEN_3}} 기반
   - Search Bar (Rounded)
   - Sentiment Tags: #Dreamy, #Warm, #Intense
3. **Archive (`/archive`)**: {{DATA:SCREEN:SCREEN_5}} 기반
   - My Mongle Stats
   - Journal Feed: 감정 뱃지가 달린 영화 포스터 카드
4. **Details (`/movie/[id]`)**: {{DATA:SCREEN:SCREEN_6}} 기반
   - Cinema Backdrop
   - Cast & Related Mongles Section

---

**Tip for Cursor**: 위 내용을 프로젝트 루트의 `MONGLE_SPEC.md`로 저장한 뒤, Cursor Composer(Ctrl+I)에게 "이 명세서와 디자인 시스템을 바탕으로 Next.js 초기 프로젝트를 구성해줘"라고 요청하세요.