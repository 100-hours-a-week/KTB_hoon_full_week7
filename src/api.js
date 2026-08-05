const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

function getToken() {
  return localStorage.getItem("accessToken");
}

function setToken(token) {
  localStorage.setItem("accessToken", token);
}

// 세션이 끊긴(RT 만료·위조·재사용) 상황을 앱 전역에 알린다.
// App이 이 이벤트를 듣고 로그인 화면으로 보낸다.
function notifySessionExpired() {
  localStorage.removeItem("accessToken");
  window.dispatchEvent(new Event("auth:invalid-token"));
}

// 실제 fetch 한 번. credentials:"include" 로 RT 쿠키를 주고받는다.
function sendRequest(path, options, token) {
  const headers = { ...(options.headers || {}) };
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }
  if (options.body != null && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return fetch(BASE_URL + path, { ...options, headers, credentials: "include" });
}

// 진행 중인 재발급 Promise. 동시에 여러 요청이 401을 받아도 재발급은 "한 번만"
// 수행하고 나머지 요청은 그 결과를 기다린다(RTR 재사용 감지 방지).
let reissuePromise = null;

async function requestReissue() {
  // AT 헤더 없이 RT 쿠키만으로 새 AT를 받는다.
  const res = await fetch(BASE_URL + "/reissue", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("REISSUE_FAILED");
  const body = await res.json();
  const newToken = body?.data?.accessToken;
  if (!newToken) throw new Error("REISSUE_FAILED");
  setToken(newToken);
  return newToken;
}

function ensureReissued() {
  if (!reissuePromise) {
    reissuePromise = requestReissue().finally(() => {
      reissuePromise = null;
    });
  }
  return reissuePromise;
}

// 재발급을 시도하면 안 되는 인증 엔드포인트(무한 루프 방지)
const AUTH_PATHS = ["/login", "/signup", "/logout", "/reissue"];

export async function apiFetch(path, options = {}) {
  let response = await sendRequest(path, options, getToken());

  // AT 없음/만료/위조/로그아웃이면 401 INVALID_TOKEN.
  // 명세 §1.2대로 /reissue로 새 AT를 받아 원 요청을 한 번 재시도한다.
  const reissuable = !AUTH_PATHS.some((p) => path.startsWith(p));
  if (response.status === 401 && reissuable) {
    let code = "";
    try {
      // clone()으로 미리 읽어도 호출부에서 response.json()을 다시 쓸 수 있다.
      code = (await response.clone().json())?.code;
    } catch {
      // body 없음
    }

    if (code === "INVALID_TOKEN") {
      try {
        const newToken = await ensureReissued();
        response = await sendRequest(path, options, newToken);
      } catch {
        // 재발급 실패(INVALID_REFRESH_TOKEN 등) → 세션 종료, 로그인 화면으로
        notifySessionExpired();
      }
    }
  }

  return response;
}
