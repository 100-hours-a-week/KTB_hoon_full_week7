// 공통 API 설정 및 fetch 래퍼 (모든 페이지 스크립트보다 먼저 로드된다)
const BASE_URL = 'http://localhost:8080/api/v1';
const DEFAULT_IMAGE = '../images/default-profile.png';

function getToken() {
    return localStorage.getItem('accessToken');
}

// BASE_URL 접두사와 인증 헤더를 한 곳에서 붙이는 fetch 래퍼.
// 인증 방식이 바뀌어도(예: httpOnly 쿠키 전환) 이 함수만 고치면 된다.
// path 는 '/posts' 처럼 BASE_URL 뒤에 붙는 경로만 넘긴다.
async function apiFetch(path, options = {}) {
    const headers = { ...(options.headers || {}) };

    const token = getToken();
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }
    if (options.body != null && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    return fetch(BASE_URL + path, { ...options, headers });
}
