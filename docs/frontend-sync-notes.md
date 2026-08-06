# 프론트엔드 ↔ API 명세 동기화 기록

`docs/api-specification.md` 기준으로 `src/` (React SPA) 연동 지점을 대조한 결과.
날짜: 2026-08-05

## 1. 연동 일치 확인 (구현 완료 & 명세 일치)

아래 엔드포인트는 method / path / 요청 body / 응답 파싱이 모두 명세와 일치함.

| 명세 | 프론트엔드 위치 | 비고 |
|------|----------------|------|
| POST `/login` | `components/LoginForm.jsx` | `data.data.accessToken` → localStorage `accessToken` 저장 |
| POST `/logout` | `components/ProfileHeader.jsx` | 실패해도 로컬 토큰 제거 후 `/login` 이동 |
| POST `/signup` | `components/SignupForm.jsx` | body: email/nickname/password/passwordConfirm/imageUrl |
| GET `/profile` | `components/ProfileForm.jsx` | email/nickname 로드 |
| PATCH `/profile` | `components/ProfileForm.jsx` | body: nickname/imageUrl |
| PATCH `/profile/pw` | `components/ProfilePasswordForm.jsx` | body: password/passwordConfirm |
| DELETE `/profile` | `pages/ProfilePage.jsx` | 탈퇴 후 토큰 제거 |
| GET `/posts?cursor&size` | `pages/PostsPage.jsx` | 커서 페이지네이션(`nextCursor`/`hasNext`), 무한 스크롤 |
| GET `/posts/{postId}` | `pages/PostDetailPage.jsx`, `pages/PostEditPage.jsx` | `isMine`/`isBlind`/`isLikedByMe`/`comments` 사용 |
| POST `/posts` | `pages/PostWritePage.jsx` | 응답 `data.postId`로 상세 이동 |
| PATCH `/posts/{postId}` | `pages/PostEditPage.jsx` | |
| DELETE `/posts/{postId}` | `pages/PostDetailPage.jsx` | |
| POST / DELETE `/posts/{postId}/likes` | `pages/PostDetailPage.jsx` | 응답 `likeCount`/`isLikedByMe` 단일 출처 |
| POST `/posts/{postId}/comments` | `components/CommentSection.jsx` | |
| PATCH / DELETE `/posts/{postId}/comments/{commentId}` | `components/CommentSection.jsx` | |

에러 코드 → 한글 메시지 매핑(`*_ERROR_MAP`)도 로그인/회원가입/프로필/게시글에서 명세 코드와 일치.

## 2. 명세에 있으나 프론트엔드에 미구현 (기록 후 보류)

> `html/` 레거시 레퍼런스에도 아래 기능은 없음 → 원래 화면 자체가 설계되지 않은 영역.

### 2.1 Report API (신고) — 명세 §5 ✅ 구현 완료 (게시글 + 댓글)
- `POST /api/v1/report` — 게시글/댓글 공용. `ReportModal`로 사유 선택 후 제출.
  - 게시글: 상세 우측 상단 "신고" 버튼 → `{ targetId: Number(postId), targetType: "POST", reportReason }`
  - 댓글: 각 댓글 헤더의 "신고" 버튼 → `{ targetId: commentId, targetType: "COMMENT", reportReason }`
  - 사유 enum(§6.2): `SPAM/ABUSE/INAPPROPRIATE/ADVERTISEMENT/ETC` (`ReportModal.jsx`)
  - 위치: `components/ReportModal.jsx`(공용 모달, `targetLabel`로 문구 분기) · `components/PostHeader.jsx`·`components/CommentItem.jsx`(진입 버튼) · `pages/PostDetailPage.jsx`(`reportTarget` 상태·호출·토스트)
  - 에러 매핑: `ALREADY_REPORTED`, `SELF_REPORT_NOT_ALLOWED`, `REPORT_REASON_REQUIRED`, `INVALID_ENUM_VALUE`, `POST_NOT_FOUND`, `COMMENT_NOT_FOUND` → 한글 메시지(`REPORT_ERROR_MAP`)
  - 본인 게시글/댓글에는 신고 버튼 미노출(`!isMine`)로 `SELF_REPORT_NOT_ALLOWED` 사전 차단.
- 게시글 자동 블라인드(누적 5회) 결과인 `isBlind`는 목록/상세에서 "숨김 처리된 게시글"로 표시 처리됨(§3 수신부).

