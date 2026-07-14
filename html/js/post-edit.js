const IMAGE_URL = 'https://cdn.example.com/post/default.png';

const profileIcon = document.getElementById('profileIcon');
const dropdown = document.getElementById('dropdown');
const editProfileBtn = document.getElementById('editProfileBtn');
const editPasswordBtn = document.getElementById('editPasswordBtn');
const logoutBtn = document.getElementById('logoutBtn');

const backBtn = document.getElementById('backBtn');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const titleHelper = document.getElementById('titleHelper');
const contentHelper = document.getElementById('contentHelper');
const fileBtn = document.getElementById('fileBtn');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const submitBtn = document.getElementById('submitBtn');

const params = new URLSearchParams(window.location.search);
const postId = params.get('postId');

let imageUrl = IMAGE_URL;

window.addEventListener('load', () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/login';
        return;
    }
    profileIcon.src = DEFAULT_IMAGE;
    loadPost();
});

async function loadPost() {
    try {
        const response = await apiFetch(`/posts/${postId}`);

        const data = await response.json();

        if (response.ok) {
            const post = data.data;

            // 내 글이 아니면 폼에 내용을 채우지 않고 상세로 되돌린다.
            if (!post.isMine) {
                window.location.href = `/post-detail/?postId=${postId}`;
                return;
            }

            titleInput.value = post.title;
            contentInput.value = post.content;
            fileName.textContent = post.imageUrl ? post.imageUrl.split('/').pop() : '기존 파일 명';
            imageUrl = post.imageUrl || IMAGE_URL;
            checkValid();
        }
    } catch (err) {
        console.error('게시글 로드 실패', err);
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
        await apiFetch('/logout', { method: 'POST' });
    } catch (err) {
        console.error('로그아웃 실패', err);
    } finally {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    }
});

backBtn.addEventListener('click', () => {
    window.location.href = `/post-detail/?postId=${postId}`;
});

titleInput.addEventListener('input', checkValid);
contentInput.addEventListener('input', checkValid);

function checkValid() {
    if (titleInput.value.trim() && contentInput.value.trim()) {
        submitBtn.classList.add('active');
    } else {
        submitBtn.classList.remove('active');
    }
}

fileBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        fileName.textContent = file.name;
        imageUrl = IMAGE_URL;
    }
});

submitBtn.addEventListener('click', async () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    titleHelper.textContent = '';
    contentHelper.textContent = '';

    let isValid = true;

    if (!title) {
        titleHelper.textContent = '제목을 입력해주세요.';
        isValid = false;
    }

    if (!content) {
        contentHelper.textContent = '내용을 입력해주세요.';
        isValid = false;
    }

    if (!isValid) return;

    submitBtn.disabled = true;

    try {
        const response = await apiFetch(`/posts/${postId}`, {
            method: 'PATCH',
            body: JSON.stringify({ title, content, imageUrl })
        });

        const data = await response.json();

        if (!response.ok) {
            const ERROR_MAP = {
                'TITLE_REQUIRED': '제목을 입력해주세요.',
                'TITLE_LENGTH_EXCEEDED': '제목은 최대 30자까지 입력 가능합니다.',
                'CONTENT_REQUIRED': '내용을 입력해주세요.',
                'IMAGE_REQUIRED': '이미지를 선택해주세요.',
                'NOT_POST_WRITER': '게시글 작성자만 수정할 수 있습니다.',
                'POST_NOT_FOUND': '게시글을 찾을 수 없습니다.',
            };
            titleHelper.textContent = ERROR_MAP[data.code] || '게시글 수정에 실패했습니다.';
            submitBtn.disabled = false;
            return;
        }

        window.location.href = `/post-detail/?postId=${postId}`;

    } catch (err) {
        console.error('게시글 수정 실패', err);
        titleHelper.textContent = '서버 오류가 발생했습니다. 다시 시도해주세요.';
        submitBtn.disabled = false;
    }
});