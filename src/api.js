// 공통 API 설정 및 fetch 래퍼
const BASE_URL = "http://localhost:8080/api/v1";

function getToken() {
  return localStorage.getItem("accessToken");
}

// BASE_URL 접두사와 인증 헤더를 한 곳에서 붙이는 fetch 래퍼.
// path 는 '/login' 처럼 BASE_URL 뒤에 붙는 경로만 넘긴다.
export async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };

  const token = getToken();
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }
  if (options.body != null && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(BASE_URL + path, { ...options, headers });
}
