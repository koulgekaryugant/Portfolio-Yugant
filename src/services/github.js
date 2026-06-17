/**
 * GitHub API service
 * Fetches live profile, repository, event, and contribution data.
 * Results are cached in sessionStorage for 5 minutes to avoid redundant calls.
 *
 * Environment variables:
 *   VITE_GITHUB_USERNAME  – GitHub username (defaults to koulgekaryugant)
 *   VITE_GITHUB_TOKEN     – Optional PAT for higher rate limits (60 → 5,000 req/hr)
 */

const USERNAME = import.meta.env.VITE_GITHUB_USERNAME || "koulgekaryugant";
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN || "";
const CACHE_KEY = "portfolio-gh-stats-v2";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ---------------------------------------------------------------------------
// Network helpers
// ---------------------------------------------------------------------------

function buildHeaders() {
  const h = { Accept: "application/vnd.github.v3+json" };
  if (TOKEN) h.Authorization = `Bearer ${TOKEN}`;
  return h;
}

async function ghFetch(path) {
  const url = path.startsWith("http") ? path : `https://api.github.com${path}`;
  const res = await fetch(url, { headers: buildHeaders() });
  if (!res.ok) {
    if (res.status === 403 || res.status === 429) {
      throw new Error("GitHub API rate limit reached. Set VITE_GITHUB_TOKEN to increase the limit to 5,000 req/hr.");
    }
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Data processors
// ---------------------------------------------------------------------------

function computeLanguageStats(repos) {
  const tally = {};
  let total = 0;
  for (const repo of repos) {
    if (repo.language && !repo.fork) {
      tally[repo.language] = (tally[repo.language] || 0) + 1;
      total++;
    }
  }
  if (!total) return [];
  return Object.entries(tally)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / total) * 100)
    }));
}

function extractCommitsAndActivity(events) {
  const commits = [];
  const activity = [];

  const activityLabels = {
    PushEvent: "Push",
    CreateEvent: "Create",
    PullRequestEvent: "Pull Request",
    IssuesEvent: "Issue",
    WatchEvent: "Starred",
    ForkEvent: "Fork",
    DeleteEvent: "Delete",
    ReleaseEvent: "Release",
    IssueCommentEvent: "Comment",
    PullRequestReviewEvent: "Review"
  };

  for (const event of events) {
    if (event.type === "PushEvent" && commits.length < 12) {
      for (const commit of event.payload?.commits ?? []) {
        if (commits.length >= 12) break;
        commits.push({
          message: commit.message.split("\n")[0].slice(0, 76),
          repo: (event.repo.name.split("/")[1] ?? event.repo.name),
          date: event.created_at,
          url: `https://github.com/${event.repo.name}/commit/${commit.sha}`
        });
      }
    }
    if (activity.length < 10) {
      activity.push({
        type: activityLabels[event.type] ?? event.type.replace("Event", ""),
        repo: event.repo.name.split("/")[1] ?? event.repo.name,
        date: event.created_at
      });
    }
  }

  return { commits, activity };
}

function processContribData(raw) {
  const days = Array.isArray(raw?.contributions) ? raw.contributions : [];
  if (!days.length) return { heatmap: [], trends: [], total: 0, streak: 0 };

  // Heatmap: last 182 days (26 weeks) for the panel visualization
  const heatmap = days.slice(-182).map((d) => ({ date: d.date, count: d.count }));

  // Streak: consecutive days with >0 contributions going backwards from today
  let streak = 0;
  const todayStr = new Date().toISOString().slice(0, 10);
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i];
    if (d.count > 0) {
      streak++;
    } else if (d.date !== todayStr) {
      break;
    }
  }

  // Weekly trends: aggregate into 12 most-recent weekly buckets
  const weekBuckets = [];
  for (let i = days.length - 1; i >= 0 && weekBuckets.length < 12; i -= 7) {
    const slice = days.slice(Math.max(0, i - 6), i + 1);
    const count = slice.reduce((s, d) => s + d.count, 0);
    const startDate = slice[0]?.date ?? "";
    const label = startDate
      ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
          new Date(startDate + "T00:00:00")
        )
      : "";
    weekBuckets.unshift({ label, count, startDate });
  }

  const total = days.reduce((s, d) => s + d.count, 0);
  return { heatmap, trends: weekBuckets, total, streak };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function getGitHubStats() {
  // Read session cache
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts < CACHE_TTL) return data;
    }
  } catch { /* ignore storage errors */ }

  // Fetch all data sources in parallel
  const [profileRes, reposRes, eventsRes, contribRes] = await Promise.allSettled([
    ghFetch(`/users/${USERNAME}`),
    ghFetch(`/users/${USERNAME}/repos?sort=pushed&per_page=100&type=owner`),
    ghFetch(`/users/${USERNAME}/events?per_page=100`),
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`).then((r) => {
      if (!r.ok) throw new Error("contributions API unavailable");
      return r.json();
    })
  ]);

  const profile  = profileRes.status  === "fulfilled" ? profileRes.value  : {};
  const repos    = reposRes.status    === "fulfilled" ? reposRes.value    : [];
  const events   = eventsRes.status   === "fulfilled" ? eventsRes.value   : [];
  const contribRaw = contribRes.status === "fulfilled" ? contribRes.value : {};

  const { commits, activity } = extractCommitsAndActivity(events);
  const { heatmap, trends, total, streak } = processContribData(contribRaw);

  const repoStats = [...repos]
    .filter((r) => !r.fork)
    .sort(
      (a, b) =>
        b.stargazers_count + b.forks_count - (a.stargazers_count + a.forks_count)
    )
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language ?? "—",
      url: r.html_url,
      description: r.description ?? ""
    }));

  const data = {
    profileUrl:           profile.html_url      ?? `https://github.com/${USERNAME}`,
    avatarUrl:            profile.avatar_url     ?? "",
    name:                 profile.name           ?? USERNAME,
    totalRepos:           profile.public_repos   ?? repos.length,
    followers:            profile.followers      ?? "—",
    following:            profile.following      ?? "—",
    totalContributions:   total                  || "—",
    contributionStreak:   streak                 || "—",
    recentCommits:        commits,
    recentActivity:       activity,
    topLanguages:         computeLanguageStats(repos),
    repositoryStats:      repoStats,
    contributionHeatmap:  heatmap,
    contributionTrends:   trends,
    contributionSource:   TOKEN
      ? "GitHub API · Authenticated"
      : "GitHub Public API · Add VITE_GITHUB_TOKEN for higher limits"
  };

  // Write to session cache
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* ignore */ }

  return data;
}
