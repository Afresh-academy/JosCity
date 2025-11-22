import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Eye, Star, Share2, Bookmark } from 'lucide-react';

interface Comment {
  id: number;
  userName: string;
  userAvatar: string;
  text: string;
  timeAgo: string;
}

interface Post {
  id: number;
  userName: string;
  userAvatar: string;
  action: string;
  timeAgo: string;
  image: string;
  likes: number;
  comments: number;
  views: number;
  reviews: number;
  hashtags?: string;
  caption?: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const MAX_CAPTION_LENGTH = 150; // Characters to show before "See more"
  
  const shouldTruncate = post.caption && post.caption.length > MAX_CAPTION_LENGTH;
  const displayCaption = shouldTruncate && !isExpanded
    ? post.caption.substring(0, MAX_CAPTION_LENGTH) + '...'
    : post.caption;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        userName: 'You', // This would come from auth context
        userAvatar: post.userAvatar, // This would come from auth context
        text: newComment,
        timeAgo: 'Just now',
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: `${post.userName}'s post`,
        text: post.caption || '',
        url: window.location.href,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <article className="newsfeed-post">
      <div className="newsfeed-post__header">
        <div className="newsfeed-post__user-info">
          <img
            src={post.userAvatar || '/placeholder-avatar.png'}
            alt={post.userName}
            className="newsfeed-post__avatar"
          />
          <div className="newsfeed-post__user-details">
            <h3 className="newsfeed-post__user-name">{post.userName}</h3>
            <p className="newsfeed-post__action">{post.action}</p>
            <span className="newsfeed-post__time">{post.timeAgo}</span>
          </div>
        </div>
      </div>

      {post.caption && (
        <div className="newsfeed-post__caption">
          <p>
            {displayCaption}
            {shouldTruncate && (
              <button
                className="newsfeed-post__see-more"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? ' See less' : ' See more'}
              </button>
            )}
          </p>
        </div>
      )}

      {post.image && (
        <div className="newsfeed-post__image-wrapper">
          <img
            src={post.image}
            alt={post.action || post.caption}
            className="newsfeed-post__image"
          />
        </div>
      )}

      {post.hashtags && (
        <div className="newsfeed-post__hashtags">
          <p>{post.hashtags}</p>
        </div>
      )}

      <div className="newsfeed-post__interactions">
        <div className="newsfeed-post__stats-row">
          <div className="newsfeed-post__stat">
            <MessageCircle size={16} />
            <span>{post.comments + comments.length} Comments</span>
          </div>
          <div className="newsfeed-post__stat">
            <Eye size={16} />
            <span>{post.views} Views</span>
          </div>
          <div className="newsfeed-post__stat">
            <Star size={16} />
            <span>{post.reviews} Reviews</span>
          </div>
        </div>
        <div className="newsfeed-post__likes-row">
          <div className="newsfeed-post__likes">
            <ThumbsUp size={18} />
            <span>{likeCount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="newsfeed-post__action-buttons">
          <button
            className={`newsfeed-post__action-btn ${isLiked ? 'newsfeed-post__action-btn--active' : ''}`}
            onClick={handleLike}
            title="Like"
          >
            <ThumbsUp size={20} />
            <span>Like</span>
          </button>
          <button
            className="newsfeed-post__action-btn"
            onClick={handleCommentClick}
            title="Comment"
          >
            <MessageCircle size={20} />
            <span>Comment</span>
          </button>
          <button
            className="newsfeed-post__action-btn"
            onClick={handleShare}
            title="Share"
          >
            <Share2 size={20} />
            <span>Share</span>
          </button>
          <button
            className={`newsfeed-post__action-btn newsfeed-post__action-btn--save ${isSaved ? 'newsfeed-post__action-btn--active' : ''}`}
            onClick={handleSave}
            title="Save"
          >
            <Bookmark size={20} />
            <span>Save</span>
          </button>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="newsfeed-post__comments">
            <div className="newsfeed-post__comments-list">
              {comments.length === 0 ? (
                <p className="newsfeed-post__no-comments">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="newsfeed-post__comment">
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="newsfeed-post__comment-avatar"
                    />
                    <div className="newsfeed-post__comment-content">
                      <div className="newsfeed-post__comment-header">
                        <span className="newsfeed-post__comment-name">{comment.userName}</span>
                        <span className="newsfeed-post__comment-time">{comment.timeAgo}</span>
                      </div>
                      <p className="newsfeed-post__comment-text">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form className="newsfeed-post__comment-form" onSubmit={handleAddComment}>
              <input
                type="text"
                className="newsfeed-post__comment-input"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className="newsfeed-post__comment-submit"
                disabled={!newComment.trim()}
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;

