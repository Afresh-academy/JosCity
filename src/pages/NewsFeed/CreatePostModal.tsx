import React, { useState, useRef } from "react";
import { X, Image as ImageIcon, Video, Mic } from "lucide-react";
import LazyImage from "../../components/LazyImage";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userAvatar?: string;
  onPost?: (caption: string, image: string | null, video: string | null) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  userName,
  userAvatar,
  onPost,
}) => {
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Validate file size (max 10MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE) {
        alert("Image size must be less than 10MB");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Clear video if image is selected
      setSelectedVideo(null);
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.onerror = () => {
        alert("Error reading file. Please try again.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("video/")) {
        alert("Please select a video file");
        if (videoInputRef.current) {
          videoInputRef.current.value = "";
        }
        return;
      }

      // Validate file size (max 50MB)
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
      if (file.size > MAX_FILE_SIZE) {
        alert("Video size must be less than 50MB");
        if (videoInputRef.current) {
          videoInputRef.current.value = "";
        }
        return;
      }

      // Clear image if video is selected
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedVideo(reader.result as string);
      };
      reader.onerror = () => {
        alert("Error reading file. Please try again.");
        if (videoInputRef.current) {
          videoInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!caption.trim() && !selectedImage && !selectedVideo) {
      return;
    }

    // Call the onPost callback if provided
    if (onPost) {
      onPost(caption, selectedImage, selectedVideo);
    }

    // Reset form
    setCaption("");
    setSelectedImage(null);
    setSelectedVideo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
    onClose();
  };

  const handleClose = () => {
    setCaption("");
    setSelectedImage(null);
    setSelectedVideo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
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
            <LazyImage
              src={userAvatar || "/placeholder-avatar.png"}
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
              <img
                src={selectedImage}
                alt="Preview"
                onError={() => {
                  alert(
                    "Error loading image preview. Please try selecting the image again."
                  );
                  setSelectedImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              />
              <button
                className="newsfeed-modal__remove-image"
                onClick={() => {
                  setSelectedImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                aria-label="Remove image"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {selectedVideo && (
            <div className="newsfeed-modal__image-preview">
              <video
                src={selectedVideo}
                controls
                style={{ width: "100%", maxHeight: "400px", borderRadius: "8px" }}
                onError={() => {
                  alert(
                    "Error loading video preview. Please try selecting the video again."
                  );
                  setSelectedVideo(null);
                  if (videoInputRef.current) {
                    videoInputRef.current.value = "";
                  }
                }}
              />
              <button
                className="newsfeed-modal__remove-image"
                onClick={() => {
                  setSelectedVideo(null);
                  if (videoInputRef.current) {
                    videoInputRef.current.value = "";
                  }
                }}
                aria-label="Remove video"
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
              style={{ display: "none" }}
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="newsfeed-modal__action-btn"
            >
              <ImageIcon size={20} />
              <span>Photo</span>
            </label>
            <input
              type="file"
              ref={videoInputRef}
              accept="video/*"
              onChange={handleVideoSelect}
              style={{ display: "none" }}
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="newsfeed-modal__action-btn"
            >
              <Video size={20} />
              <span>Video</span>
            </label>
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
            disabled={!caption.trim() && !selectedImage && !selectedVideo}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
