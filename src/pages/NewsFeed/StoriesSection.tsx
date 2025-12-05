import React, { useState, useRef, useEffect } from "react";
import { Plus, Type, Image, Video, X } from "lucide-react";
import LazyImage from "../../components/LazyImage";

interface Story {
  id: number;
  userName: string;
  avatar: string;
  hasNewStory?: boolean;
}

interface StoriesSectionProps {
  stories: Story[];
}

const StoriesSection: React.FC<StoriesSectionProps> = ({ stories }) => {
  const [isStoryTypePanelOpen, setIsStoryTypePanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAddStoryClick = () => {
    setIsStoryTypePanelOpen(true);
  };

  const handleStoryTypeSelect = (type: "text" | "photo" | "video") => {
    setIsStoryTypePanelOpen(false);
    // Handle story creation based on type
    console.log(`Creating ${type} story`);
    // You can add logic here to open the appropriate story creation modal/form
    switch (type) {
      case "text":
        // Open text story creation
        break;
      case "photo":
        // Open photo story creation
        break;
      case "video":
        // Open video story creation
        break;
    }
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
    </div>
  );
};

export default StoriesSection;
