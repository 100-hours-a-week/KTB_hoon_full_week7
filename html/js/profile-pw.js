const profileIcon = document.getElementById('profileIcon');
const dropdown = document.getElementById('dropdown');
const editProfileBtn = document.getElementById('editProfileBtn');
const editPasswordBtn = document.getElementById('editPasswordBtn');
const logoutBtn = document.getElementById('logoutBtn');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('passwordConfirm');
const passwordHelper = document.getElementById('passwordHelper');
const passwordConfirmHelper = document.getElementById('passwordConfirmHelper');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toast');

window.addEventListener('load', () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/login';
        return;
    }
    profileIcon.src = DEFAULT_IMAGE;
});

profileIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
});

document.addEventListener('click', () => {
    dropdown.classList.remove('show');
});

editProfileBtn.addEventListener('click', () => {
    window.location.href = '/profile';
});

editPasswordBtn.addEventListener('click', () => {
    window.location.href = '/profile-pw';
});

logoutBtn.addEventListener('click', async () => {
    try {
        await apiFetch('/logout', { method: 'POST' });
    } catch (err) {
        console.error('로그아웃 실패', err);
    } finally {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    }
});

passwordInput.addEventListener('input', checkValid);
passwordConfirmInput.addEventListener('input', checkValid);

function checkValid() {
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    if (password && passwordConfirm && isValidPassword(password) && password === passwordConfirm) {
        submitBtn.classList.add('active');
    } else {
        submitBtn.classList.remove('active');
    }
}
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}
submitBtn.addEventListener('click', async () => {
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    passwordHelper.textContent = '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개씩 포함해야 합니다.';
    passwordConfirmHelper.textContent = '';

    let isValid = true;

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

    if (!isValid) return;

    submitBtn.disabled = true;

    try {
        const response = await apiFetch('/profile/pw', {
            method: 'PATCH',
            body: JSON.stringify({ password, passwordConfirm })
        });

        const data = await response.json();

        if (!response.ok) {
            const ERROR_MAP = {
                'PASSWORD_REQUIRED': '비밀번호를 입력해주세요.',
                'INVALID_PASSWORD_FORMAT': '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개씩 포함해야 합니다.',
                'PASSWORD_CONFIRM_REQUIRED': '비밀번호를 한번 더 입력해주세요.',
                'PASSWORD_CONFIRM_MISMATCH': '비밀번호가 다릅니다.',
            };
            passwordHelper.textContent = ERROR_MAP[data.code] || '수정에 실패했습니다.';
            submitBtn.disabled = false;
            return;
        }

        showToast('수정완료');
        setTimeout(() => {
            window.location.href = '/profile';
        }, 2000);

    } catch (err) {
        console.error('요청 실패', err);
        passwordHelper.textContent = '서버 오류가 발생했습니다. 다시 시도해주세요.';
        submitBtn.disabled = false;
    }
});

function isValidPassword(password) {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/.test(password);
}