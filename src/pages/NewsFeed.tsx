import React, { useState } from "react";
import {
  SquarePlus,
  UserPlus,
  MessageCircle,
  Bell,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";
import NewsFeedSidebar from "../components/NewsFeed/NewsFeedSidebar";
import StoriesSection from "../components/NewsFeed/StoriesSection";
import CreatePostInput from "../components/NewsFeed/CreatePostInput";
import PostCard from "../components/NewsFeed/PostCard";
import TrendingSection from "../components/NewsFeed/TrendingSection";
import SuggestedFriends from "../components/NewsFeed/SuggestedFriends";
import primaryLogo from "../image/primary-logo.png";
// Using one of the existing avatars as placeholder for header icons
import headerAvatar from "../image/newsfeed/blessing.jpg";
// Post Images
import postBlessing from "../image/newsfeed/blessing.jpg";
import postJoseph from "../image/newsfeed/joseph.png";
// Avatar Images - using post images as avatars for now
import avatarBlessing from "../image/newsfeed/blessing.jpg";
import avatarJoseph from "../image/newsfeed/joseph.png";
import avatarDavidGabriel from "../image/newsfeed/David.jpg";
import avatarJoy from "../image/newsfeed/tiana.jpg";
import avatarOla from "../image/newsfeed/chisty.jpg";
import avatarDavidMathias from "../image/newsfeed/will.jpg";
// Story Images
import story1 from "../image/newsfeed/chisty.jpg";
import story2 from "../image/newsfeed/will.jpg";
import story3 from "../image/newsfeed/e5f8b4388d3deb306d42aea5d2375206896e93e7.png";
import story4 from "../image/newsfeed/tiana.jpg";
import "../main.css";
import LazyImage from "../components/LazyImage";

const NewsFeed: React.FC = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  // Mock data - will be replaced with real data later
  const posts = [
    {
      id: 1,
      userName: "Blessing Matthias",
      userAvatar: avatarBlessing,
      action: "updated the profile picture",
      timeAgo: "6 days ago",
      image: postBlessing,
      likes: 5,
      comments: 0,
      views: 84,
      reviews: 0,
      caption:
        "Just updated my profile picture! Feeling great and ready for new opportunities. This year is going to be amazing. Grateful for all the support from my friends and family. Let's make it count! 🎉✨",
    },
    {
      id: 2,
      userName: "Joseph Azumara",
      userAvatar: avatarJoseph,
      action: "updated the profile picture",
      timeAgo: "5 days ago",
      image: postJoseph,
      likes: 3,
      comments: 0,
      views: 60,
      reviews: 0,
      caption:
        "New profile picture! Excited about the journey ahead. This has been an incredible year of growth and learning. I'm grateful for all the opportunities that have come my way and the amazing people I've met along the way. Looking forward to what the future holds! 🌟",
    },
    {
      id: 3,
      userName: "David Gabriel",
      userAvatar: avatarDavidGabriel,
      action: "",
      timeAgo: "6 days ago",
      image: "",
      likes: 1,
      comments: 0,
      views: 84,
      reviews: 0,
      hashtags: "#AfrESH #C-BRILLIANCE",
      caption:
        "Great day at the conference! Met so many amazing people and learned a lot. The future of technology is bright. Can't wait to share what I've learned with the team. Innovation never stops! 🚀",
    },
  ];

  const stories = [
    {
      id: 1,
      userName: "Ola Wale",
      avatar: story1,
      hasNewStory: true,
    },
    {
      id: 2,
      userName: "William",
      avatar: story2,
      hasNewStory: false,
    },
    {
      id: 3,
      userName: "David Gabriel",
      avatar: story3,
      hasNewStory: false,
    },
    {
      id: 4,
      userName: "Joy James",
      avatar: story4,
      hasNewStory: false,
    },
  ];

  const trending = [
    { hashtag: "#AfrESH", posts: 1 },
    { hashtag: "#C", posts: 1 },
  ];

  const suggestedFriends = [
    {
      id: 1,
      name: "Blessing Matthias",
      avatar: avatarBlessing,
      mutualFriends: 1,
    },
    {
      id: 2,
      name: "Joseph Azumara",
      avatar: avatarJoseph,
      mutualFriends: 0,
    },
    {
      id: 3,
      name: "William",
      avatar: avatarDavidMathias,
      mutualFriends: 3,
    },
    {
      id: 4,
      name: "Ola Wale",
      avatar: avatarOla,
      mutualFriends: 1,
    },
    {
      id: 5,
      name: "Joy James",
      avatar: avatarJoy,
      mutualFriends: 5,
    },
  ];

  return (
    <div className="newsfeed-page">
      {/* Top Navigation Bar */}
      <header className="newsfeed-header">
        <div className="newsfeed-header__container">
          <div className="newsfeed-header__left">
            <button
              className="newsfeed-header__menu-toggle"
              onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
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
            <button className="newsfeed-header__icon-btn" title="Create">
              <SquarePlus size={20} />
            </button>
            <button className="newsfeed-header__icon-btn" title="Add Friend">
              <UserPlus size={20} />
            </button>
            <button className="newsfeed-header__icon-btn" title="Messages">
              <MessageCircle size={20} />
            </button>
            <button
              className="newsfeed-header__icon-btn newsfeed-header__icon-btn--notifications"
              title="Notifications"
            >
              <Bell size={20} />
            </button>
            <button className="newsfeed-header__join-btn">
              <LazyImage
                src={headerAvatar}
                alt="Join"
                className="newsfeed-header__join-avatar"
              />
              <span className="newsfeed-header__join-text">Join</span>
            </button>
            <button
              className="newsfeed-header__sidebar-toggle"
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              aria-label="Toggle sidebar"
              title="Trending & Friends"
            >
              <TrendingUp size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="newsfeed-container">
        {/* Mobile Overlay */}
        {(isLeftSidebarOpen || isRightSidebarOpen) && (
          <div
            className="newsfeed-overlay"
            onClick={() => {
              setIsLeftSidebarOpen(false);
              setIsRightSidebarOpen(false);
            }}
          />
        )}

        {/* Left Sidebar */}
        <NewsFeedSidebar
          isOpen={isLeftSidebarOpen}
          onClose={() => setIsLeftSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="newsfeed-main">
          {/* Search Section */}
          <div className="newsfeed-search-section">
            <div className="newsfeed-search-section__input-wrapper">
              <input
                type="text"
                placeholder="Search"
                className="newsfeed-search-section__input"
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="newsfeed-search-section__icon"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>
          <StoriesSection stories={stories} />
          <CreatePostInput userName="Olamilekan" />

          {/* Good Morning Card */}
          <div className="newsfeed-goodmorning-card">
            <div className="newsfeed-goodmorning-card__icon">☀️</div>
            <div className="newsfeed-goodmorning-card__content">
              <p>
                Good morning, Olamilekan write it on your heart that every day
                is the best day in the year
              </p>
            </div>
            <button className="newsfeed-goodmorning-card__close">×</button>
          </div>

          {/* Posts */}
          <div className="newsfeed-posts">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside
          className={`newsfeed-aside ${
            isRightSidebarOpen ? "newsfeed-aside--open" : ""
          }`}
        >
          <div className="newsfeed-aside__header">
            <h3>Trending & Friends</h3>
            <button
              className="newsfeed-aside__close"
              onClick={() => setIsRightSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
          <TrendingSection trending={trending} />
          <SuggestedFriends friends={suggestedFriends} />

          {/* Footer */}
          <footer className="newsfeed-aside__footer">
            <p>© 2025 JOSCity</p>
            <div className="newsfeed-aside__footer-links">
              <a href="#about">About</a>
              <a href="#terms">Terms</a>
              <a href="#privacy">Privacy</a>
              <a href="#contact">Contact Us</a>
              <a href="#directory">Directory</a>
            </div>
          </footer>
        </aside>
      </div>
    </div>
  );
};

export default NewsFeed;
