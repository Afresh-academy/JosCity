import React from "react";
import { Menu, X, SquarePlus, UserPlus, MessageCircle, Bell } from "lucide-react";
import LazyImage from "./LazyImage";
import primaryLogo from "../image/primary-logo.png";
import headerAvatar from "../image/newsfeed/blessing.jpg";

interface NewsFeedHeaderProps {
  isLeftSidebarOpen: boolean;
  onToggleLeftSidebar: () => void;
  showCreateMenu?: boolean;
  showRightSidebarToggle?: boolean;
  onRightSidebarToggle?: () => void;
  unreadNotificationsCount?: number;
  onNotificationClick?: () => void;
  onAddFriendClick?: () => void;
  onMessageClick?: () => void;
  onCreateClick?: () => void;
}

const NewsFeedHeader: React.FC<NewsFeedHeaderProps> = ({
  isLeftSidebarOpen,
  onToggleLeftSidebar,
  showCreateMenu = false,
  showRightSidebarToggle = false,
  onRightSidebarToggle,
  unreadNotificationsCount = 0,
  onNotificationClick,
  onAddFriendClick,
  onMessageClick,
  onCreateClick,
}) => {
  return (
    <header className="newsfeed-header">
      <div className="newsfeed-header__container">
        <div className="newsfeed-header__left">
          <button
            className="newsfeed-header__menu-toggle"
            onClick={onToggleLeftSidebar}
            aria-label="Toggle menu"
          >
            {isLeftSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="newsfeed-header__logo">
            <LazyImage src={primaryLogo} alt="JOSCity Logo" />
            <span>JOSCity</span>
          </div>
        </div>
        <div className="newsfeed-header__actions">
          <button
            className="newsfeed-header__icon-btn"
            title="Create"
            onClick={onCreateClick}
          >
            <SquarePlus size={20} />
          </button>
          <button
            className="newsfeed-header__icon-btn"
            title="Add Friend"
            onClick={onAddFriendClick}
          >
            <UserPlus size={20} />
          </button>
          <button
            className="newsfeed-header__icon-btn"
            title="Messages"
            onClick={onMessageClick}
          >
            <MessageCircle size={20} />
          </button>
          <button
            className="newsfeed-header__icon-btn newsfeed-header__icon-btn--notifications"
            title="Notifications"
            onClick={onNotificationClick}
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="newsfeed-header__badge">
                {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
              </span>
            )}
          </button>
          <button className="newsfeed-header__join-btn">
            <LazyImage
              src={headerAvatar}
              alt="Join"
              className="newsfeed-header__join-avatar"
            />
            <span className="newsfeed-header__join-text">Join</span>
          </button>
          {showRightSidebarToggle && onRightSidebarToggle && (
            <button
              className="newsfeed-header__sidebar-toggle"
              onClick={onRightSidebarToggle}
              aria-label="Toggle sidebar"
              title="Trending & Friends"
            >
              {/* TrendingUp icon would be imported if needed */}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NewsFeedHeader;

