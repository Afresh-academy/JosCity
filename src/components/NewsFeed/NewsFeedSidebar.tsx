import React, { useState } from 'react';
import {
  Home,
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
} from 'lucide-react';

interface NewsFeedSidebarProps {}

const NewsFeedSidebar: React.FC<NewsFeedSidebarProps> = () => {
  const [activeItem, setActiveItem] = useState<string>('newsfeed');

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, itemId: string) => {
    e.preventDefault();
    setActiveItem(itemId);
  };

  return (
    <aside className="newsfeed-sidebar">
      <nav className="newsfeed-sidebar__nav">
        <div className="newsfeed-sidebar__section">
          <a
            href="#"
            className={`newsfeed-sidebar__item ${activeItem === 'newsfeed' ? 'newsfeed-sidebar__item--active' : ''}`}
            onClick={(e) => handleItemClick(e, 'newsfeed')}
          >
            <Home size={20} />
            <span>News Feed</span>
          </a>
          <a
            href="#"
            className={`newsfeed-sidebar__item ${activeItem === 'scheduled' ? 'newsfeed-sidebar__item--active' : ''}`}
            onClick={(e) => handleItemClick(e, 'scheduled')}
          >
            <Calendar size={20} />
            <span>Scheduled</span>
          </a>
          <a
            href="#"
            className={`newsfeed-sidebar__item ${activeItem === 'saved' ? 'newsfeed-sidebar__item--active' : ''}`}
            onClick={(e) => handleItemClick(e, 'saved')}
          >
            <Bookmark size={20} />
            <span>Saved</span>
          </a>
        </div>

        <div className="newsfeed-sidebar__section">
          <h3 className="newsfeed-sidebar__section-title">EXPLORE</h3>
          <a
            href="#"
            className={`newsfeed-sidebar__item ${activeItem === 'business' ? 'newsfeed-sidebar__item--active' : ''}`}
            onClick={(e) => handleItemClick(e, 'business')}
          >
            <Briefcase size={20} />
            <span>Business</span>
          </a>
          <a
            href="#"
            className={`newsfeed-sidebar__item ${activeItem === 'people' ? 'newsfeed-sidebar__item--active' : ''}`}
            onClick={(e) => handleItemClick(e, 'people')}
          >
            <Users size={20} />
            <span>People</span>
          </a>
          <a
            href="#"
            className={`newsfeed-sidebar__item ${activeItem === 'events' ? 'newsfeed-sidebar__item--active' : ''}`}
            onClick={(e) => handleItemClick(e, 'events')}
          >
            <Events size={20} />
            <span>Events</span>
          </a>
          <a
            href="#"
            className={`newsfeed-sidebar__item ${activeItem === 'reels' ? 'newsfeed-sidebar__item--active' : ''}`}
            onClick={(e) => handleItemClick(e, 'reels')}
          >
            <Video size={20} />
            <span>Reels</span>
          </a>
          <a
            href="#"
            className={`newsfeed-sidebar__item ${activeItem === 'news' ? 'newsfeed-sidebar__item--active' : ''}`}
            onClick={(e) => handleItemClick(e, 'news')}
          >
            <Newspaper size={20} />
            <span>News</span>
          </a>
          <a
            href="#"
            className={`newsfeed-sidebar__item ${activeItem === 'forums' ? 'newsfeed-sidebar__item--active' : ''}`}
            onClick={(e) => handleItemClick(e, 'forums')}
          >
            <MessageSquare size={20} />
            <span>Forums</span>
          </a>
          <a
            href="#"
            className={`newsfeed-sidebar__item ${activeItem === 'marketplace' ? 'newsfeed-sidebar__item--active' : ''}`}
            onClick={(e) => handleItemClick(e, 'marketplace')}
          >
            <Store size={20} />
            <span>Marketplace</span>
          </a>
          <a
            href="#"
            className={`newsfeed-sidebar__item ${activeItem === 'offers' ? 'newsfeed-sidebar__item--active' : ''}`}
            onClick={(e) => handleItemClick(e, 'offers')}
          >
            <Tag size={20} />
            <span>Offers</span>
          </a>
          <a
            href="#"
            className={`newsfeed-sidebar__item ${activeItem === 'jobs' ? 'newsfeed-sidebar__item--active' : ''}`}
            onClick={(e) => handleItemClick(e, 'jobs')}
          >
            <Jobs size={20} />
            <span>Jobs</span>
          </a>
          <a
            href="#"
            className={`newsfeed-sidebar__item ${activeItem === 'movies' ? 'newsfeed-sidebar__item--active' : ''}`}
            onClick={(e) => handleItemClick(e, 'movies')}
          >
            <Film size={20} />
            <span>Movies</span>
          </a>
        </div>
      </nav>
    </aside>
  );
};

export default NewsFeedSidebar;

