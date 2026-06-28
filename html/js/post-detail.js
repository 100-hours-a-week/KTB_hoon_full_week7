const BASE_URL = 'http://localhost:8080';
const DEFAULT_IMAGE = '../images/default-profile.png';

const profileIcon = document.getElementById('profileIcon');
const dropdown = document.getElementById('dropdown');
const editProfileBtn = document.getElementById('editProfileBtn');
const editPasswordBtn = document.getElementById('editPasswordBtn');
const logoutBtn = document.getElementById('logoutBtn');

const postTitle = document.getElementById('postTitle');
const postAuthorImg = document.getElementById('postAuthorImg');
const postAuthorName = document.getElementById('postAuthorName');
const postDate = document.getElementById('postDate');
const postActions = document.getElementById('postActions');
const editPostBtn = document.getElementById('editPostBtn');
const deletePostBtn = document.getElementById('deletePostBtn');
const postImage = document.getElementById('postImage');
const postContent = document.getElementById('postContent');
const likeBtn = document.getElementById('likeBtn');
const likeCount = document.getElementById('likeCount');
const viewCount = document.getElementById('viewCount');
const commentCount = document.getElementById('commentCount');

const commentInput = document.getElementById('commentInput');
const commentSubmitBtn = document.getElementById('commentSubmitBtn');
const commentList = document.getElementById('commentList');

const postDeleteModal = document.getElementById('postDeleteModal');
const postDeleteCancelBtn = document.getElementById('postDeleteCancelBtn');
const postDeleteConfirmBtn = document.getElementById('postDeleteConfirmBtn');
const commentDeleteModal = document.getElementById('commentDeleteModal');
const commentDeleteCancelBtn = document.getElementById('commentDeleteCancelBtn');
const commentDeleteConfirmBtn = document.getElementById('commentDeleteConfirmBtn');

const params = new URLSearchParams(window.location.search);
const postId = params.get('postId');

let isLiked = false;
let currentLikeCount = 0;
let editingCommentId = null;
let deletingCommentId = null;

window.addEventListener('load', () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/login';
        return;
    }
    profileIcon.src = DEFAULT_IMAGE;
    loadPost();
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
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
        });
    } catch (err) {
        console.error('로그아웃 실패', err);
    } finally {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    }
});

document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = '/posts';
});

function formatCount(num) {
    if (num >= 1000) return Math.floor(num / 1000) + 'k';
    return num;
}

function formatDate(dateStr) {
    return dateStr.replace('T', ' ').split('.')[0];
}

async function loadPost() {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/posts/${postId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('게시글 로드 실패', data);
            return;
        }

        const post = data.data;

        postTitle.textContent = post.isBlind ? '숨김 처리된 게시글' : post.title;
        postAuthorName.textContent = post.writerNickname;
        postDate.textContent = formatDate(post.createdAt);
        postContent.textContent = post.content;

        if (post.imageUrl) {
            postImage.src = post.imageUrl;
        } else {
            postImage.style.display = 'none';
        }

        if (post.isMine) {
            postActions.style.display = 'flex';
        } else {
            postActions.style.display = 'none';
        }

        isLiked = post.isLikedByMe;
        currentLikeCount = post.likeCount;
        updateLikeUI();

        viewCount.textContent = formatCount(post.viewCount);
        commentCount.textContent = formatCount(post.comments.length);

        commentList.innerHTML = '';
        post.comments.forEach(comment => {
            commentList.appendChild(createCommentItem(comment));
        });

    } catch (err) {
        console.error('게시글 로드 실패', err);
    }
}

function updateLikeUI() {
    likeCount.textContent = formatCount(currentLikeCount);
    if (isLiked) {
        likeBtn.style.backgroundColor = '#ACA0EB';
        likeCount.style.color = '#7F6AEE';
    } else {
        likeBtn.style.backgroundColor = '#fff';
        likeCount.style.color = '#222';
    }
}

