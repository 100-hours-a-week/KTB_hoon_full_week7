const BASE_URL = 'http://localhost:8080';
const DEFAULT_IMAGE = '../images/default-profile.png';

const profileIcon = document.getElementById('profileIcon');
const dropdown = document.getElementById('dropdown');
const editProfileBtn = document.getElementById('editProfileBtn');
const editPasswordBtn = document.getElementById('editPasswordBtn');
const logoutBtn = document.getElementById('logoutBtn');

const profileChangeBtn = document.getElementById('profileChangeBtn');
const fileInput = document.getElementById('fileInput');
const profileImg = document.getElementById('profileImg');
const nicknameInput = document.getElementById('nickname');
const nicknameHelper = document.getElementById('nicknameHelper');
const submitBtn = document.getElementById('submitBtn');
const withdrawBtn = document.getElementById('withdrawBtn');

const modalOverlay = document.getElementById('modalOverlay');
const modalBtn = document.getElementById('modalBtn');

const withdrawModalOverlay = document.getElementById('withdrawModalOverlay');
const withdrawCancelBtn = document.getElementById('withdrawCancelBtn');
const withdrawConfirmBtn = document.getElementById('withdrawConfirmBtn');

let imageUrl = "https://cdn.example.com/profile/u1.png";
let originalNickname = '';

window.addEventListener('load', () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/login';
        return;
    }
    loadUserInfo();
});

async function loadUserInfo() {
    try {
        const response = await fetch(BASE_URL + '/api/v1/profile', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('emailText').textContent = data.data.email;
            nicknameInput.value = data.data.nickname;
            originalNickname = data.data.nickname;
            profileImg.src = DEFAULT_IMAGE;
            profileIcon.src = DEFAULT_IMAGE;
            checkValid();
        }
    } catch (err) {
        console.error('유저 정보 로드 실패', err);
    }
}

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
        await fetch(BASE_URL + '/api/v1/logout', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        });
    } catch (err) {
        console.error('로그아웃 실패', err);
    } finally {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    }
});

profileChangeBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        profileImg.src = URL.createObjectURL(file);
        imageUrl = "https://cdn.example.com/profile/u1.png";
    }
});

nicknameInput.addEventListener('input', () => {
    nicknameInput.value = nicknameInput.value.replace(/\s/g, '');
    checkValid();
});

submitBtn.addEventListener('click', async () => {
    const nickname = nicknameInput.value;

    nicknameHelper.textContent = '띄어쓰기 불가, 10글자 이내';

    let isValid = true;

    if (!nickname) {
        nicknameHelper.textContent = '닉네임을 입력해주세요.';
        isValid = false;
    } else if (nickname.length > 10) {
        nicknameHelper.textContent = '닉네임은 최대 10자까지 입력 가능합니다.';
        isValid = false;
    }

    if (!isValid) return;

    submitBtn.disabled = true;

    try {
        const response = await fetch(BASE_URL + '/api/v1/profile', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            body: JSON.stringify({ nickname, imageUrl })
        });

        const data = await response.json();

        if (!response.ok) {
            const ERROR_MAP = {
                'NICKNAME_REQUIRED': '닉네임을 입력해주세요.',
                'INVALID_NICKNAME_FORMAT': '닉네임은 최대 10자까지 입력 가능합니다.',
                'NICKNAME_DUPLICATED': '중복 닉네임입니다.',
                'IMAGE_REQUIRED': '프로필 이미지를 선택해주세요.',
            };
            nicknameHelper.textContent = ERROR_MAP[data.code] || '수정에 실패했습니다.';
            submitBtn.disabled = false;
            return;
        }

    
        originalNickname = nickname;
        showToast('수정완료');
        submitBtn.disabled = false;
        checkValid();

    } catch (err) {
        console.error('요청 실패', err);
        nicknameHelper.textContent = '서버 오류가 발생했습니다. 다시 시도해주세요.';
        submitBtn.disabled = false;
    }
});

modalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('show');
});

withdrawBtn.addEventListener('click', () => {
    withdrawModalOverlay.classList.add('show');
});

withdrawCancelBtn.addEventListener('click', () => {
    withdrawModalOverlay.classList.remove('show');
});

withdrawConfirmBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(BASE_URL + '/api/v1/profile', {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        });

        if (response.ok) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
    } catch (err) {
        console.error('회원 탈퇴 실패', err);
    }
});

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function checkValid() {
    const nickname = nicknameInput.value;
    if (nickname && isValidNickname(nickname) && nickname !== originalNickname) {
        submitBtn.classList.add('active');
    } else {
        submitBtn.classList.remove('active');
    }
}

function isValidNickname(nickname) {
    return /^[^\s]{1,10}$/.test(nickname);
}