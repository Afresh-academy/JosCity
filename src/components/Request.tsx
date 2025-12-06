import React, { useState } from "react";
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
} from "lucide-react";
import primaryLogo from "../image/primary-logo.png";
import headerAvatar from "../image/newsfeed/blessing.jpg";
import LazyImage from "./LazyImage";
import "../main.css";

const Request: React.FC = () => {
  const navigate = useNavigate();
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("friend-requests");
  const [distance, setDistance] = useState(100);

  return (
    <div className="people-page">
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
              <Search size={20} />
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
              <a href="#" className="people-sidebar__item">
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
              <a href="#" className="people-sidebar__item">
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
        <div className="people-search-section">
          <div className="people-search-section__input-wrapper">
            <input
              type="text"
              placeholder="Search"
              className="people-search-section__input"
            />
            <Search size={20} className="people-search-section__icon" />
          </div>
        </div>

        {/* Tabs - Full Width */}
        <div className="people-tabs">
          <button
            type="button"
            className={`people-tabs__tab ${
              activeTab === "find" ? "people-tabs__tab--active" : ""
            }`}
            onClick={() => {
              setActiveTab("find");
              navigate("/people");
            }}
          >
            Find
          </button>
          <button
            type="button"
            className={`people-tabs__tab ${
              activeTab === "friend-requests" ? "people-tabs__tab--active" : ""
            }`}
            onClick={() => setActiveTab("friend-requests")}
          >
            Friend Requests
          </button>
          <button
            type="button"
            className={`people-tabs__tab ${
              activeTab === "sent-requests" ? "people-tabs__tab--active" : ""
            }`}
            onClick={() => {
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
          {/* Respond to Friend Request Section */}
          <div className="people-section">
            <h2 className="people-section__title">Respond to Friend Request</h2>
            <div className="people-section__empty">
              <p className="people-section__empty-text">
                No Friend Requests Available
              </p>
            </div>
          </div>
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
              <Search size={18} className="people-filters__title-icon" />
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
              <input
                type="text"
                className="people-filters__input"
                placeholder=""
              />
            </div>

            {/* City */}
            <div className="people-filters__group">
              <label className="people-filters__label">City</label>
              <input
                type="text"
                className="people-filters__input"
                placeholder=""
              />
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

export default Request;
