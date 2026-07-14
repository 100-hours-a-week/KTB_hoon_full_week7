const profileBtn = document.getElementById("profileBtn");
const fileInput = document.getElementById('fileInput');
const profileImg = document.getElementById('profileImg');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('passwordConfirm');
const nicknameInput = document.getElementById('nickname');
const registerBtn = document.getElementById('registerBtn');
const emailHelper = document.getElementById('emailHelper');
const passwordHelper = document.getElementById('passwordHelper');
const passwordConfirmHelper = document.getElementById('passwordConfirmHelper');
const nicknameHelper = document.getElementById('nicknameHelper');
const loginBtn = document.getElementById('toLoginBtn');
const backBtn = document.getElementById('backBtn');

let imageUrl = "https://cdn.example.com/profile/u1.png";

emailHelper.textContent = '영문과 @, . 만 가능합니다';
passwordHelper.textContent = '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개씩 포함해야 합니다.';
nicknameHelper.textContent = '띄어쓰기 불가, 10글자 이내';
profileBtn.addEventListener('click', () => {
    fileInput.click();
});
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const previewUrl = URL.createObjectURL(file);
        profileImg.src = previewUrl;
        profileBtn.classList.add('selected');
        imageUrl = getImageUrl(file);
    }
});
emailInput.addEventListener('input', checkValid);
passwordInput.addEventListener('input', checkValid);
passwordConfirmInput.addEventListener('input', checkValid);
nicknameInput.addEventListener('input', () => {
    nicknameInput.value = nicknameInput.value.replace(/\s/g, '');
    checkValid();
});
backBtn.addEventListener('click', () => {
    window.location.href = '/login';
});
loginBtn.addEventListener('click', () => {
    window.location.href = '/login';
});
registerBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    const nickname = nicknameInput.value;
    emailHelper.textContent = '영문과 @, . 만 가능합니다';
    passwordHelper.textContent = '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개씩 포함해야 합니다.';
    passwordConfirmHelper.textContent = '';
    nicknameHelper.textContent = '띄어쓰기 불가, 10글자 이내';

    let isValid = true;

    if (!email) {
        emailHelper.textContent = '이메일을 입력해주세요.';
        isValid = false;
    } else if (!isValidEmail(email)) {
        emailHelper.textContent = '올바른 이메일 주소 형식을 입력해주세요.';
        isValid = false;
    }

    if (!password) {
        passwordHelper.textContent = '비밀번호를 입력해주세요.';
        isValid = false;
    } else if (!isValidPassword(password)) {
        passwordHelper.textContent = '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개씩 포함해야 합니다.';
        isValid = false;
    }

    if (!passwordConfirm) {
        passwordConfirmHelper.textContent = '비밀번호를 한번 더 입력해주세요.';
        isValid = false;
    } else if (password !== passwordConfirm) {
        passwordConfirmHelper.textContent = '비밀번호가 다릅니다.';
        isValid = false;
    }

    if (!nickname) {
        nicknameHelper.textContent = '닉네임을 입력해주세요.';
        isValid = false;
    } else if (nickname.length > 10) {
        nicknameHelper.textContent = '닉네임은 최대 10글자까지 작성 가능합니다.';
        isValid = false;
    }

    if (!isValid) return;

    try {
        const response = await apiFetch("/signup", {
            method: 'POST',
            body: JSON.stringify({ email, nickname, password, passwordConfirm, imageUrl })
        });

        const data = await response.json();

        if (!response.ok) {
            const SIGNUP_ERROR_MAP = {
                'EMAIL_REQUIRED': '이메일을 입력해주세요.',
                'INVALID_EMAIL_FORMAT': '올바른 이메일 주소 형식을 입력해주세요.',
                'PASSWORD_REQUIRED': '비밀번호를 입력해주세요.',
                'INVALID_PASSWORD_FORMAT': '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개씩 포함해야 합니다.',
                'PASSWORD_CONFIRM_REQUIRED': '비밀번호를 한번 더 입력해주세요.',
                'PASSWORD_CONFIRM_MISMATCH': '비밀번호가 다릅니다.',
                'NICKNAME_REQUIRED': '닉네임을 입력해주세요.',
                'INVALID_NICKNAME_FORMAT': '닉네임은 최대 10글자까지 작성 가능합니다.',
                'IMAGE_REQUIRED': '프로필 이미지를 선택해주세요.',
                'EMAIL_DUPLICATED': '중복된 이메일입니다.',
                'NICKNAME_DUPLICATED': '닉네임 중복입니다.',
            };
            if (data.code === 'EMAIL_DUPLICATED' || data.code === 'EMAIL_REQUIRED' || data.code === 'INVALID_EMAIL_FORMAT') {
                emailHelper.textContent = SIGNUP_ERROR_MAP[data.code];
            } else if (data.code === 'NICKNAME_DUPLICATED' || data.code === 'NICKNAME_REQUIRED' || data.code === 'INVALID_NICKNAME_FORMAT') {
                nicknameHelper.textContent = SIGNUP_ERROR_MAP[data.code];
            } else if (data.code === 'PASSWORD_CONFIRM_MISMATCH' || data.code === 'PASSWORD_CONFIRM_REQUIRED') {
                passwordConfirmHelper.textContent = SIGNUP_ERROR_MAP[data.code];
            } else if (data.code === 'PASSWORD_REQUIRED' || data.code === 'INVALID_PASSWORD_FORMAT') {
                passwordHelper.textContent = SIGNUP_ERROR_MAP[data.code];
            } else {
                emailHelper.textContent = SIGNUP_ERROR_MAP[data.code] || '회원가입에 실패했습니다.';
            }
            return;
        }

        window.location.href = '/login';

    } catch (err) {
        console.error('요청 실패', err);
        emailHelper.textContent = '서버 오류가 발생했습니다. 다시 시도해주세요.';
    }
});

function checkValid() {
    const email = emailInput.value;
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    const nickname = nicknameInput.value;

    if (email && password && passwordConfirm && nickname
        && isValidEmail(email) && isValidPassword(password) && isValidNickname(nickname)
        && password === passwordConfirm) {
        registerBtn.classList.add('active');
    } else {
        registerBtn.classList.remove('active');
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/.test(password);
}

function isValidNickname(nickname) {
    return /^[^\s]{1,10}$/.test(nickname);
}

function getImageUrl(file) {
    return "https://cdn.example.com/profile/u1.png";
}