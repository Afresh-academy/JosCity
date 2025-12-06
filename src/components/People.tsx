import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  SquarePlus,
  UserPlus,
  MessageCircle,
  Bell,
  Menu,
  X,
  Calendar,
  Bookmark,
  Briefcase,
  Users,
  Calendar as Events,
  Film,
  Newspaper,
  MessageSquare,
  Store,
  Tag,
  Briefcase as Jobs,
  Video,
  Search,
  AlertCircle,
  SlidersHorizontal,
  Smile,
} from "lucide-react";
import primaryLogo from "../image/primary-logo.png";
import headerAvatar from "../image/newsfeed/blessing.jpg";
import blessingImg from "../image/newsfeed/blessing.jpg";
import davidImg from "../image/newsfeed/David.jpg";
import chistyImg from "../image/newsfeed/chisty.jpg";
import tianaImg from "../image/newsfeed/tiana.jpg";
import willImg from "../image/newsfeed/will.jpg";
import josephImg from "../image/newsfeed/joseph.png";
import LazyImage from "./LazyImage";
import EmojiPicker from "./EmojiPicker";
import "../main.css";
import "../scss/_emojipicker.scss";

interface User {
  id: number;
  name: string;
  avatar: string;
  location?: string;
  mutualFriends?: number;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: 1,
    name: "Blessing Matthias",
    avatar: blessingImg,
    location: "Jos, Nigeria",
    mutualFriends: 5,
  },
  {
    id: 2,
    name: "David Gabriel",
    avatar: davidImg,
    location: "Abuja, Nigeria",
    mutualFriends: 3,
  },
  {
    id: 3,
    name: "Chisty Ola",
    avatar: chistyImg,
    location: "Lagos, Nigeria",
    mutualFriends: 8,
  },
  {
    id: 4,
    name: "Tiana James",
    avatar: tianaImg,
    location: "Kaduna, Nigeria",
    mutualFriends: 2,
  },
  {
    id: 5,
    name: "Will Smith",
    avatar: willImg,
    location: "Plateau, Nigeria",
    mutualFriends: 12,
  },
  {
    id: 6,
    name: "Joseph Azumara",
    avatar: josephImg,
    location: "Jos, Nigeria",
    mutualFriends: 7,
  },
  {
    id: 7,
    name: "Sarah Johnson",
    avatar: primaryLogo,
    location: "Abuja, Nigeria",
    mutualFriends: 4,
  },
  {
    id: 8,
    name: "Michael Brown",
    avatar: primaryLogo,
    location: "Lagos, Nigeria",
    mutualFriends: 6,
  },
  {
    id: 9,
    name: "Emily Davis",
    avatar: primaryLogo,
    location: "Kano, Nigeria",
    mutualFriends: 9,
  },
  {
    id: 10,
    name: "James Wilson",
    avatar: primaryLogo,
    location: "Port Harcourt, Nigeria",
    mutualFriends: 1,
  },
];

