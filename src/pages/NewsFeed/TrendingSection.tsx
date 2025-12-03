import React from 'react';
import { Flame } from 'lucide-react';

interface Trending {
  hashtag: string;
  posts: number;
}

interface TrendingSectionProps {
  trending: Trending[];
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ trending }) => {
  return (
    <div className="newsfeed-trending">
      <h3 className="newsfeed-trending__title">
        <Flame size={20} />
        <span>Trending</span>
      </h3>
      <div className="newsfeed-trending__list">
        {trending.map((item, index) => (
          <div key={index} className="newsfeed-trending__item">
            <span className="newsfeed-trending__hashtag">{item.hashtag}</span>
            <span className="newsfeed-trending__count">
              ({item.posts} Post{item.posts !== 1 ? 's' : ''})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;

