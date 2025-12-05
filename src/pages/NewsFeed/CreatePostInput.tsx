import React, { useState } from "react";
import { Image, Video, Mic } from "lucide-react";
import primaryLogo from "../../image/primary-logo.png";
import CreatePostModal from "./CreatePostModal";
import LazyImage from "../../components/LazyImage";

interface CreatePostInputProps {
  userName: string;
  userAvatar?: string;
}

const CreatePostInput: React.FC<CreatePostInputProps> = ({
  userName,
  userAvatar,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleVideoClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="newsfeed-create-post">
        <div className="newsfeed-create-post__avatar">
          <LazyImage src={userAvatar || primaryLogo} alt={userName} />
        </div>
        <div className="newsfeed-create-post__input-wrapper">
          <input
            type="text"
            className="newsfeed-create-post__input"
            placeholder={`What is on your mind, ${userName}? #hashtag @mention.link`}
            onClick={() => setIsModalOpen(true)}
            readOnly
          />
        </div>
        <div className="newsfeed-create-post__actions">
          <button
            className="newsfeed-create-post__action-btn"
            onClick={handleImageClick}
            title="Add Photo"
          >
            <Image size={20} />
          </button>
          <button
            className="newsfeed-create-post__action-btn"
            onClick={handleVideoClick}
            title="Add Video"
          >
            <Video size={20} />
          </button>
          <button
            className="newsfeed-create-post__action-btn"
            onClick={() => setIsModalOpen(true)}
            title="Add Audio"
          >
            <Mic size={20} />
          </button>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userName={userName}
        userAvatar={userAvatar}
      />
    </>
  );
};

export default CreatePostInput;