const People: React.FC = () => {
  const navigate = useNavigate();
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("find");
  const [distance, setDistance] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [isSearchEmojiPickerOpen, setIsSearchEmojiPickerOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [isFilterQueryEmojiPickerOpen, setIsFilterQueryEmojiPickerOpen] =
    useState(false);
  const [isFilterCityEmojiPickerOpen, setIsFilterCityEmojiPickerOpen] =
    useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterQueryInputRef = useRef<HTMLInputElement>(null);
  const filterCityInputRef = useRef<HTMLInputElement>(null);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    const query = searchQuery.toLowerCase().trim();
    return mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.location?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Show notification when no users are found
  useEffect(() => {
    if (searchQuery.trim() && filteredUsers.length === 0) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    } else {
      setShowNotification(false);
    }
  }, [searchQuery, filteredUsers.length]);

  return (
    <div className="people-page">
      {/* Notification Toast */}
      {showNotification && (
        <div className="people-notification">
          <div className="people-notification__content">
            <AlertCircle size={20} className="people-notification__icon" />
            <div className="people-notification__message">
              <strong>No users found</strong>
              <span>No users match your search "{searchQuery}"</span>
            </div>
            <button
              className="people-notification__close"
              onClick={() => setShowNotification(false)}
              aria-label="Close notification"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

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
            <button
              className="newsfeed-header__icon-btn newsfeed-header__icon-btn--filters"
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              title="Search Filters"
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={20} />
            </button>
            <button className="newsfeed-header__join-btn">
              <LazyImage
                src={headerAvatar}
                alt="Join"
                className="newsfeed-header__join-avatar"
              />
              <span className="newsfeed-header__join-text">Join</span>
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
        <aside
          className={`people-sidebar ${
            isLeftSidebarOpen ? "people-sidebar--open" : ""
          }`}
        >
          <div className="people-sidebar__header">
            <h3 className="people-sidebar__title">Menu</h3>
            {isLeftSidebarOpen && (
              <button
                className="people-sidebar__close"
                onClick={() => setIsLeftSidebarOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <nav className="people-sidebar__nav">
            <div className="people-sidebar__section">
              <a
                href="/newsfeed"
                className="people-sidebar__item"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/newsfeed");
                  setIsLeftSidebarOpen(false);
                }}
              >
                <Newspaper size={20} />
                <span>News Feed</span>
              </a>
              <a href="#" className="people-sidebar__item">
                <Calendar size={20} />
                <span>Scheduled</span>
              </a>
              <a href="#" className="people-sidebar__item">
                <Bookmark size={20} />
                <span>Saved</span>
              </a>
            </div>

            <div className="people-sidebar__section">
              <h3 className="people-sidebar__section-title">EXPLORE</h3>
              <a href="#" className="people-sidebar__item">
                <Briefcase size={20} />
                <span>Business</span>
              </a>
              <a
                href="#"
                className="people-sidebar__item people-sidebar__item--active"
              >
                <Users size={20} />
                <span>People</span>
              </a>
              <a href="#" className="people-sidebar__item">
                <Events size={20} />
                <span>Events</span>
              </a>
              <a href="#" className="people-sidebar__item">
                <Video size={20} />
                <span>Reels</span>
              </a>
              <a href="#" className="people-sidebar__item">
                <Newspaper size={20} />
                <span>News</span>
              </a>
              <a
                href="/forums"
                className="people-sidebar__item"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/forums");
                  setIsLeftSidebarOpen(false);
                }}
              >
                <MessageSquare size={20} />
                <span>Forums</span>
              </a>
              <a href="#" className="people-sidebar__item">
                <Store size={20} />
                <span>Marketplace</span>
              </a>
              <a href="#" className="people-sidebar__item">
                <Tag size={20} />
                <span>Offers</span>
              </a>
              <a href="#" className="people-sidebar__item">
                <Jobs size={20} />
                <span>Jobs</span>
              </a>
              <a href="#" className="people-sidebar__item">
                <Film size={20} />
                <span>Movies</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* Search Bar - Full Width */}
        <div className="newsfeed-search-section">
          <div
            className="newsfeed-search-section__input-wrapper"
            style={{ position: "relative" }}
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search people, hashtags, or posts..."
              className="newsfeed-search-section__input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingRight: "80px" }}
            />
            <div
              style={{
                position: "absolute",
                right: "40px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setIsSearchEmojiPickerOpen(!isSearchEmojiPickerOpen)
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Add emoji"
                title="Add emoji"
              >
                <Smile size={18} color="#666" />
              </button>
              {isSearchEmojiPickerOpen && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    right: 0,
                    marginBottom: "8px",
                    zIndex: 10001,
                  }}
                >
                  <EmojiPicker
                    isOpen={isSearchEmojiPickerOpen}
                    onClose={() => setIsSearchEmojiPickerOpen(false)}
                    onEmojiSelect={(emoji) => {
                      setSearchQuery((prev) => prev + emoji);
                      setIsSearchEmojiPickerOpen(false);
                      searchInputRef.current?.focus();
                    }}
                    position="top"
                  />
                </div>
              )}
            </div>
            <Search size={20} className="newsfeed-search-section__icon" />
          </div>
        </div>

        {/* Tabs - Full Width */}
        <div className="people-tabs">
          <button
            type="button"
            className={`people-tabs__tab ${
              activeTab === "find" ? "people-tabs__tab--active" : ""
            }`}
            onClick={() => setActiveTab("find")}
          >
            Find
          </button>
          <button
            type="button"
            className={`people-tabs__tab ${
              activeTab === "friend-requests" ? "people-tabs__tab--active" : ""
            }`}
            onClick={() => {
              setActiveTab("friend-requests");
              navigate("/request");
            }}
          >
            Friend Requests
          </button>
          <button
            type="button"
            className={`people-tabs__tab ${
              activeTab === "sent-requests" ? "people-tabs__tab--active" : ""
            }`}
            onClick={() => {
              console.log("Sent Requests button clicked");
              setActiveTab("sent-requests");
              navigate("/sent-requests");
            }}
          >
            Sent Requests
            <span className="people-tabs__badge">7</span>
          </button>
        </div>

        {/* Main Content Area */}
        <main className="people-main">
          {/* Search Results Section */}
          {searchQuery.trim() && (
            <div className="people-section">
              <h2 className="people-section__title">
                Search Results{" "}
                {filteredUsers.length > 0 && `(${filteredUsers.length})`}
              </h2>
              {filteredUsers.length > 0 ? (
                <div className="people-search-results">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="people-user-card">
                      <div className="people-user-card__avatar">
                        <LazyImage
                          src={user.avatar}
                          alt={user.name}
                          className="people-user-card__avatar-img"
                        />
                      </div>
                      <div className="people-user-card__info">
                        <h3 className="people-user-card__name">{user.name}</h3>
                        {user.location && (
                          <p className="people-user-card__location">
                            {user.location}
                          </p>
                        )}
                        {user.mutualFriends !== undefined && (
                          <p className="people-user-card__mutual">
                            {user.mutualFriends} mutual friend
                            {user.mutualFriends !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                      <button className="people-user-card__action-btn">
                        <UserPlus size={18} />
                        <span>Add Friend</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="people-section__empty people-section__empty--search">
                  <p className="people-section__empty-text people-section__empty-text--search">
                    No users found matching "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* People You May Know Section - Only show when not searching */}
          {!searchQuery.trim() && (
            <div className="people-section">
              <h2 className="people-section__title">People You May Know</h2>
              <div className="people-section__empty">
                <p className="people-section__empty-text">
                  No People Available
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - Search Filters */}
        <aside
          className={`people-filters ${
            isRightSidebarOpen ? "people-filters--open" : ""
          }`}
        >
          <div className="people-filters__header">
            <h3 className="people-filters__title">
              Search Filters
              <SlidersHorizontal
                size={18}
                className="people-filters__title-icon"
              />
            </h3>
            <button
              className="people-filters__close"
              onClick={() => setIsRightSidebarOpen(false)}
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>

          <div className="people-filters__content">
            {/* Distance Slider */}
            <div className="people-filters__group">
              <label className="people-filters__label">Distance</label>

              <div className="people-filters__slider-wrapper">
                <div className="people-filters__slider-value">{distance}km</div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="people-filters__slider"
                  style={{
                    background: `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${
                      (distance / 500) * 100
                    }%, #e7e7e7 ${(distance / 500) * 100}%, #e7e7e7 100%)`,
                  }}
                />
                <div className="people-filters__slider-labels">
                  <span>0km</span>
                  <span>500km</span>
                </div>
              </div>
            </div>

            {/* Query */}
            <div className="people-filters__group">
              <label className="people-filters__label">Query</label>
              <div style={{ position: "relative" }}>
                <input
                  ref={filterQueryInputRef}
                  type="text"
                  className="people-filters__input"
                  placeholder=""
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  style={{ paddingRight: "40px" }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setIsFilterQueryEmojiPickerOpen(
                        !isFilterQueryEmojiPickerOpen
                      )
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-label="Add emoji"
                    title="Add emoji"
                  >
                    <Smile size={16} color="#0d4a1f" />
                  </button>
                  {isFilterQueryEmojiPickerOpen && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        right: 0,
                        marginBottom: "8px",
                        zIndex: 10001,
                      }}
                    >
                      <EmojiPicker
                        isOpen={isFilterQueryEmojiPickerOpen}
                        onClose={() => setIsFilterQueryEmojiPickerOpen(false)}
                        onEmojiSelect={(emoji) => {
                          setFilterQuery((prev) => prev + emoji);
                          setIsFilterQueryEmojiPickerOpen(false);
                          filterQueryInputRef.current?.focus();
                        }}
                        position="top"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* City */}
            <div className="people-filters__group">
              <label className="people-filters__label">City</label>
              <div style={{ position: "relative" }}>
                <input
                  ref={filterCityInputRef}
                  type="text"
                  className="people-filters__input"
                  placeholder=""
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  style={{ paddingRight: "40px" }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setIsFilterCityEmojiPickerOpen(
                        !isFilterCityEmojiPickerOpen
                      )
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-label="Add emoji"
                    title="Add emoji"
                  >
                    <Smile size={16} color="#0d4a1f" />
                  </button>
                  {isFilterCityEmojiPickerOpen && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        right: 0,
                        marginBottom: "8px",
                        zIndex: 10001,
                      }}
                    >
                      <EmojiPicker
                        isOpen={isFilterCityEmojiPickerOpen}
                        onClose={() => setIsFilterCityEmojiPickerOpen(false)}
                        onEmojiSelect={(emoji) => {
                          setFilterCity((prev) => prev + emoji);
                          setIsFilterCityEmojiPickerOpen(false);
                          filterCityInputRef.current?.focus();
                        }}
                        position="top"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Country */}
            <div className="people-filters__group">
              <label className="people-filters__label">Country</label>
              <select className="people-filters__select">
                <option>Any</option>
              </select>
            </div>

            {/* Gender */}
            <div className="people-filters__group">
              <label className="people-filters__label">Gender</label>
              <select className="people-filters__select">
                <option>Any</option>
              </select>
            </div>

            {/* Relationship Type */}
            <div className="people-filters__group">
              <label className="people-filters__label">Relationship Type</label>
              <select className="people-filters__select">
                <option>Any</option>
              </select>
            </div>

            {/* Online Status */}
            <div className="people-filters__group">
              <label className="people-filters__label">Online Status</label>
              <select className="people-filters__select">
                <option>Any</option>
              </select>
            </div>

            {/* Verified Status */}
            <div className="people-filters__group">
              <label className="people-filters__label">Verified Status</label>
              <select className="people-filters__select">
                <option>Any</option>
              </select>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default People;