### 2.2 PostDraft API (임시 저장 글) — 명세 §4 ✅ 구현 완료 (모집글 작성 화면)
- 6개 엔드포인트 연동: 목록 `GET /posts/drafts`, 상세 `GET /drafts/{id}`, 생성 `POST /posts/drafts`, 수정 `PATCH /drafts/{id}`, 발행 `POST /drafts/{id}/publish`, 삭제 `DELETE /drafts/{id}`.
- 위치: `pages/PostWritePage.jsx`(상태·호출), `components/PostForm.jsx`(write 모드 임시저장/불러오기 버튼), `components/DraftsModal.jsx`(목록·불러오기·삭제).
- 흐름: **임시저장** 버튼 → 최초 POST(생성), 이후 PATCH(수정). draftId를 로컬 state로 유지. **완료**(발행) → draftId 있으면 `/publish`, 없으면 일반 `POST /posts`. **불러오기** → 목록 모달에서 선택 시 폼을 `key` 리마운트로 초기값 교체.
- 발행 성공 시 상세로 이동하며 draftId를 더 이상 참조하지 않음(명세의 발행 후 404 semantics 부합).
- 임시저장은 검증 없이 현재 값 전송(빈 필드 허용), 단 제목/내용이 모두 비면 버튼 비활성.
- 에러 매핑 추가: `NOT_POST_DRAFT_WRITER`, `POST_DRAFT_NOT_FOUND`.

## 3. 부분 구현 / 주의점 (연동은 되지만 명세 의도와 갭 존재)

### 3.1 이미지 업로드 엔드포인트 부재
- 명세에 이미지 업로드 API가 없음. 프론트엔드는 파일 선택만 받고 `imageUrl`은 가짜 값으로 채워 전송:
  - `SignupForm.jsx`: `imageUrl` = `"../images/default-profile.png"` (상대경로 — 실제 URL 아님)
  - `ProfileForm.jsx`: `PLACEHOLDER_IMAGE_URL = "https://cdn.example.com/profile/u1.png"` 고정
  - `PostForm.jsx`: `DEFAULT_IMAGE_URL = "https://cdn.example.com/post/default.png"` 또는 기존값 유지
- 즉 사용자가 고른 이미지는 실제로 저장되지 않음. 별도 업로드 API 확정 시 연동 필요.

### 3.2 댓글 에러 피드백 없음
- `CommentSection.jsx`는 `response.ok`만 체크하고 실패 시 조용히 무시(`COMMENT_REQUIRED`, `NOT_COMMENT_WRITER`, `COMMENT_NOT_FOUND` 미표시).

### 3.3 게시글 상세 429(POST_RATE_LIMIT_EXCEEDED) 미세분
- `PostDetailPage.jsx`는 모든 실패를 "게시글을 불러오지 못했습니다."로 일괄 처리. 조회수 rate-limit(429)를 별도 안내하지 않음.
- 반면 `PostWritePage/PostEditPage`의 `ERROR_MAP`에는 `POST_RATE_LIMIT_EXCEEDED` 항목이 있으나 명세상 create/edit는 429를 반환하지 않아 실제 미발동(불일치는 아니고 잉여 매핑).

### 3.4 미표시 응답 필드
- 목록 응답의 `isEdited`(수정됨 표시)는 UI에서 미사용(표시 기획 없음).

## 4. 인증/라우팅 처리 (프론트 자체 정책)

### 4.1 라우트 보호 & 홈
- 공개 라우트: `/`(홈, `HomePage.jsx`), `/login`, `/signup`. 그 외는 `RequireAuth`로 감싸 토큰 없으면 `/login`으로 리다이렉트(`App.jsx`).
- 알 수 없는 경로(`path="*"`)는 홈으로 보냄.
- 기존 페이지별 `useEffect` 토큰 가드는 제거하고 `RequireAuth` 한 곳으로 일원화.

### 4.2 RT 재발급(reissue) 플로우 — 명세 §1.2 ✅
- 모든 요청에 `credentials: "include"` → 로그인 응답의 RT HttpOnly 쿠키 저장, 이후 재발급/로그아웃에 쿠키 전송.
- `apiFetch`가 401 `INVALID_TOKEN`을 받으면 `POST /reissue`로 새 AT를 받아 **원 요청을 1회 재시도**.
- **재발급 큐잉**: 동시에 여러 요청이 401을 받아도 `reissuePromise` 하나로 묶어 재발급은 한 번만 수행(RTR 재사용 감지 방지).
- 재발급 실패(`INVALID_REFRESH_TOKEN` 등)면 토큰 삭제 + `auth:invalid-token` 이벤트 → `App.jsx` 리스너가 `/login`으로 이동.
- 무한 루프 방지: `/login /signup /logout /reissue` 는 재발급 대상에서 제외.

## 5. 최신 명세 반영 (드리프트 수정)

- **로그인 실패 코드**: `MEMBER_NOT_FOUND`/`PASSWORD_MISMATCH` → **`LOGIN_FAILED`** 하나로 통일(`LoginForm.jsx`). 이메일 형식 오류는 이메일 필드, 그 외는 비밀번호 필드에 표시.
- **비밀번호 변경 `currentPassword`**: `ProfilePasswordForm.jsx`에 "현재 비밀번호" 입력 추가, body `{ currentPassword, password, passwordConfirm }`. `CURRENT_PASSWORD_REQUIRED`/`CURRENT_PASSWORD_MISMATCH` 에러 매핑 추가.
- **비밀번호 정규식 정합**: 프론트가 서버(`@ValidPassword`)보다 엄격했던 규칙(대/소문자+특정 특수문자 강제)을 서버 규칙 `^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$`(영문·숫자·특수문자 각 1자, 8~20자)로 통일(`SignupForm.jsx`, `ProfilePasswordForm.jsx`). 안내문도 변경.
- **게시글 수정 `POST_IMAGE_REQUIRED`**(400) 에러 코드 매핑 추가(`PostEditPage.jsx`).

