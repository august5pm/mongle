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
- [x] 아카이브 공개 피드 (모두의 몽글)  
- [x] TMDB API 검색·트렌딩·상세 연동  
- [x] 홈 레일 TMDB화 (트렌딩·포근·비오는날 discover)  
- [x] 위시리스트 / 찜 (`wishlists` + `/wishlist`)  
- [x] Vercel 배포 ([mongle-steel.vercel.app](https://mongle-steel.vercel.app))  
- [x] Supabase Redirect URLs에 프로덕션 도메인 추가  
- [x] 저널 삭제·수정  
- [x] README 스크린샷 · 기본 접근성 (skip link, focus-visible, aria)  

## 다음 우선순위

### 다음으로 좋은 것

- GitHub ↔ Vercel 자동 배포 연결 확인  
- Google Cloud JS origin에 프로덕션 도메인 추가 (콘솔에서)  
## 참고 · 주의

개발 서버(`next dev`) 실행 중 `npm run build`를 돌리면 `.next`가 깨질 수 있습니다.

```bash
# 복구
pkill -f next   # 또는 해당 포트 프로세스 종료
rm -rf .next
nvm use 20 && npm run dev
```
