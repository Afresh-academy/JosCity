import React, { useState, useRef } from "react";
import { X, Image as ImageIcon, Video } from "lucide-react";
import LazyImage from "../../components/LazyImage";

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userAvatar?: string;
  storyType: "text" | "photo" | "video";
  onStory?: (type: "text" | "photo" | "video", content: string, caption?: string) => void;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen,
  onClose,
  userName,
  userAvatar,
  storyType,
  onStory,
}) => {
  const [textContent, setTextContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
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
    let content = "";
    
    if (storyType === "text") {
      if (!textContent.trim()) {
        return;
      }
      content = textContent;
    } else if (storyType === "photo") {
      if (!selectedImage) {
        return;
      }
      content = selectedImage;
    } else if (storyType === "video") {
      if (!selectedVideo) {
        return;
      }
      content = selectedVideo;
    }

    // Call the onStory callback if provided
    if (onStory) {
      onStory(storyType, content, caption.trim() || undefined);
    }

    // Reset form
    setTextContent("");
    setSelectedImage(null);
    setSelectedVideo(null);
    setCaption("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
    onClose();
  };

  const handleClose = () => {
    setTextContent("");
    setSelectedImage(null);
    setSelectedVideo(null);
    setCaption("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  const canPost = () => {
    if (storyType === "text") {
      return textContent.trim().length > 0;
    } else if (storyType === "photo") {
      return selectedImage !== null;
    } else if (storyType === "video") {
      return selectedVideo !== null;
    }
    return false;
  };

  return (
    <div className="newsfeed-modal-overlay" onClick={handleClose}>
      <div className="newsfeed-modal" onClick={(e) => e.stopPropagation()}>
        <div className="newsfeed-modal__header">
          <h2 className="newsfeed-modal__title">
            Create {storyType === "text" ? "Text" : storyType === "photo" ? "Photo" : "Video"} Story
          </h2>
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

          {storyType === "text" && (
            <div className="newsfeed-modal__caption-section">
              <textarea
                className="newsfeed-modal__caption"
                placeholder="What's on your mind?"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={8}
                style={{ fontSize: "18px", minHeight: "200px" }}
              />
            </div>
          )}

          {storyType === "photo" && (
            <>
              <div className="newsfeed-modal__caption-section">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                  id="story-image-upload"
                />
                <label
                  htmlFor="story-image-upload"
                  className="newsfeed-modal__action-btn"
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "16px" }}
                >
                  <ImageIcon size={20} />
                  <span>Select Photo</span>
                </label>
              </div>

              {selectedImage && (
                <div className="newsfeed-modal__image-preview">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    style={{ maxHeight: "400px", width: "100%", objectFit: "contain" }}
                    onError={() => {
                      alert("Error loading image preview. Please try selecting the image again.");
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

              <div className="newsfeed-modal__caption-section" style={{ marginTop: "16px" }}>
                <textarea
                  className="newsfeed-modal__caption"
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          {storyType === "video" && (
            <>
              <div className="newsfeed-modal__caption-section">
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/*"
                  onChange={handleVideoSelect}
                  style={{ display: "none" }}
                  id="story-video-upload"
                />
                <label
                  htmlFor="story-video-upload"
                  className="newsfeed-modal__action-btn"
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "16px" }}
                >
                  <Video size={20} />
                  <span>Select Video</span>
                </label>
              </div>

              {selectedVideo && (
                <div className="newsfeed-modal__image-preview">
                  <video
                    src={selectedVideo}
                    controls
                    style={{ width: "100%", maxHeight: "400px", borderRadius: "8px" }}
                    onError={() => {
                      alert("Error loading video preview. Please try selecting the video again.");
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

              <div className="newsfeed-modal__caption-section" style={{ marginTop: "16px" }}>
                <textarea
                  className="newsfeed-modal__caption"
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        <div className="newsfeed-modal__footer">
          <button className="newsfeed-modal__cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="newsfeed-modal__post-btn"
            onClick={handlePost}
            disabled={!canPost()}
          >
            Share Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;