likeBtn.addEventListener('click', async () => {
    try {
        if (isLiked) {
            const response = await fetch(`${BASE_URL}/api/v1/posts/${postId}/likes`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
            });
            const data = await response.json();
            if (response.ok) {
                isLiked = false;
                currentLikeCount = data.data.likeCount;
                updateLikeUI();
            }
        } else {
            const response = await fetch(`${BASE_URL}/api/v1/posts/${postId}/likes`, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
            });
            const data = await response.json();
            if (response.ok) {
                isLiked = true;
                currentLikeCount = data.data.likeCount;
                updateLikeUI();
            }
        }
    } catch (err) {
        console.error('좋아요 실패', err);
    }
});

editPostBtn.addEventListener('click', () => {
    window.location.href = `/post-edit/?postId=${postId}`;
});

deletePostBtn.addEventListener('click', () => {
    postDeleteModal.classList.add('show');
    document.body.classList.add('modal-open');
});

postDeleteCancelBtn.addEventListener('click', () => {
    postDeleteModal.classList.remove('show');
    document.body.classList.remove('modal-open');
});

postDeleteConfirmBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/posts/${postId}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
        });

        if (response.ok) {
            window.location.href = '/posts';
        }
    } catch (err) {
        console.error('게시글 삭제 실패', err);
    } finally {
        postDeleteModal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }
});

commentInput.addEventListener('input', () => {
    if (commentInput.value.trim()) {
        commentSubmitBtn.classList.add('active');
    } else {
        commentSubmitBtn.classList.remove('active');
    }
});

commentSubmitBtn.addEventListener('click', async () => {
    const content = commentInput.value.trim();
    if (!content) return;

    try {
        if (editingCommentId) {
            const response = await fetch(`${BASE_URL}/api/v1/posts/${postId}/comments/${editingCommentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                editingCommentId = null;
                commentSubmitBtn.textContent = '댓글 등록';
                commentInput.value = '';
                commentSubmitBtn.classList.remove('active');
                loadPost();
            }
        } else {
            const response = await fetch(`${BASE_URL}/api/v1/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                commentInput.value = '';
                commentSubmitBtn.classList.remove('active');
                loadPost();
            }
        }
    } catch (err) {
        console.error('댓글 등록/수정 실패', err);
    }
});

function createCommentItem(comment) {
    const item = document.createElement('div');
    item.className = 'comment-item';

    const header = document.createElement('div');
    header.className = 'comment-header';

    const authorWrap = document.createElement('div');
    authorWrap.className = 'comment-author';

    const img = document.createElement('img');
    img.className = 'comment-author-img';
    img.src = DEFAULT_IMAGE;
    img.alt = '작성자';

    const name = document.createElement('span');
    name.className = 'comment-author-name';
    name.textContent = comment.writerNickname;

    const date = document.createElement('span');
    date.className = 'comment-date';
    date.textContent = formatDate(comment.createdAt);

    authorWrap.appendChild(img);
    authorWrap.appendChild(name);
    authorWrap.appendChild(date);

    if (comment.isMine) {
        const actions = document.createElement('div');
        actions.className = 'comment-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-comment-action';
        editBtn.textContent = '수정';
        editBtn.addEventListener('click', () => {
            commentInput.value = comment.content;
            commentSubmitBtn.textContent = '댓글 수정';
            commentSubmitBtn.classList.add('active');
            editingCommentId = comment.commentId;
            commentInput.focus();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-comment-action';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => {
            deletingCommentId = comment.commentId;
            commentDeleteModal.classList.add('show');
            document.body.classList.add('modal-open');
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        header.appendChild(authorWrap);
        header.appendChild(actions);
    } else {
        header.appendChild(authorWrap);
    }

    const content = document.createElement('p');
    content.className = 'comment-content';
    content.textContent = comment.content;

    item.appendChild(header);
    item.appendChild(content);

    return item;
}

commentDeleteCancelBtn.addEventListener('click', () => {
    commentDeleteModal.classList.remove('show');
    document.body.classList.remove('modal-open');
    deletingCommentId = null;
});

commentDeleteConfirmBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/posts/${postId}/comments/${deletingCommentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') }
        });

        if (response.ok) {
            loadPost();
        }
    } catch (err) {
        console.error('댓글 삭제 실패', err);
    } finally {
        commentDeleteModal.classList.remove('show');
        document.body.classList.remove('modal-open');
        deletingCommentId = null;
    }
});