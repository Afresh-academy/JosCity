import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Video, Mic } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userAvatar?: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  userName,
  userAvatar,
}) => {
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    // Handle post submission here
    console.log('Posting:', { caption, image: selectedImage });
    // Reset form
    setCaption('');
    setSelectedImage(null);
    onClose();
  };

  const handleClose = () => {
    setCaption('');
    setSelectedImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="newsfeed-modal-overlay" onClick={handleClose}>
      <div className="newsfeed-modal" onClick={(e) => e.stopPropagation()}>
        <div className="newsfeed-modal__header">
          <h2 className="newsfeed-modal__title">Create Post</h2>
          <button className="newsfeed-modal__close" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <div className="newsfeed-modal__content">
          <div className="newsfeed-modal__user-info">
            <img
              src={userAvatar || '/placeholder-avatar.png'}
              alt={userName}
              className="newsfeed-modal__avatar"
            />
            <span className="newsfeed-modal__user-name">{userName}</span>
          </div>

          <div className="newsfeed-modal__caption-section">
            <textarea
              className="newsfeed-modal__caption"
              placeholder={`What's on your mind, ${userName}?`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
            />
          </div>

          {selectedImage && (
            <div className="newsfeed-modal__image-preview">
              <img src={selectedImage} alt="Preview" />
              <button
                className="newsfeed-modal__remove-image"
                onClick={() => {
                  setSelectedImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                <X size={20} />
              </button>
            </div>
          )}

          <div className="newsfeed-modal__actions">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload" className="newsfeed-modal__action-btn">
              <ImageIcon size={20} />
              <span>Photo</span>
            </label>
            <button className="newsfeed-modal__action-btn" disabled>
              <Video size={20} />
              <span>Video</span>
            </button>
            <button className="newsfeed-modal__action-btn" disabled>
              <Mic size={20} />
              <span>Audio</span>
            </button>
          </div>
        </div>

        <div className="newsfeed-modal__footer">
          <button className="newsfeed-modal__cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="newsfeed-modal__post-btn"
            onClick={handlePost}
            disabled={!caption.trim() && !selectedImage}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
