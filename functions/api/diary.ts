interface Env {
  GITHUB_TOKEN?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const headers: Record<string, string> = {
      "User-Agent": "Cloudflare Pages/Afterimage",
      "Accept": "application/vnd.github.v3+json"
    };

    if (context.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${context.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      "https://api.github.com/repos/Clovescence/Valerie/issues?state=open&creator=Clovescence&per_page=10",
      { headers }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch issues from GitHub");
    }

    const issues = await response.json();

    const entries = issues
      .filter((issue: any) => !issue.pull_request)
      .map((issue: any) => ({
        id: issue.id,
        title: issue.title,
        body: issue.body || "",
        date: new Date(issue.created_at).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
        url: issue.html_url,
        tags: issue.labels.map((label: any) => label.name)
      }));

    return new Response(JSON.stringify({ entries }), {
      headers: {
        "Content-Type": "application/json",
        // No caching: strictly real-time
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch diary entries" }), { status: 500 });
  }
};
