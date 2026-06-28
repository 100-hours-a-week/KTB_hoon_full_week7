const BASE_URL = 'http://localhost:8080';
const DEFAULT_IMAGE = '../images/default-profile.png';

const profileIcon = document.getElementById('profileIcon');
const dropdown = document.getElementById('dropdown');
const editProfileBtn = document.getElementById('editProfileBtn');
const editPasswordBtn = document.getElementById('editPasswordBtn');
const logoutBtn = document.getElementById('logoutBtn');

const writeBtn = document.getElementById('writeBtn');
const postList = document.getElementById('postList');
const loading = document.getElementById('loading');

let nextCursor = null;
let hasNext = true;
let isLoading = false;

window.addEventListener('load', () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/login';
        return;
    }
    profileIcon.src = DEFAULT_IMAGE;
    loadPosts();
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

writeBtn.addEventListener('click', () => {
    window.location.href = '/post-write';
});

function formatCount(num) {
    if (num >= 1000) return Math.floor(num / 1000) + 'k';
    return num;
}

function formatDate(dateStr) {
    return dateStr.replace('T', ' ').split('.')[0];
}

function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';

    const title = document.createElement('p');
    title.className = 'post-title';
    title.textContent = post.isBlind ? '숨김 처리된 게시글' : post.title;

    const meta = document.createElement('div');
    meta.className = 'post-meta';

    const stats = document.createElement('div');
    stats.className = 'post-stats';

    const likeSpan = document.createElement('span');
    likeSpan.textContent = `좋아요 ${formatCount(post.likeCount)}`;

    const commentSpan = document.createElement('span');
    commentSpan.textContent = `댓글 ${formatCount(post.commentCount)}`;

    const viewSpan = document.createElement('span');
    viewSpan.textContent = `조회수 ${formatCount(post.viewCount)}`;

    stats.appendChild(likeSpan);
    stats.appendChild(commentSpan);
    stats.appendChild(viewSpan);

    const date = document.createElement('span');
    date.className = 'post-date';
    date.textContent = formatDate(post.createdAt);

    meta.appendChild(stats);
    meta.appendChild(date);

    const author = document.createElement('div');
    author.className = 'post-author';

    const authorImg = document.createElement('img');
    authorImg.className = 'author-img';
    authorImg.src = DEFAULT_IMAGE;
    authorImg.alt = '작성자';

    const authorName = document.createElement('span');
    authorName.className = 'author-name';
    authorName.textContent = post.writerNickname;

    author.appendChild(authorImg);
    author.appendChild(authorName);

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(author);

    card.addEventListener('click', () => {
        window.location.href = `/post-detail/?postId=${post.postId}`;
    });

    return card;
}

async function loadPosts() {
    if (isLoading || !hasNext) return;
    isLoading = true;

    try {
        loading.classList.add('show');

        const url = nextCursor
            ? `${BASE_URL}/api/v1/posts?size=10&cursor=${nextCursor}`
            : `${BASE_URL}/api/v1/posts?size=10`;

        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        });

        const data = await response.json();

        if (response.ok) {
            data.data.data.forEach(post => {
                postList.appendChild(createPostCard(post));
            });
            nextCursor = data.data.nextCursor;
            hasNext = data.data.hasNext;
        }

    } catch (err) {
        console.error('게시글 로드 실패', err);
    } finally {
        loading.classList.remove('show');
        isLoading = false;
    }
}

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) loadPosts();
});
observer.observe(loading);