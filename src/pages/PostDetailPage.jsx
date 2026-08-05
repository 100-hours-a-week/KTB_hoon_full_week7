import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api";
import { formatCount, formatDate } from "../utils/format";
import ProfileHeader from "../components/ProfileHeader";
import PostHeader from "../components/PostHeader";
import PostImage from "../components/PostImage";
import PostBody from "../components/PostBody";
import PostStats from "../components/PostStats";
import PostDeleteModal from "../components/PostDeleteModal";
import ReportModal from "../components/ReportModal";
import CommentSection from "../components/CommentSection";
import Toast from "../components/Toast";

const REPORT_ERROR_MAP = {
  REPORT_TARGET_REQUIRED: "신고 대상이 올바르지 않습니다.",
  REPORT_REASON_REQUIRED: "신고 사유를 선택해주세요.",
  SELF_REPORT_NOT_ALLOWED: "자신이 작성한 글은 신고할 수 없습니다.",
  INVALID_ENUM_VALUE: "올바르지 않은 신고 사유입니다.",
  POST_NOT_FOUND: "모집글을 찾을 수 없습니다.",
  COMMENT_NOT_FOUND: "댓글을 찾을 수 없습니다.",
  ALREADY_REPORTED: "이미 신고했습니다.",
};

export default function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [postDeleteModalOpen, setPostDeleteModalOpen] = useState(false);
  // 신고 대상: { type: "POST"|"COMMENT", id } 이거나, 닫혀 있으면 null
  const [reportTarget, setReportTarget] = useState(null);
  const [reportError, setReportError] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loadError, setLoadError] = useState(false);

  function showToast(message) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2000);
  }

  async function loadPost() {
    try {
      const response = await apiFetch(`/posts/${postId}`);
      const data = await response.json();

      if (!response.ok) {
        setLoadError(true);
        return;
      }

      const loaded = data.data;
      setPost(loaded);
      // 좋아요 상태는 서버 응답을 단일 출처로 삼는다.
      setIsLiked(loaded.isLikedByMe);
      setCurrentLikeCount(loaded.likeCount);
      setLoadError(false);
    } catch (err) {
      console.error("게시글 로드 실패", err);
      setLoadError(true);
    }
  }

  // 게시글 로드 (postId 바뀌면 다시)
  useEffect(() => {
    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  async function handleLikeToggle() {
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    try {
      const response = await apiFetch(`/posts/${postId}/likes`, {
        method: isLiked ? "DELETE" : "POST",
      });
      const data = await response.json();
      if (response.ok) {
        setIsLiked(data.data.isLikedByMe);
        setCurrentLikeCount(data.data.likeCount);
      }
    } catch (err) {
      console.error("좋아요 실패", err);
    } finally {
      setIsLikeLoading(false);
    }
  }

  async function handleDeletePost() {
    try {
      const response = await apiFetch(`/posts/${postId}`, { method: "DELETE" });
      if (response.ok) navigate("/posts");
    } catch (err) {
      console.error("게시글 삭제 실패", err);
    } finally {
      setPostDeleteModalOpen(false);
    }
  }

  function openReport(target) {
    setReportError("");
    setReportTarget(target);
  }

  // 신고 접수: POST /report (게시글/댓글 공용, reportTarget으로 대상 구분)
  async function handleReport(reason) {
    if (isReporting || !reportTarget) return;
    setIsReporting(true);
    setReportError("");
    try {
      const response = await apiFetch("/report", {
        method: "POST",
        body: JSON.stringify({
          targetId: reportTarget.id,
          targetType: reportTarget.type,
          reportReason: reason,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setReportError(REPORT_ERROR_MAP[data.code] || "신고에 실패했습니다.");
        return;
      }
      setReportTarget(null);
      showToast("신고가 접수되었습니다.");
    } catch (err) {
      console.error("신고 실패", err);
      setReportError("서버 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsReporting(false);
    }
  }

  return (
    <>
      <ProfileHeader onBack={() => navigate("/posts")} />
      <main className="detail-main">
        <div className="container">
          {loadError && (
            <p className="list-message">모집글을 불러오지 못했습니다.</p>
          )}

          {post && (
            <>
              <PostHeader
                title={post.isBlind ? "숨김 처리된 모집글" : post.title}
                writerNickname={post.writerNickname}
                date={formatDate(post.createdAt)}
                isMine={post.isMine}
                onEdit={() => navigate(`/post-edit?postId=${postId}`)}
                onDelete={() => setPostDeleteModalOpen(true)}
                onReport={() => openReport({ type: "POST", id: Number(postId) })}
              />

              {post.imageUrl && <PostImage imageUrl={post.imageUrl} />}

              <PostBody content={post.content} />

              <PostStats
                likeCount={formatCount(currentLikeCount)}
                isLiked={isLiked}
                isLikeLoading={isLikeLoading}
                onLikeClick={handleLikeToggle}
                viewCount={formatCount(post.viewCount)}
                commentCount={formatCount(post.comments.length)}
              />

              <hr className="divider" />

              <CommentSection
                postId={postId}
                comments={post.comments}
                onCommentsChanged={loadPost}
                onReportComment={(commentId) =>
                  openReport({ type: "COMMENT", id: commentId })
                }
              />
            </>
          )}
        </div>
      </main>

      <PostDeleteModal
        isOpen={postDeleteModalOpen}
        onCancel={() => setPostDeleteModalOpen(false)}
        onConfirm={handleDeletePost}
      />

      <ReportModal
        isOpen={reportTarget !== null}
        targetLabel={reportTarget?.type === "COMMENT" ? "댓글" : "모집글"}
        error={reportError}
        isSubmitting={isReporting}
        onCancel={() => setReportTarget(null)}
        onConfirm={handleReport}
      />

      <Toast message={toastMessage} />
    </>
  );
}