### 남은 갭
- **비밀번호 변경 성공 후 재로그인 유도 미적용**: 명세 §2.4는 변경 성공 시 RT 전부 폐기 → 재로그인 권장. 현재는 토스트 후 `/profile`로 이동(AT 만료 전까지는 동작). 필요 시 성공 후 로그아웃 처리로 변경.
- **목록 `INVALID_PAGE_SIZE`**(400): `PostsPage`가 항상 `size=10`(유효 범위 1~10)만 보내 실제 발생하지 않음 → 별도 처리 없음.
- **탈퇴 회원 404 `MEMBER_NOT_FOUND`**: 프로필/게시글 API에서 별도 분기 없이 일반 실패로 처리.

## 6. 모집 정보 필드 + 검색 (명세 §3.1~3.5, §3.2, §6.3~6.5) ✅

- **모집 정보 필드**: `category`·`meetingType`·`address`·`placeName`·`capacity`·`recruitStatus` 전면 반영.
  - enum/라벨/이모지 상수: `src/constants/recruit.js`
  - 작성/수정 폼(`PostForm.jsx`): 카테고리 칩 선택, 모임방식 세그먼트(ONLINE/OFFLINE), 지역 입력(오프라인만, 시/도·시/군/구·읍/면/동+상세), 장소명(최대 50), 모집 인원(양수). 클라 검증 + 서버 에러코드 매핑(`RECRUIT_ERROR_MESSAGES`).
  - 전송: `OFFLINE`이면 `address` 객체, `ONLINE`이면 `address:null`. `capacity` 비면 `null`. `recruitStatus`는 전송하지 않음(생성 시 서버가 `RECRUITING` 고정).
  - 목록 카드(`PostCard.jsx`): 카테고리 배지 + 모집중/모집완료 pill + 위치/온라인·인원 라인. `CLOSED`는 흐리게.
  - 상세(`PostRecruitInfo.jsx`): 배지/상태 + 모임방식·위치·인원 패널. 블라인드 글에는 미표시.
  - 발행(draft publish): draft엔 모집 정보가 없으므로 발행 폼에서 새로 입력해 함께 전송(명세 §4.5 부합). 임시저장(POST/PATCH drafts)은 여전히 title/content/imageUrl만.
- **목록·조건검색 통합(§3.1)**: 명세 변경으로 목록과 검색이 **단일 엔드포인트 `GET /posts`** 로 합쳐짐. 모든 파라미터(`keyword`/`category`/`meetingType`/`recruitStatus`/`sido`/`sigungu`/`from`/`to`/`cursor`/`size`) 선택. **`/posts/search`는 폐지**(호출 시 400 `INVALID_PARAMETER_TYPE`) → 프론트에서 제거 완료.
  - 목록 상단 검색바 + **필터 패널**(`PostsPage.jsx`): 카테고리 칩, 모임방식/모집여부 세그먼트(전체 포함), 지역 드롭다운(sido/sigungu), 작성일 범위(from/to date). 적용된 필터는 제거 가능한 칩으로 표시.
  - 세팅된 파라미터만 `URLSearchParams`로 `/posts`에 붙여 전송. 커서 무한스크롤 재사용.
  - **키워드 없이 필터만으로도 조회 가능**(이전 keyword-필수 제약 해소). 아무 조건 없으면 전체 목록.
  - 클라 검증: `from > to` 차단(`INVALID_DATE_RANGE` 예방). 서버 에러코드(`INVALID_DATE_RANGE`/`INVALID_ENUM_VALUE`/`INVALID_PARAMETER_TYPE`/`INVALID_PAGE_SIZE`) → 한글 메시지 매핑.
  - 지역은 작성 폼·검색 필터 공용 드롭다운(`RegionSelect` + `constants/regions.js`) → 완전 일치 검색과 값 일관성 확보.
  - 블라인드 글은 검색/목록 결과에서 서버가 제외(§3.1). 상세는 마스킹된 형태로 접근 가능.

### 남은 갭 (모집)
- **모집 마감(`CLOSED` 전환) API 없음**(명세 §3.5/§6.5 명시) → 상태 변경 UI도 없음. 표시만 지원.
- **주소 입력은 수기 텍스트**(시/도·시/군/구·읍/면/동). 주소 검색 API 연동은 없음.
- **카테고리 필터링**: 목록 API에 카테고리 쿼리 파라미터가 없어 서버측 필터 미지원 → 필터 UI 미제공(검색은 키워드만).
