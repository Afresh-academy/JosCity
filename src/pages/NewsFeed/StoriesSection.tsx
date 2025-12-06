import React, { useState, useRef, useEffect } from "react";
import { Plus, Type, Image, Video, X } from "lucide-react";
import LazyImage from "../../components/LazyImage";
import CreateStoryModal from "./CreateStoryModal";

interface Story {
  id: number;
  userName: string;
  avatar: string;
  hasNewStory?: boolean;
  type?: "text" | "photo" | "video";
  content?: string;
  caption?: string;
}

interface StoriesSectionProps {
  stories: Story[];
  userName?: string;
  userAvatar?: string;
  onStory?: (type: "text" | "photo" | "video", content: string, caption?: string) => void;
}

const StoriesSection: React.FC<StoriesSectionProps> = ({ 
  stories, 
  userName = "You",
  userAvatar,
  onStory 
}) => {
  const [isStoryTypePanelOpen, setIsStoryTypePanelOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [selectedStoryType, setSelectedStoryType] = useState<"text" | "photo" | "video">("text");
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAddStoryClick = () => {
    setIsStoryTypePanelOpen(true);
  };

  const handleStoryTypeSelect = (type: "text" | "photo" | "video") => {
    setIsStoryTypePanelOpen(false);
    setSelectedStoryType(type);
    setIsStoryModalOpen(true);
  };

  const handleStoryCreated = (type: "text" | "photo" | "video", content: string, caption?: string) => {
    if (onStory) {
      onStory(type, content, caption);
    }
    setIsStoryModalOpen(false);
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsStoryTypePanelOpen(false);
      }
    };

    if (isStoryTypePanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStoryTypePanelOpen]);

  return (
    <div className="newsfeed-stories">
      <div className="newsfeed-stories__container">
        {stories.map((story, index) => (
          <div key={story.id} className="newsfeed-stories__item">
            {index === 0 && story.hasNewStory && (
              <button
                ref={buttonRef}
                className="newsfeed-stories__add-icon"
                onClick={handleAddStoryClick}
                aria-label="Add story"
                title="Add story"
              >
                <Plus size={16} />
              </button>
            )}
            <div className="newsfeed-stories__avatar-wrapper">
              <LazyImage
                src={story.avatar || "/placeholder-avatar.png"}
                alt={story.userName}
                className="newsfeed-stories__avatar"
              />
            </div>
            <p className="newsfeed-stories__name">{story.userName}</p>
          </div>
        ))}
      </div>

      {/* Story Type Selection Panel */}
      {isStoryTypePanelOpen && (
        <div
          className="newsfeed-story-type-panel-overlay"
          onClick={() => setIsStoryTypePanelOpen(false)}
        >
          <div
            ref={panelRef}
            className="newsfeed-story-type-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="newsfeed-story-type-panel__header">
              <h3>Create Story</h3>
              <button
                className="newsfeed-story-type-panel__close"
                onClick={() => setIsStoryTypePanelOpen(false)}
                aria-label="Close panel"
              >
                <X size={20} />
              </button>
            </div>
            <div className="newsfeed-story-type-panel__content">
              <button
                className="newsfeed-story-type-panel__option"
                onClick={() => handleStoryTypeSelect("text")}
              >
                <div className="newsfeed-story-type-panel__icon newsfeed-story-type-panel__icon--text">
                  <Type size={24} />
                </div>
                <div className="newsfeed-story-type-panel__option-content">
                  <h4>Text Story</h4>
                  <p>Share your thoughts with text</p>
                </div>
              </button>
              <button
                className="newsfeed-story-type-panel__option"
                onClick={() => handleStoryTypeSelect("photo")}
              >
                <div className="newsfeed-story-type-panel__icon newsfeed-story-type-panel__icon--photo">
                  <Image size={24} />
                </div>
                <div className="newsfeed-story-type-panel__option-content">
                  <h4>Photo Story</h4>
                  <p>Share a photo from your device</p>
                </div>
              </button>
              <button
                className="newsfeed-story-type-panel__option"
                onClick={() => handleStoryTypeSelect("video")}
              >
                <div className="newsfeed-story-type-panel__icon newsfeed-story-type-panel__icon--video">
                  <Video size={24} />
                </div>
                <div className="newsfeed-story-type-panel__option-content">
                  <h4>Video Story</h4>
                  <p>Share a video from your device</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Creation Modal */}
      <CreateStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        userName={userName}
        userAvatar={userAvatar}
        storyType={selectedStoryType}
        onStory={handleStoryCreated}
      />
    </div>
  );
};

export default StoriesSection;
