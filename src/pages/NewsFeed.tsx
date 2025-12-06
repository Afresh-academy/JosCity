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
  User,
  Send,
  MoreVertical,
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
} from "lucide-react";
import NewsFeedSidebar from "./NewsFeed/NewsFeedSidebar";
import StoriesSection from "./NewsFeed/StoriesSection";
import CreatePostInput from "./NewsFeed/CreatePostInput";
import PostCard from "./NewsFeed/PostCard";
import TrendingSection from "./NewsFeed/TrendingSection";
import SuggestedFriends from "./NewsFeed/SuggestedFriends";
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
import EmojiPicker from "../components/EmojiPicker";
import ProfileModal from "../components/ProfileModal";
import "../scss/_emojipicker.scss";
import "../scss/_profilemodal.scss";

interface SearchResult {
  type: "person" | "hashtag" | "post";
  id: string | number;
  title: string;
  subtitle?: string;
  avatar?: string;
  postCount?: number;
}

const NewsFeed: React.FC = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [showGoodMorningCard, setShowGoodMorningCard] = useState(true);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filteredHashtag, setFilteredHashtag] = useState<string | null>(null);
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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState<number | null>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
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

  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { greeting: "Good morning", icon: "☀️" };
    } else if (hour >= 12 && hour < 17) {
      return { greeting: "Good afternoon", icon: "🌤️" };
    } else if (hour >= 17 && hour < 21) {
      return { greeting: "Good evening", icon: "🌅" };
    } else {
      return { greeting: "Good night", icon: "🌙" };
    }
  };

  // Get user's name from localStorage or use default
  const getUserName = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user.user_firstname) {
          return user.user_firstname;
        }
        if (user.display_name) {
          return user.display_name;
        }
        if (user.name) {
          return user.name;
        }
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    return "Olamilekan"; // Default fallback
  };

  const [greetingData, setGreetingData] = useState(getTimeBasedGreeting());
  const userName = getUserName();

  // Update greeting based on time (check every hour)
  useEffect(() => {
    const updateGreeting = () => {
      setGreetingData(getTimeBasedGreeting());
    };

    // Update immediately
    updateGreeting();

    // Set up interval to check every hour
    const interval = setInterval(updateGreeting, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Get user's avatar from localStorage or use default
  const getUserAvatar = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user.avatar) {
          return user.avatar;
        }
        if (user.user_avatar) {
          return user.user_avatar;
        }
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    return avatarOla; // Default fallback
  };

  // Mock data - will be replaced with real data later
  const [posts, setPosts] = useState([
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
  ]);

  // Function to handle new post creation
  const handleNewPost = (caption: string, image: string | null, video: string | null) => {
    const newPost = {
      id: Date.now(), // Use timestamp as unique ID
      userName: userName,
      userAvatar: getUserAvatar(),
      action: "",
      timeAgo: "Just now",
      image: image || undefined,
      video: video || undefined,
      likes: 0,
      comments: 0,
      views: 0,
      reviews: 0,
      caption: caption || undefined,
      hashtags: caption
        ? caption
            .split(" ")
            .filter((word) => word.startsWith("#"))
            .join(" ") || undefined
        : undefined,
    };
    
    // Add new post at the beginning of the array
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const [stories, setStories] = useState([
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
  ]);

  // Function to handle new story creation
  const handleNewStory = (type: "text" | "photo" | "video", content: string, caption?: string) => {
    const newStory = {
      id: Date.now(), // Use timestamp as unique ID
      userName: userName,
      avatar: getUserAvatar(),
      hasNewStory: false,
      type: type,
      content: content,
      caption: caption,
    };
    
    // Add new story at the beginning of the array
    setStories((prevStories) => [newStory, ...prevStories]);
    
    console.log("New story created:", { type, content, caption });
  };

  // Calculate most common hashtags from posts
  const calculateTrendingHashtags = () => {
    const hashtagCounts: Record<string, number> = {};
    
    posts.forEach((post) => {
      if (post.hashtags) {
        const hashtags = post.hashtags
          .split(" ")
          .filter((tag) => tag.startsWith("#") && tag.length > 1);
        hashtags.forEach((hashtag) => {
          hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
        });
      }
    });

    // Convert to array, sort by count, and take top 2
    const sortedHashtags = Object.entries(hashtagCounts)
      .map(([hashtag, count]) => ({ hashtag, posts: count }))
      .sort((a, b) => b.posts - a.posts)
      .slice(0, 2);

    return sortedHashtags;
  };

  const trending = calculateTrendingHashtags();

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

  const [chatConversations, setChatConversations] = useState<ChatConversation[]>([
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
        {
          id: 2,
          senderId: 0, // 0 represents current user
          text: "I'm doing great, thanks for asking!",
          timestamp: "10:32 AM",
          isRead: true,
        },
        {
          id: 3,
          senderId: 1,
          text: "That's awesome! Want to catch up this weekend?",
          timestamp: "10:33 AM",
          isRead: false,
        },
      ],
    },
    {
      id: 2,
      userId: 2,
      userName: "Joseph Azumara",
      userAvatar: avatarJoseph,
      lastMessage: "Thanks for the help earlier!",
      lastMessageTime: "1h ago",
      unreadCount: 0,
      isOnline: false,
      messages: [
        {
          id: 1,
          senderId: 2,
          text: "Thanks for the help earlier!",
          timestamp: "9:15 AM",
          isRead: true,
        },
        {
          id: 2,
          senderId: 0,
          text: "No problem at all! Happy to help.",
          timestamp: "9:20 AM",
          isRead: true,
        },
      ],
    },
    {
      id: 3,
      userId: 3,
      userName: "David Gabriel",
      userAvatar: avatarDavidGabriel,
      lastMessage: "See you at the meeting!",
      lastMessageTime: "3h ago",
      unreadCount: 0,
      isOnline: true,
      messages: [
        {
          id: 1,
          senderId: 0,
          text: "Are we still meeting today?",
          timestamp: "8:00 AM",
          isRead: true,
        },
        {
          id: 2,
          senderId: 3,
          text: "Yes, see you at the meeting!",
          timestamp: "8:05 AM",
          isRead: true,
        },
      ],
    },
    {
      id: 4,
      userId: 4,
      userName: "Joy James",
      userAvatar: avatarJoy,
      lastMessage: "The event was amazing!",
      lastMessageTime: "Yesterday",
      unreadCount: 1,
      isOnline: false,
      messages: [
        {
          id: 1,
          senderId: 4,
          text: "The event was amazing!",
          timestamp: "Yesterday 6:00 PM",
          isRead: false,
        },
      ],
    },
    {
      id: 5,
      userId: 5,
      userName: "Ola Wale",
      userAvatar: avatarOla,
      lastMessage: "Can you send me that file?",
      lastMessageTime: "2 days ago",
      unreadCount: 0,
      isOnline: true,
      messages: [
        {
          id: 1,
          senderId: 5,
          text: "Can you send me that file?",
          timestamp: "2 days ago",
          isRead: true,
        },
        {
          id: 2,
          senderId: 0,
          text: "Sure, I'll send it right away.",
          timestamp: "2 days ago",
          isRead: true,
        },
      ],
    },
  ]);

  // Mock notifications
  interface Notification {
    id: number;
    type: "like" | "comment" | "friend_request" | "mention" | "share" | "event" | "message";
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
    {
      id: 2,
      type: "comment",
      userId: 2,
      userName: "Joseph Azumara",
      userAvatar: avatarJoseph,
      message: "commented on your post: 'Great post! Thanks for sharing.'",
      timestamp: "15 minutes ago",
      isRead: false,
      relatedPostId: 1,
    },
    {
      id: 3,
      type: "friend_request",
      userId: 4,
      userName: "Joy James",
      userAvatar: avatarJoy,
      message: "sent you a friend request",
      timestamp: "1 hour ago",
      isRead: false,
    },
    {
      id: 4,
      type: "like",
      userId: 3,
      userName: "David Gabriel",
      userAvatar: avatarDavidGabriel,
      message: "liked your post",
      timestamp: "2 hours ago",
      isRead: true,
      relatedPostId: 2,
    },
    {
      id: 5,
      type: "mention",
      userId: 5,
      userName: "Ola Wale",
      userAvatar: avatarOla,
      message: "mentioned you in a comment",
      timestamp: "3 hours ago",
      isRead: false,
      relatedPostId: 3,
    },
    {
      id: 6,
      type: "share",
      userId: 1,
      userName: "Blessing Matthias",
      userAvatar: avatarBlessing,
      message: "shared your post",
      timestamp: "5 hours ago",
      isRead: true,
      relatedPostId: 1,
    },
    {
      id: 7,
      type: "event",
      userId: 2,
      userName: "Joseph Azumara",
      userAvatar: avatarJoseph,
      message: "invited you to an event",
      timestamp: "Yesterday",
      isRead: false,
      relatedEventId: 1,
    },
    {
      id: 8,
      type: "like",
      userId: 4,
      userName: "Joy James",
      userAvatar: avatarJoy,
      message: "liked your post",
      timestamp: "Yesterday",
      isRead: true,
      relatedPostId: 2,
    },
  ]);

  // Calculate unread notifications count
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Mark notification as read
  const markNotificationAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Delete notification
  const deleteNotification = (notificationId: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
  };

  // Get notification icon based on type
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

  // Get notification color based on type
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

  // Extract all unique people from posts, stories, and suggested friends
  const allPeople = [
    ...new Set([
      ...posts.map((p) => p.userName),
      ...stories.map((s) => s.userName),
      ...suggestedFriends.map((f) => f.name),
    ]),
  ].map((name) => {
    const post = posts.find((p) => p.userName === name);
    const story = stories.find((s) => s.userName === name);
    const friend = suggestedFriends.find((f) => f.name === name);
    return {
      id: friend?.id || Math.random(),
      name,
      avatar: post?.userAvatar || story?.avatar || friend?.avatar || "",
      mutualFriends: friend?.mutualFriends || 0,
    };
  });

  // Filter people based on search query
  const filteredPeople = allPeople.filter((person) =>
    person.name.toLowerCase().includes(friendSearchQuery.toLowerCase().trim())
  );

  // Filter conversations based on search query
  const filteredConversations = chatConversations.filter((chat) =>
    chat.userName.toLowerCase().includes(chatSearchQuery.toLowerCase().trim())
  );

  // Get selected chat
  const selectedChat = chatConversations.find((chat) => chat.id === selectedChatId);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat?.messages]);

  // Add notification when receiving a new message
  useEffect(() => {
    chatConversations.forEach((chat) => {
      if (chat.messages.length > 0) {
        const lastMessage = chat.messages[chat.messages.length - 1];
        // Only create notification for messages from other users that are unread
        // and when chat is not currently selected (user is not viewing the chat)
        if (
          lastMessage &&
          lastMessage.senderId !== 0 &&
          !lastMessage.isRead &&
          selectedChatId !== chat.id
        ) {
          setNotifications((prev) => {
            // Check if notification already exists for this message
            const existingNotification = prev.find(
              (n) => n.type === "message" && n.relatedChatId === chat.id && n.userId === chat.userId
            );

            if (!existingNotification) {
              const newNotification: Notification = {
                id: Date.now(),
                type: "message",
                userId: chat.userId,
                userName: chat.userName,
                userAvatar: chat.userAvatar,
                message: lastMessage.attachment
                  ? lastMessage.attachment.type === "image"
                    ? "sent you a photo"
                    : lastMessage.attachment.type === "video"
                    ? "sent you a video"
                    : "sent you a file"
                  : lastMessage.text
                  ? `sent you a message: "${lastMessage.text.substring(0, 50)}${lastMessage.text.length > 50 ? "..." : ""}"`
                  : "sent you a message",
                timestamp: "Just now",
                isRead: false,
                relatedChatId: chat.id,
              };

              return [newNotification, ...prev];
            }
            return prev;
          });
        }
      }
    });
  }, [chatConversations, selectedChatId]);

  // Handle sending a message
  const handleSendMessage = () => {
    if ((!messageInput.trim() && !messageAttachment) || !selectedChatId) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      senderId: 0, // Current user
      text: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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

  // Handle file attachment
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video" | "file") => {
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
      reader.onerror = () => {
        alert("Error reading file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle attachment menu click
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

  // Handle Enter key to send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Extract all hashtags from posts
  const allHashtags = [
    ...new Set(
      posts
        .filter((p) => p.hashtags)
        .flatMap((p) =>
          p.hashtags!.split(" ").filter((tag) => tag.startsWith("#"))
        )
    ),
  ];

  // Search function
  const performSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      const queryLower = query.toLowerCase().trim();
      const results: SearchResult[] = [];

      // Search people
      allPeople.forEach((person) => {
        if (person.name.toLowerCase().includes(queryLower)) {
          const postCount = posts.filter((p) => p.userName === person.name)
            .length;
          results.push({
            type: "person",
            id: person.name,
            title: person.name,
            subtitle: postCount > 0 ? `${postCount} post${postCount > 1 ? "s" : ""}` : "User",
            avatar: person.avatar,
          });
        }
      });

      // Search hashtags
      allHashtags.forEach((hashtag) => {
        if (hashtag.toLowerCase().includes(queryLower)) {
          const postCount = posts.filter(
            (p) => p.hashtags && p.hashtags.includes(hashtag)
          ).length;
          results.push({
            type: "hashtag",
            id: hashtag,
            title: hashtag,
            subtitle: `${postCount} post${postCount !== 1 ? "s" : ""}`,
            postCount,
          });
        }
      });

      // Search posts by caption content
      posts.forEach((post) => {
        if (
          post.caption.toLowerCase().includes(queryLower) ||
          (post.hashtags && post.hashtags.toLowerCase().includes(queryLower))
        ) {
          // Check if this post is already represented by a person or hashtag
          const alreadyIncluded =
            results.some(
              (r) =>
                r.type === "person" &&
                r.title === post.userName &&
                r.id === post.userName
            ) ||
            (post.hashtags &&
              results.some(
                (r) =>
                  r.type === "hashtag" &&
                  post.hashtags!.split(" ").some((tag) => tag === r.id)
              ));

          if (!alreadyIncluded) {
            results.push({
              type: "post",
              id: post.id,
              title: `Post by ${post.userName}`,
              subtitle: post.caption.substring(0, 50) + "...",
              avatar: post.userAvatar,
            });
          }
        }
      });

      // Limit results to 10
      setSearchResults(results.slice(0, 10));
    },
    [allPeople, allHashtags, posts]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    performSearch(value);
  };

  // Handle search result click
  const handleSearchResultClick = (result: SearchResult) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchFocused(false);

    // Scroll to relevant content based on result type
    if (result.type === "person") {
      // Find and scroll to first post by this person
      const userPost = posts.find((p) => p.userName === result.title);
      if (userPost) {
        const postElement = document.querySelector(
          `[data-post-id="${userPost.id}"]`
        );
        postElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else if (result.type === "hashtag") {
      // Find and scroll to first post with this hashtag
      const hashtagPost = posts.find(
        (p) => p.hashtags && p.hashtags.includes(result.title)
      );
      if (hashtagPost) {
        const postElement = document.querySelector(
          `[data-post-id="${hashtagPost.id}"]`
        );
        postElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else if (result.type === "post") {
      // Scroll to the specific post
      const postElement = document.querySelector(
        `[data-post-id="${result.id}"]`
      );
      postElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
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
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setIsSearchFocused(false);
    }
    if (
      addFriendModalRef.current &&
      !addFriendModalRef.current.contains(event.target as Node)
    ) {
      // Don't close if clicking on the overlay itself (it will be handled by overlay onClick)
      const target = event.target as HTMLElement;
      if (!target.closest(".newsfeed-add-friend-modal")) {
        setIsAddFriendModalOpen(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isCreateMenuOpen || isSearchFocused || isAddFriendModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreateMenuOpen, isSearchFocused, isAddFriendModalOpen, handleClickOutside]);

  const handleCreateClick = () => {
    setIsCreateMenuOpen(!isCreateMenuOpen);
  };

  const handleCreatePost = () => {
    setIsCreateMenuOpen(false);
    // Add logic to open create post modal/form
  };

  const handleCreateStory = () => {
    setIsCreateMenuOpen(false);
    // Add logic to open create story modal/form
  };

  const handleCreateGroup = () => {
    setIsCreateMenuOpen(false);
    // Add logic to open create group modal/form
  };

  const handleCreateEvent = () => {
    setIsCreateMenuOpen(false);
    // Add logic to open create event modal/form
  };

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
          <div
            className="newsfeed-search-section"
            ref={searchRef}
          >
            <div className="newsfeed-search-section__input-wrapper">
              <input
                type="text"
                placeholder="Search people, hashtags, or posts..."
                className="newsfeed-search-section__input"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
              />
              <Search
                size={20}
                className="newsfeed-search-section__icon"
              />
            </div>
            {isSearchFocused && searchResults.length > 0 && (
              <div className="newsfeed-search-results">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}-${index}`}
                    className="newsfeed-search-result"
                    onClick={() => handleSearchResultClick(result)}
                  >
                    <div className="newsfeed-search-result__icon">
                      {result.type === "person" ? (
                        <User size={18} />
                      ) : result.type === "hashtag" ? (
                        <Hash size={18} />
                      ) : (
                        <FileText size={18} />
                      )}
                    </div>
                    {result.avatar && (
                      <img
                        src={result.avatar}
                        alt={result.title}
                        className="newsfeed-search-result__avatar"
                      />
                    )}
                    <div className="newsfeed-search-result__content">
                      <div className="newsfeed-search-result__title">
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="newsfeed-search-result__subtitle">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {isSearchFocused && searchQuery && searchResults.length === 0 && (
              <div className="newsfeed-search-results">
                <div className="newsfeed-search-result newsfeed-search-result--empty">
                  <div className="newsfeed-search-result__content">
                    <div className="newsfeed-search-result__title">
                      No results found
                    </div>
                    <div className="newsfeed-search-result__subtitle">
                      Try searching for a different name, hashtag, or keyword
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <StoriesSection 
            stories={stories} 
            userName={userName}
            userAvatar={getUserAvatar()}
            onStory={handleNewStory}
          />
          <CreatePostInput 
            userName={userName} 
            userAvatar={getUserAvatar()}
            onPost={handleNewPost}
          />

          {/* Good Morning Card */}
          {showGoodMorningCard && (
            <div className="newsfeed-goodmorning-card">
              <div className="newsfeed-goodmorning-card__icon">{greetingData.icon}</div>
              <div className="newsfeed-goodmorning-card__content">
                <p>
                  {greetingData.greeting}, {userName}! Write it on your heart that every day
                  is the best day in the year
                </p>
              </div>
              <button
                className="newsfeed-goodmorning-card__close"
                onClick={() => setShowGoodMorningCard(false)}
                aria-label="Close good morning card"
              >
                ×
              </button>
            </div>
          )}

          {/* Posts */}
          <div className="newsfeed-posts">
            {filteredHashtag && (
              <div className="newsfeed-hashtag-filter">
                <div className="newsfeed-hashtag-filter__content">
                  <span className="newsfeed-hashtag-filter__label">
                    Showing posts for:
                  </span>
                  <span className="newsfeed-hashtag-filter__hashtag">
                    {filteredHashtag}
                  </span>
                  <button
                    className="newsfeed-hashtag-filter__clear"
                    onClick={() => setFilteredHashtag(null)}
                    aria-label="Clear filter"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
            {posts
              .filter((post) => {
                if (!filteredHashtag) return true;
                return post.hashtags?.includes(filteredHashtag);
              })
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            {filteredHashtag &&
              posts.filter((post) =>
                post.hashtags?.includes(filteredHashtag)
              ).length === 0 && (
                <div className="newsfeed-no-posts">
                  <p>No posts found for {filteredHashtag}</p>
                </div>
              )}
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
          <TrendingSection
            trending={trending}
            onHashtagClick={(hashtag) => {
              setFilteredHashtag(hashtag);
              // Scroll to posts section
              setTimeout(() => {
                const postsSection = document.querySelector(".newsfeed-posts");
                postsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 100);
            }}
          />
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

      {/* Add Friend Modal */}
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
                <Search size={20} className="newsfeed-add-friend-modal__search-icon" />
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
                    <div key={person.id} className="newsfeed-add-friend-modal__item">
                      <LazyImage
                        src={person.avatar || "/placeholder-avatar.png"}
                        alt={person.name}
                        className="newsfeed-add-friend-modal__avatar"
                      />
                      <div className="newsfeed-add-friend-modal__info">
                        <p className="newsfeed-add-friend-modal__name">{person.name}</p>
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
                          // Handle add friend action
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

      {/* Chat Panel */}
      {isChatPanelOpen && (
        <div className="newsfeed-chat-panel-overlay" onClick={() => setIsChatPanelOpen(false)}>
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
                  <Search size={18} className="newsfeed-chat-panel__search-icon" />
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
                          selectedChatId === conversation.id ? "newsfeed-chat-panel__conversation-item--active" : ""
                        }`}
                        onClick={() => {
                          setSelectedChatId(conversation.id);
                          // Mark messages as read when opening chat
                          setChatConversations((prev) =>
                            prev.map((chat) =>
                              chat.id === conversation.id
                                ? {
                                    ...chat,
                                    messages: chat.messages.map((msg) => ({ ...msg, isRead: true })),
                                    unreadCount: 0,
                                  }
                                : chat
                            )
                          );
                        }}
                      >
                        <div className="newsfeed-chat-panel__conversation-avatar-wrapper">
                          <LazyImage
                            src={conversation.userAvatar || "/placeholder-avatar.png"}
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
                            src={selectedChat.userAvatar || "/placeholder-avatar.png"}
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
                      <div className="newsfeed-chat-panel__chat-menu-wrapper" ref={chatMenuRef}>
                        <button
                          ref={chatMenuButtonRef}
                          className="newsfeed-chat-panel__chat-menu-btn"
                          aria-label="More options"
                          onClick={() => setIsChatMenuOpen(!isChatMenuOpen)}
                        >
                          <MoreVertical size={20} />
                        </button>
                        {isChatMenuOpen && (
                          <div className="newsfeed-chat-panel__chat-menu-dropdown">
                            <button
                              className="newsfeed-chat-panel__chat-menu-item"
                              onClick={() => {
                                setIsChatMenuOpen(false);
                                if (selectedChat) {
                                  setSelectedProfileUserId(selectedChat.userId);
                                  setIsProfileModalOpen(true);
                                }
                              }}
                            >
                              <User size={18} />
                              <span>View Profile</span>
                            </button>
                            <button
                              className="newsfeed-chat-panel__chat-menu-item"
                              onClick={() => {
                                setIsChatMenuOpen(false);
                                console.log("Mute conversation");
                              }}
                            >
                              <Bell size={18} />
                              <span>Mute Notifications</span>
                            </button>
                            <button
                              className="newsfeed-chat-panel__chat-menu-item"
                              onClick={() => {
                                setIsChatMenuOpen(false);
                                console.log("Clear chat");
                              }}
                            >
                              <Trash2 size={18} />
                              <span>Clear Chat</span>
                            </button>
                            <button
                              className="newsfeed-chat-panel__chat-menu-item newsfeed-chat-panel__chat-menu-item--danger"
                              onClick={() => {
                                setIsChatMenuOpen(false);
                                if (window.confirm("Are you sure you want to delete this conversation?")) {
                                  setChatConversations((prev) =>
                                    prev.filter((chat) => chat.id !== selectedChatId)
                                  );
                                  setSelectedChatId(null);
                                }
                              }}
                            >
                              <X size={18} />
                              <span>Delete Conversation</span>
                            </button>
                          </div>
                        )}
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
                                src={selectedChat.userAvatar || "/placeholder-avatar.png"}
                                alt={selectedChat.userName}
                                className="newsfeed-chat-panel__message-avatar"
                              />
                            )}
                            <div className="newsfeed-chat-panel__message-content">
                              {message.attachment && (
                                <div className="newsfeed-chat-panel__message-attachment">
                                  {message.attachment.type === "image" && (
                                    <img
                                      src={message.attachment.url}
                                      alt="Attachment"
                                      style={{
                                        maxWidth: "300px",
                                        maxHeight: "300px",
                                        borderRadius: "8px",
                                        marginBottom: "8px",
                                      }}
                                    />
                                  )}
                                  {message.attachment.type === "video" && (
                                    <video
                                      src={message.attachment.url}
                                      controls
                                      style={{
                                        maxWidth: "300px",
                                        maxHeight: "300px",
                                        borderRadius: "8px",
                                        marginBottom: "8px",
                                      }}
                                    />
                                  )}
                                  {message.attachment.type === "file" && (
                                    <div
                                      style={{
                                        padding: "12px",
                                        backgroundColor: "rgba(0,0,0,0.05)",
                                        borderRadius: "8px",
                                        marginBottom: "8px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                      }}
                                    >
                                      <Paperclip size={20} />
                                      <div>
                                        <p style={{ margin: 0, fontWeight: 600 }}>
                                          {message.attachment.fileName || "File"}
                                        </p>
                                        {message.attachment.fileSize && (
                                          <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>
                                            {(message.attachment.fileSize / 1024).toFixed(2)} KB
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              {message.text && (
                                <p className="newsfeed-chat-panel__message-text">{message.text}</p>
                              )}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  marginTop: "4px",
                                }}
                              >
                                <span className="newsfeed-chat-panel__message-time">
                                  {message.timestamp}
                                </span>
                                {isCurrentUser && (
                                  <span
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      color: message.isRead ? "#4CAF50" : "#999",
                                      marginLeft: "4px",
                                    }}
                                    title={message.isRead ? "Read" : "Sent"}
                                  >
                                    {message.isRead ? (
                                      <CheckCircle size={14} fill="#4CAF50" color="#4CAF50" />
                                    ) : (
                                      <CheckCircle size={14} />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="newsfeed-chat-panel__input-area">
                      {messageAttachment && (
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "8px",
                            marginBottom: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {messageAttachment.type === "image" && <Image size={16} />}
                            {messageAttachment.type === "video" && <Video size={16} />}
                            {messageAttachment.type === "file" && <Paperclip size={16} />}
                            <span style={{ fontSize: "14px" }}>
                              {messageAttachment.fileName || "Attachment"}
                            </span>
                          </div>
                          <button
                            onClick={() => setMessageAttachment(null)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                            }}
                            aria-label="Remove attachment"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      <div
                        className="newsfeed-chat-panel__attachment-menu-wrapper"
                        ref={attachmentMenuRef}
                      >
                        <button
                          ref={attachmentButtonRef}
                          className="newsfeed-chat-panel__input-btn"
                          aria-label="Attach file"
                          title="Attach file"
                          onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
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
                          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
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

      {/* Profile Modal */}
      {isProfileModalOpen && selectedProfileUserId && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
            setSelectedProfileUserId(null);
          }}
          userId={selectedProfileUserId}
          userName={
            chatConversations.find((c) => c.userId === selectedProfileUserId)?.userName ||
            "User"
          }
          userAvatar={
            chatConversations.find((c) => c.userId === selectedProfileUserId)?.userAvatar ||
            "/placeholder-avatar.png"
          }
          isOnline={
            chatConversations.find((c) => c.userId === selectedProfileUserId)?.isOnline || false
          }
          onMessage={() => {
            const chat = chatConversations.find((c) => c.userId === selectedProfileUserId);
            if (chat) {
              setSelectedChatId(chat.id);
              setIsChatPanelOpen(true);
            }
          }}
          onAddFriend={() => {
            console.log("Add friend:", selectedProfileUserId);
            // Handle add friend action
          }}
        />
      )}

      {/* Notification Panel */}
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
                        !notification.isRead ? "newsfeed-notification-panel__item--unread" : ""
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div
                        className="newsfeed-notification-panel__icon-wrapper"
                        style={{ backgroundColor: `${getNotificationColor(notification.type)}20` }}
                      >
                        <div
                          className="newsfeed-notification-panel__icon"
                          style={{ color: getNotificationColor(notification.type) }}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      <div className="newsfeed-notification-panel__content-wrapper">
                        <div className="newsfeed-notification-panel__user-info">
                          <LazyImage
                            src={notification.userAvatar || "/placeholder-avatar.png"}
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

export default NewsFeed;
