# 로드맵

## 완료됨

- [x] Next.js 14 + Tailwind + TypeScript 골격  
- [x] 브랜드 몽글 / Dongle·Nunito·Pretendard  
- [x] 진주 글래스·클레이 디자인 토큰 (탁한 반투명 CTA 개선 포함)  
- [x] 홈 · 탐색 · 아카이브 · 상세 · 프로필  
- [x] BottomNav 스크롤 모프, Archive FAB 스크롤 숨김  
- [x] mock 데이터 + TMDB 이미지 path / `MediaVisual`  
- [x] 파비콘 (라운드 블랙 + 클라우드)  
- [x] GitHub 공개: [august5pm/mongle](https://github.com/august5pm/mongle)  
- [x] 프로젝트 문서 (`docs/`) 정리  
- [x] 저널 작성 플로우 (`/journal/new`)  
- [x] Supabase + Google 로그인 · journals RLS  

## 다음 우선순위

### 1. Supabase/Google 프로덕션 키 연결

로컬 `.env.local` + [supabase-setup.md](./supabase-setup.md) 완료 후 배포 환경 변수 등록.

### 2. 포스터·목 데이터 품질

- 전 화면에서 `MediaVisual` 누락 없는지 점검  
- 깨진 TMDB path 교체, 홈/탐색 목록 콘텐츠 차별화  

### 2. TMDB API 연동

- `TMDB_API_KEY`로 검색·인기작 fetch  
- mock → API 어댑터로 `searchMedia` 등 교체  

### 3. 배포

- Vercel 배포  
- README에 라이브 링크  

### 4. 있으면 좋은 것

- 위시리스트 / 찜 동작  
- 프로필 편집  
- 접근성(포커스 링, 이미지 alt) 보강  
- README 스크린샷  
- 저널 삭제·수정
## 참고 · 주의

개발 서버(`next dev`) 실행 중 `npm run build`를 돌리면 `.next`가 깨질 수 있습니다.

```bash
# 복구
pkill -f next   # 또는 해당 포트 프로세스 종료
rm -rf .next
nvm use 20 && npm run dev
```
