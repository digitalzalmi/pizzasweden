import { useCallback, useEffect, useMemo, useState } from "react";
import { getDefaultContent } from "../data/siteContent";
import { fetchContent } from "../api";
import { ContentContext } from "./contentStore";

export { useContent } from "./contentStore";

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => getDefaultContent());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const data = await fetchContent();
      if (data?.content?.menu) {
        setContent(data.content);
        setError("");
      }
    } catch (err) {
      setError(err.message || "Could not load live content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      ...content,
      content,
      setContent,
      loading,
      error,
      refresh,
    }),
    [content, loading, error, refresh],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
