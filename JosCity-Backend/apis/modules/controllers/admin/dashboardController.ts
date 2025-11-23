import { Request, Response } from "express";
import db from "../../config/database";

// we get dashboard insights first
export const getDashboard = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const insights = await getDashboardInsights();
    const chartData = await getChartData();

    res.json({
      success: true,
      data: {
        insights,
        chart: chartData,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};

const getDashboardInsights = async (): Promise<any> => {
  const insights: any = {};

  // Total users
  const [users] = (await db.execute("SELECT COUNT(*) as count FROM users")) as [
    any[],
    any
  ];
  insights.totalUsers = users[0].count;

  // Pending approvals
  const [pending] = (await db.execute(
    'SELECT COUNT(*) as count FROM users WHERE user_approved = "0" AND account_status = "pending"'
  )) as [any[], any];
  insights.pendingApprovals = pending[0].count;

  // Not activated
  const [notActivated] = (await db.execute(
    'SELECT COUNT(*) as count FROM users WHERE user_activated = "0"'
  )) as [any[], any];
  insights.notActivated = notActivated[0].count;

  // Banned users or rejected users
  const [banned] = (await db.execute(
    'SELECT COUNT(*) as count FROM users WHERE user_banned = "1"'
  )) as [any[], any];
  insights.bannedUsers = banned[0].count;

  // Online users (last 15 minutes)
  const [online] = (await db.execute(
    "SELECT COUNT(*) as count FROM users WHERE user_last_seen >= DATE_SUB(NOW(), INTERVAL 15 MINUTE)"
  )) as [any[], any];
  insights.onlineUsers = online[0].count;

  // Total posts
  const [posts] = (await db.execute("SELECT COUNT(*) as count FROM posts")) as [
    any[],
    any
  ];
  insights.totalPosts = posts[0].count;

  // Total comments
  const [comments] = (await db.execute(
    "SELECT COUNT(*) as count FROM posts_comments"
  )) as [any[], any];
  insights.totalComments = comments[0].count;

  // Total pages
  const [pages] = (await db.execute("SELECT COUNT(*) as count FROM pages")) as [
    any[],
    any
  ];
  insights.totalPages = pages[0].count;

  // Total groups
  const [groups] = (await db.execute(
    "SELECT COUNT(*) as count FROM groups"
  )) as [any[], any];
  insights.totalGroups = groups[0].count;

  // Total events
  const [events] = (await db.execute(
    "SELECT COUNT(*) as count FROM events"
  )) as [any[], any];
  insights.totalEvents = events[0].count;

  // Pending reports
  const [reports] = (await db.execute(
    'SELECT COUNT(*) as count FROM reports WHERE seen = "0"'
  )) as [any[], any];
  insights.pendingReports = reports[0].count;

  // Pending verification requests
  const [verifications] = (await db.execute(
    'SELECT COUNT(*) as count FROM verification_requests WHERE status = "0"'
  )) as [any[], any];
  insights.pendingVerifications = verifications[0].count;

  return insights;
};

const getChartData = async (): Promise<any> => {
  const chart: any = {
    users: {},
    posts: {},
    pages: {},
    groups: {},
  };

  // Get last 12 months data
  for (let i = 1; i <= 12; i++) {
    // Users this month
    const [monthUsers] = (await db.execute(
      "SELECT COUNT(*) as count FROM users WHERE YEAR(user_registered) = YEAR(CURRENT_DATE()) AND MONTH(user_registered) = ?",
      [i]
    )) as [any[], any];
    chart.users[i] = monthUsers[0].count;

    // Posts this month
    const [monthPosts] = (await db.execute(
      "SELECT COUNT(*) as count FROM posts WHERE YEAR(time) = YEAR(CURRENT_DATE()) AND MONTH(time) = ?",
      [i]
    )) as [any[], any];
    chart.posts[i] = monthPosts[0].count;

    // Pages this month
    const [monthPages] = (await db.execute(
      "SELECT COUNT(*) as count FROM pages WHERE YEAR(page_date) = YEAR(CURRENT_DATE()) AND MONTH(page_date) = ?",
      [i]
    )) as [any[], any];
    chart.pages[i] = monthPages[0].count;

    // Groups this month
    const [monthGroups] = (await db.execute(
      "SELECT COUNT(*) as count FROM groups WHERE YEAR(group_date) = YEAR(CURRENT_DATE()) AND MONTH(group_date) = ?",
      [i]
    )) as [any[], any];
    chart.groups[i] = monthGroups[0].count;
  }

  return chart;
};
