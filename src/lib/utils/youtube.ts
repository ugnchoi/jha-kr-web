export const getYouTubeVideoId = (input: string): string | null => {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return null;
  }

  const isLikelyId = /^[a-zA-Z0-9_-]{6,}$/.test(trimmedInput);
  if (isLikelyId) {
    return trimmedInput;
  }

  try {
    const url = new URL(trimmedInput);
    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      const idFromPath = url.pathname.split("/").filter(Boolean)[0];
      return idFromPath && /^[a-zA-Z0-9_-]{6,}$/.test(idFromPath) ? idFromPath : null;
    }

    if (hostname.endsWith("youtube.com")) {
      const pathParts = url.pathname.split("/").filter(Boolean);

      if (url.pathname === "/watch") {
        const idFromQuery = url.searchParams.get("v");
        return idFromQuery && /^[a-zA-Z0-9_-]{6,}$/.test(idFromQuery) ? idFromQuery : null;
      }

      if (pathParts[0] === "embed" && pathParts[1]) {
        return /^[a-zA-Z0-9_-]{6,}$/.test(pathParts[1]) ? pathParts[1] : null;
      }

      if (pathParts[0] === "shorts" && pathParts[1]) {
        return /^[a-zA-Z0-9_-]{6,}$/.test(pathParts[1]) ? pathParts[1] : null;
      }
    }
  } catch {
    return null;
  }

  return null;
};


