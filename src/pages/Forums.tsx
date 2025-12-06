import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  SquarePlus,
  UserPlus,
  MessageCircle,
  Bell,
  Menu,
  X,
  TrendingUp,
  FileText,
  Clock,
  Users,
  Calendar,
  Search,
  Hash,
  Send,
  Paperclip,
  Smile,
  Heart,
  MessageSquare,
  UserCheck,
  ThumbsUp,
  CheckCircle,
  Trash2,
  Image,
  Video,
  Plus,
} from "lucide-react";
import NewsFeedSidebar from "./NewsFeed/NewsFeedSidebar";
import primaryLogo from "../image/primary-logo.png";
import headerAvatar from "../image/newsfeed/blessing.jpg";
import avatarBlessing from "../image/newsfeed/blessing.jpg";
import avatarJoseph from "../image/newsfeed/joseph.png";
import "../main.css";
import LazyImage from "../components/LazyImage";
import EmojiPicker from "../components/EmojiPicker";
import "../scss/_emojipicker.scss";

const Forums: React.FC = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [messageAttachment, setMessageAttachment] = useState<{
    type: "image" | "video" | "file";
    url: string;
    fileName?: string;
    fileSize?: number;
  } | null>(null);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const addFriendModalRef = useRef<HTMLDivElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const attachmentButtonRef = useRef<HTMLButtonElement>(null);
  const chatMenuRef = useRef<HTMLDivElement>(null);
  const chatMenuButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "All",
    "Cars and Vehicles",
    "Comedy",
    "Economics and Trade",
    "Education",
    "Entertainment",
    "Movies and Animation",
    "Gaming",
    "History and Facts",
    "Life Styles",
    "Natural",
    "News and Politics",
    "Pets and Animals",
    "Place and Region",
    "Sports",
    "Science and Technology",
    "Travels and Events",
    "Others",
  ];

  // Mock chat conversations
  interface ChatMessage {
    id: number;
    senderId: number;
    text: string;
    timestamp: string;
    isRead: boolean;
    attachment?: {
      type: "image" | "video" | "file";
      url: string;
      fileName?: string;
      fileSize?: number;
    };
  }

  interface ChatConversation {
    id: number;
    userId: number;
    userName: string;
    userAvatar: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
    messages: ChatMessage[];
  }

  const [chatConversations, setChatConversations] = useState<
    ChatConversation[]
  >([
    {
      id: 1,
      userId: 1,
      userName: "Blessing Matthias",
      userAvatar: avatarBlessing,
      lastMessage: "Hey! How are you doing?",
      lastMessageTime: "2m ago",
      unreadCount: 2,
      isOnline: true,
      messages: [
        {
          id: 1,
          senderId: 1,
          text: "Hey! How are you doing?",
          timestamp: "10:30 AM",
          isRead: false,
        },
      ],
    },
  ]);

  // Mock notifications
  interface Notification {
    id: number;
    type:
      | "like"
      | "comment"
      | "friend_request"
      | "mention"
      | "share"
      | "event"
      | "message";
    userId: number;
    userName: string;
    userAvatar: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    relatedPostId?: number;
    relatedEventId?: number;
    relatedChatId?: number;
  }

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "like",
      userId: 1,
      userName: "Blessing Matthias",
      userAvatar: avatarBlessing,
      message: "liked your post",
      timestamp: "2 minutes ago",
      isRead: false,
      relatedPostId: 1,
    },
  ]);

  const unreadNotificationsCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  const markNotificationAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const deleteNotification = (notificationId: number) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return <Heart size={20} />;
      case "comment":
        return <MessageSquare size={20} />;
      case "friend_request":
        return <UserCheck size={20} />;
      case "mention":
        return <Hash size={20} />;
      case "share":
        return <ThumbsUp size={20} />;
      case "event":
        return <Calendar size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return "#e91e63";
      case "comment":
        return "#2196f3";
      case "friend_request":
        return "#4caf50";
      case "mention":
        return "#ff9800";
      case "share":
        return "#9c27b0";
      case "event":
        return "#00bcd4";
      default:
        return "#666";
    }
  };

  // Get all people for add friend modal
  const allPeople = [
    {
      id: 1,
      name: "Blessing Matthias",
      avatar: avatarBlessing,
      mutualFriends: 5,
    },
    {
      id: 2,
      name: "Joseph Azumara",
      avatar: avatarJoseph,
      mutualFriends: 3,
    },
  ];

  const filteredPeople = allPeople.filter((person) =>
    person.name.toLowerCase().includes(friendSearchQuery.toLowerCase().trim())
  );

  const filteredConversations = chatConversations.filter((chat) =>
    chat.userName.toLowerCase().includes(chatSearchQuery.toLowerCase().trim())
  );

  const selectedChat = chatConversations.find(
    (chat) => chat.id === selectedChatId
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat?.messages]);

  const handleSendMessage = () => {
    if ((!messageInput.trim() && !messageAttachment) || !selectedChatId) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      senderId: 0,
      text: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: false,
      attachment: messageAttachment || undefined,
    };

    setChatConversations((prev) =>
      prev.map((chat) => {
        if (chat.id === selectedChatId) {
          const lastMessageText = messageAttachment
            ? messageAttachment.type === "image"
              ? "📷 Photo"
              : messageAttachment.type === "video"
              ? "🎥 Video"
              : `📎 ${messageAttachment.fileName || "File"}`
            : newMessage.text;
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: lastMessageText,
            lastMessageTime: "Just now",
          };
        }
        return chat;
      })
    );

    setMessageInput("");
    setMessageAttachment(null);
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video" | "file"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMessageAttachment({
          type: type,
          url: reader.result as string,
          fileName: file.name,
          fileSize: file.size,
        });
        setIsAttachmentMenuOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentClick = (type: "image" | "video" | "file") => {
    setIsAttachmentMenuOpen(false);
    if (type === "image" && imageInputRef.current) {
      imageInputRef.current.click();
    } else if (type === "video" && videoInputRef.current) {
      videoInputRef.current.click();
    } else if (type === "file" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateClick = () => {
    setIsCreateMenuOpen(!isCreateMenuOpen);
  };

  const handleCreatePost = () => {
    setIsCreateMenuOpen(false);
  };

  const handleCreateStory = () => {
    setIsCreateMenuOpen(false);
  };

  const handleCreateGroup = () => {
    setIsCreateMenuOpen(false);
  };

  const handleCreateEvent = () => {
    setIsCreateMenuOpen(false);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      createMenuRef.current &&
      !createMenuRef.current.contains(event.target as Node)
    ) {
      setIsCreateMenuOpen(false);
    }
    if (
      addFriendModalRef.current &&
      !addFriendModalRef.current.contains(event.target as Node)
    ) {
      const target = event.target as HTMLElement;
      if (!target.closest(".newsfeed-add-friend-modal")) {
        setIsAddFriendModalOpen(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isCreateMenuOpen || isAddFriendModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreateMenuOpen, isAddFriendModalOpen, handleClickOutside]);

  // Close attachment menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(event.target as Node) &&
        attachmentButtonRef.current &&
        !attachmentButtonRef.current.contains(event.target as Node)
      ) {
        setIsAttachmentMenuOpen(false);
      }
    };

    if (isAttachmentMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAttachmentMenuOpen]);

  // Close chat menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatMenuRef.current &&
        !chatMenuRef.current.contains(event.target as Node) &&
        chatMenuButtonRef.current &&
        !chatMenuButtonRef.current.contains(event.target as Node)
      ) {
        setIsChatMenuOpen(false);
      }
    };

    if (isChatMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatMenuOpen]);

  return (
    <div className="forums-page">
      {/* Top Navigation Bar - Same as NewsFeed */}
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
            <div
              className="newsfeed-header__create-wrapper"
              ref={createMenuRef}
            >
              <button
                className="newsfeed-header__icon-btn"
                title="Create"
                onClick={handleCreateClick}
              >
                <SquarePlus size={20} />
              </button>
              {isCreateMenuOpen && (
                <div className="newsfeed-header__create-dropdown">
                  <button
                    className="newsfeed-header__create-item"
                    onClick={handleCreatePost}
                  >
                    <FileText size={18} />
                    <span>Create Post</span>
                  </button>
                  <button
                    className="newsfeed-header__create-item"
                    onClick={handleCreateStory}
                  >
                    <Clock size={18} />
                    <span>Create Story</span>
                  </button>
                  <button
                    className="newsfeed-header__create-item"
                    onClick={handleCreateGroup}
                  >
                    <Users size={18} />
                    <span>Create Group</span>
                  </button>
                  <button
                    className="newsfeed-header__create-item"
                    onClick={handleCreateEvent}
                  >
                    <Calendar size={18} />
                    <span>Create Event</span>
                  </button>
                </div>
              )}
            </div>
            <button
              className="newsfeed-header__icon-btn"
              title="Add Friend"
              onClick={() => setIsAddFriendModalOpen(true)}
            >
              <UserPlus size={20} />
            </button>
            <button
              className="newsfeed-header__icon-btn"
              title="Messages"
              onClick={() => setIsChatPanelOpen(true)}
            >
              <MessageCircle size={20} />
            </button>
            <button
              className="newsfeed-header__icon-btn newsfeed-header__icon-btn--notifications"
              title="Notifications"
              onClick={() => setIsNotificationPanelOpen(true)}
            >
              <Bell size={20} />
              {unreadNotificationsCount > 0 && (
                <span className="newsfeed-header__badge">
                  {unreadNotificationsCount > 9
                    ? "9+"
                    : unreadNotificationsCount}
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

        {/* Left Sidebar - Using NewsFeedSidebar */}
        <NewsFeedSidebar
          isOpen={isLeftSidebarOpen}
          onClose={() => setIsLeftSidebarOpen(false)}
        />

        {/* Forums Banner Section */}
        <div className="forums-banner">
          <div className="forums-banner__content">
            <h1 className="forums-banner__title">Forums</h1>
            <div className="forums-banner__search-wrapper">
              <input
                type="text"
                className="forums-banner__search"
                placeholder="Search for forums"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={20} className="forums-banner__search-icon" />
            </div>
            <div className="forums-banner__illustration">
              {/* Illustration placeholder - can be replaced with actual image */}
            </div>
          </div>
        </div>

        {/* Navigation Tabs and Create Forum Button */}
        <div className="forums-nav">
          <div className="forums-nav__tabs">
            <button
              type="button"
              className={`forums-nav__tab ${
                activeTab === "discover" ? "forums-nav__tab--active" : ""
              }`}
              onClick={() => setActiveTab("discover")}
            >
              Discover
            </button>
            <button
              type="button"
              className={`forums-nav__tab ${
                activeTab === "joined" ? "forums-nav__tab--active" : ""
              }`}
              onClick={() => setActiveTab("joined")}
            >
              Joined Forums
            </button>
            <button
              type="button"
              className={`forums-nav__tab ${
                activeTab === "my-forums" ? "forums-nav__tab--active" : ""
              }`}
              onClick={() => setActiveTab("my-forums")}
            >
              My Forums
            </button>
          </div>
          <button className="forums-nav__create-btn">
            <Plus size={18} />
            <span>Create Forum</span>
          </button>
        </div>

        {/* Categories Sidebar */}
        <aside className="forums-categories">
          <div className="forums-categories__header">
            <h3 className="forums-categories__title">Categories</h3>
          </div>
          <div className="forums-categories__list">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`forums-categories__item ${
                  selectedCategory === category
                    ? "forums-categories__item--active"
                    : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="forums-main">
          <h2 className="forums-main__title">Discover Forums</h2>
          <div className="forums-main__empty">
            <div className="forums-main__empty-icon">
              <MessageSquare size={64} />
              <Search size={32} />
            </div>
            <p className="forums-main__empty-text">No Data Found</p>
            <p className="forums-main__empty-subtext">
              There is no data to show you right now
            </p>
          </div>
        </main>
      </div>

      {/* Add Friend Modal - Same as NewsFeed */}
      {isAddFriendModalOpen && (
        <div
          className="newsfeed-add-friend-modal-overlay"
          onClick={() => setIsAddFriendModalOpen(false)}
        >
          <div
            ref={addFriendModalRef}
            className="newsfeed-add-friend-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="newsfeed-add-friend-modal__header">
              <h3>Find Friends</h3>
              <button
                className="newsfeed-add-friend-modal__close"
                onClick={() => setIsAddFriendModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="newsfeed-add-friend-modal__search">
              <div className="newsfeed-add-friend-modal__search-wrapper">
                <Search
                  size={20}
                  className="newsfeed-add-friend-modal__search-icon"
                />
                <input
                  type="text"
                  className="newsfeed-add-friend-modal__search-input"
                  placeholder="Search for friends..."
                  value={friendSearchQuery}
                  onChange={(e) => setFriendSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="newsfeed-add-friend-modal__content">
              {filteredPeople.length > 0 ? (
                <div className="newsfeed-add-friend-modal__list">
                  {filteredPeople.map((person) => (
                    <div
                      key={person.id}
                      className="newsfeed-add-friend-modal__item"
                    >
                      <LazyImage
                        src={person.avatar || "/placeholder-avatar.png"}
                        alt={person.name}
                        className="newsfeed-add-friend-modal__avatar"
                      />
                      <div className="newsfeed-add-friend-modal__info">
                        <p className="newsfeed-add-friend-modal__name">
                          {person.name}
                        </p>
                        {person.mutualFriends > 0 && (
                          <p className="newsfeed-add-friend-modal__mutual">
                            {person.mutualFriends} Mutual friend
                            {person.mutualFriends !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                      <button
                        className="newsfeed-add-friend-modal__add-btn"
                        onClick={() => {
                          console.log(`Adding ${person.name} as friend`);
                        }}
                        aria-label={`Add ${person.name} as friend`}
                      >
                        <UserPlus size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="newsfeed-add-friend-modal__empty">
                  <p>No people found</p>
                  <p className="newsfeed-add-friend-modal__empty-subtitle">
                    Try searching with a different name
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Panel - Same as NewsFeed */}
      {isChatPanelOpen && (
        <div
          className="newsfeed-chat-panel-overlay"
          onClick={() => setIsChatPanelOpen(false)}
        >
          <div
            ref={chatPanelRef}
            className="newsfeed-chat-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="newsfeed-chat-panel__header">
              <h3>Messages</h3>
              <button
                className="newsfeed-chat-panel__close"
                onClick={() => setIsChatPanelOpen(false)}
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            <div className="newsfeed-chat-panel__container">
              {/* Conversations List */}
              <div className="newsfeed-chat-panel__conversations">
                <div className="newsfeed-chat-panel__search-wrapper">
                  <Search
                    size={18}
                    className="newsfeed-chat-panel__search-icon"
                  />
                  <input
                    type="text"
                    className="newsfeed-chat-panel__search-input"
                    placeholder="Search conversations..."
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                  />
                </div>
                <div className="newsfeed-chat-panel__conversations-list">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`newsfeed-chat-panel__conversation-item ${
                          selectedChatId === conversation.id
                            ? "newsfeed-chat-panel__conversation-item--active"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedChatId(conversation.id);
                          setChatConversations((prev) =>
                            prev.map((chat) =>
                              chat.id === conversation.id
                                ? {
                                    ...chat,
                                    messages: chat.messages.map((msg) => ({
                                      ...msg,
                                      isRead: true,
                                    })),
                                    unreadCount: 0,
                                  }
                                : chat
                            )
                          );
                        }}
                      >
                        <div className="newsfeed-chat-panel__conversation-avatar-wrapper">
                          <LazyImage
                            src={
                              conversation.userAvatar ||
                              "/placeholder-avatar.png"
                            }
                            alt={conversation.userName}
                            className="newsfeed-chat-panel__conversation-avatar"
                          />
                          {conversation.isOnline && (
                            <span className="newsfeed-chat-panel__online-indicator"></span>
                          )}
                        </div>
                        <div className="newsfeed-chat-panel__conversation-info">
                          <div className="newsfeed-chat-panel__conversation-header">
                            <p className="newsfeed-chat-panel__conversation-name">
                              {conversation.userName}
                            </p>
                            <span className="newsfeed-chat-panel__conversation-time">
                              {conversation.lastMessageTime}
                            </span>
                          </div>
                          <div className="newsfeed-chat-panel__conversation-preview">
                            <p className="newsfeed-chat-panel__conversation-message">
                              {conversation.lastMessage}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="newsfeed-chat-panel__unread-badge">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="newsfeed-chat-panel__empty-conversations">
                      <p>No conversations found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Window */}
              <div className="newsfeed-chat-panel__chat-window">
                {selectedChat ? (
                  <>
                    <div className="newsfeed-chat-panel__chat-header">
                      <div className="newsfeed-chat-panel__chat-user-info">
                        <div className="newsfeed-chat-panel__chat-avatar-wrapper">
                          <LazyImage
                            src={
                              selectedChat.userAvatar ||
                              "/placeholder-avatar.png"
                            }
                            alt={selectedChat.userName}
                            className="newsfeed-chat-panel__chat-avatar"
                          />
                          {selectedChat.isOnline && (
                            <span className="newsfeed-chat-panel__online-indicator"></span>
                          )}
                        </div>
                        <div>
                          <p className="newsfeed-chat-panel__chat-user-name">
                            {selectedChat.userName}
                          </p>
                          <p className="newsfeed-chat-panel__chat-status">
                            {selectedChat.isOnline ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="newsfeed-chat-panel__messages">
                      {selectedChat.messages.map((message) => {
                        const isCurrentUser = message.senderId === 0;
                        return (
                          <div
                            key={message.id}
                            className={`newsfeed-chat-panel__message ${
                              isCurrentUser
                                ? "newsfeed-chat-panel__message--sent"
                                : "newsfeed-chat-panel__message--received"
                            }`}
                          >
                            {!isCurrentUser && (
                              <LazyImage
                                src={
                                  selectedChat.userAvatar ||
                                  "/placeholder-avatar.png"
                                }
                                alt={selectedChat.userName}
                                className="newsfeed-chat-panel__message-avatar"
                              />
                            )}
                            <div className="newsfeed-chat-panel__message-content">
                              {message.text && (
                                <p className="newsfeed-chat-panel__message-text">
                                  {message.text}
                                </p>
                              )}
                              <span className="newsfeed-chat-panel__message-time">
                                {message.timestamp}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="newsfeed-chat-panel__input-area">
                      <div
                        className="newsfeed-chat-panel__attachment-menu-wrapper"
                        ref={attachmentMenuRef}
                      >
                        <button
                          ref={attachmentButtonRef}
                          className="newsfeed-chat-panel__input-btn"
                          aria-label="Attach file"
                          title="Attach file"
                          onClick={() =>
                            setIsAttachmentMenuOpen(!isAttachmentMenuOpen)
                          }
                        >
                          <Paperclip size={20} />
                        </button>
                        {isAttachmentMenuOpen && (
                          <div className="newsfeed-chat-panel__attachment-menu">
                            <button
                              className="newsfeed-chat-panel__attachment-menu-item"
                              onClick={() => handleAttachmentClick("image")}
                            >
                              <Image size={18} />
                              <span>Photo</span>
                            </button>
                            <button
                              className="newsfeed-chat-panel__attachment-menu-item"
                              onClick={() => handleAttachmentClick("video")}
                            >
                              <Video size={18} />
                              <span>Video</span>
                            </button>
                            <button
                              className="newsfeed-chat-panel__attachment-menu-item"
                              onClick={() => handleAttachmentClick("file")}
                            >
                              <Paperclip size={18} />
                              <span>File</span>
                            </button>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="*/*"
                        onChange={(e) => handleFileSelect(e, "file")}
                        style={{ display: "none" }}
                      />
                      <input
                        type="file"
                        ref={imageInputRef}
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, "image")}
                        style={{ display: "none" }}
                      />
                      <input
                        type="file"
                        ref={videoInputRef}
                        accept="video/*"
                        onChange={(e) => handleFileSelect(e, "video")}
                        style={{ display: "none" }}
                      />
                      <input
                        type="text"
                        className="newsfeed-chat-panel__input"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <div style={{ position: "relative", zIndex: 1000 }}>
                        <button
                          className="newsfeed-chat-panel__input-btn"
                          aria-label="Add emoji"
                          title="Add emoji"
                          onClick={() =>
                            setIsEmojiPickerOpen(!isEmojiPickerOpen)
                          }
                        >
                          <Smile size={20} />
                        </button>
                        {isEmojiPickerOpen && (
                          <EmojiPicker
                            isOpen={isEmojiPickerOpen}
                            onClose={() => setIsEmojiPickerOpen(false)}
                            onEmojiSelect={(emoji) => {
                              setMessageInput((prev) => prev + emoji);
                              setIsEmojiPickerOpen(false);
                            }}
                            position="top"
                          />
                        )}
                      </div>
                      <button
                        className="newsfeed-chat-panel__send-btn"
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() && !messageAttachment}
                        aria-label="Send message"
                        title="Send message"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="newsfeed-chat-panel__no-chat-selected">
                    <MessageCircle size={64} />
                    <p>Select a conversation to start chatting</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Panel - Same as NewsFeed */}
      {isNotificationPanelOpen && (
        <div
          className="newsfeed-notification-panel-overlay"
          onClick={() => setIsNotificationPanelOpen(false)}
        >
          <div
            ref={notificationPanelRef}
            className="newsfeed-notification-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="newsfeed-notification-panel__header">
              <div className="newsfeed-notification-panel__header-content">
                <h3>Notifications</h3>
                {unreadNotificationsCount > 0 && (
                  <span className="newsfeed-notification-panel__unread-count">
                    {unreadNotificationsCount} new
                  </span>
                )}
              </div>
              <div className="newsfeed-notification-panel__header-actions">
                {unreadNotificationsCount > 0 && (
                  <button
                    className="newsfeed-notification-panel__action-btn"
                    onClick={markAllAsRead}
                    title="Mark all as read"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    className="newsfeed-notification-panel__action-btn"
                    onClick={clearAllNotifications}
                    title="Clear all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button
                  className="newsfeed-notification-panel__close"
                  onClick={() => setIsNotificationPanelOpen(false)}
                  aria-label="Close notifications"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="newsfeed-notification-panel__content">
              {notifications.length > 0 ? (
                <div className="newsfeed-notification-panel__list">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`newsfeed-notification-panel__item ${
                        !notification.isRead
                          ? "newsfeed-notification-panel__item--unread"
                          : ""
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div
                        className="newsfeed-notification-panel__icon-wrapper"
                        style={{
                          backgroundColor: `${getNotificationColor(
                            notification.type
                          )}20`,
                        }}
                      >
                        <div
                          className="newsfeed-notification-panel__icon"
                          style={{
                            color: getNotificationColor(notification.type),
                          }}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      <div className="newsfeed-notification-panel__content-wrapper">
                        <div className="newsfeed-notification-panel__user-info">
                          <LazyImage
                            src={
                              notification.userAvatar ||
                              "/placeholder-avatar.png"
                            }
                            alt={notification.userName}
                            className="newsfeed-notification-panel__avatar"
                          />
                          <div className="newsfeed-notification-panel__text">
                            <p className="newsfeed-notification-panel__message">
                              <span className="newsfeed-notification-panel__user-name">
                                {notification.userName}
                              </span>{" "}
                              {notification.message}
                            </p>
                            <span className="newsfeed-notification-panel__timestamp">
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>
                        {!notification.isRead && (
                          <span className="newsfeed-notification-panel__unread-dot"></span>
                        )}
                      </div>
                      <button
                        className="newsfeed-notification-panel__delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        aria-label="Delete notification"
                        title="Delete"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="newsfeed-notification-panel__empty">
                  <Bell size={64} />
                  <p>No notifications</p>
                  <p className="newsfeed-notification-panel__empty-subtitle">
                    You're all caught up!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forums;
