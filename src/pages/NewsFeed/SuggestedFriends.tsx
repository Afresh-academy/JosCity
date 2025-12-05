import React from "react";
import { UserPlus } from "lucide-react";
import LazyImage from "../../components/LazyImage";

interface Friend {
  id: number;
  name: string;
  avatar: string;
  mutualFriends: number;
}

interface SuggestedFriendsProps {
  friends: Friend[];
}

const SuggestedFriends: React.FC<SuggestedFriendsProps> = ({ friends }) => {
  return (
    <div className="newsfeed-suggested-friends">
      <div className="newsfeed-suggested-friends__header">
        <h3 className="newsfeed-suggested-friends__title">Suggested Friends</h3>
        <a href="#" className="newsfeed-suggested-friends__see-all">
          See All
        </a>
      </div>
      <div className="newsfeed-suggested-friends__list">
        {friends.map((friend) => (
          <div key={friend.id} className="newsfeed-suggested-friends__item">
            <LazyImage
              src={friend.avatar || "/placeholder-avatar.png"}
              alt={friend.name}
              className="newsfeed-suggested-friends__avatar"
            />
            <div className="newsfeed-suggested-friends__info">
              <p className="newsfeed-suggested-friends__name">{friend.name}</p>
              {friend.mutualFriends > 0 && (
                <p className="newsfeed-suggested-friends__mutual">
                  {friend.mutualFriends} Mutual friend
                  {friend.mutualFriends !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <button className="newsfeed-suggested-friends__add-btn">
              <UserPlus size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedFriends;
