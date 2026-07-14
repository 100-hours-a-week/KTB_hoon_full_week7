const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const emailHelper = document.getElementById('emailHelper');
const passwordHelper = document.getElementById('passwordHelper');

emailInput.addEventListener('input', checkValid);
passwordInput.addEventListener('input', checkValid);
signupBtn.addEventListener('click', () => {
  window.location.href = '/signup';
});
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  emailHelper.textContent = '';
  passwordHelper.textContent = '';

  let isValid = true;

  if (!email) {
    emailHelper.textContent = '이메일을 입력해주세요.';
    isValid = false;
  } else if (!isValidEmail(email)) {
    emailHelper.textContent = '올바른 이메일 형식이 아닙니다.';
    isValid = false;
  }

  if (!password) {
    passwordHelper.textContent = '비밀번호를 입력해주세요.';
    isValid = false;
  }

  if (!isValid) return;

  try {
    const response = await apiFetch("/login", {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      const ERROR_MAP = {
          'EMAIL_REQUIRED': '이메일을 입력해주세요.',
          'INVALID_EMAIL_FORMAT': '올바른 이메일 형식이 아닙니다.',
          'PASSWORD_REQUIRED': '비밀번호를 입력해주세요.',
          'MEMBER_NOT_FOUND': '존재하지 않는 이메일입니다.',
          'PASSWORD_MISMATCH': '비밀번호가 올바르지 않습니다.',
      };

      emailHelper.textContent = ERROR_MAP[data.code] || '로그인에 실패했습니다.';
      return;
    }

    localStorage.setItem('accessToken', data.data.accessToken);

    window.location.href = '/posts';

  } catch (err) {
    console.error('요청 실패', err);
    emailHelper.textContent = '서버 오류가 발생했습니다. 다시 시도해주세요.';
  }
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checkValid() {
  const email = emailInput.value;
  const password = passwordInput.value;

  if (email && password && isValidEmail(email)) {
    loginBtn.classList.add('active');
  } else {
    loginBtn.classList.remove('active');
  }
}