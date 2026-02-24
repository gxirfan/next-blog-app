"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/api/axios";
import { IFlow } from "@/app/types/flow";

interface RepliesHookResult {
  replies: IFlow[];
  loading: boolean;
  error: string | null;
  meta: Record<string, unknown>;
}

export const useReplies = (slug: string): RepliesHookResult => {
  const [replies, setReplies] = useState<IFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<Record<string, unknown>>({});

  const fetchReplies = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/flow/${slug}/replies?page=1&limit=20`);

      if (response.data.success) {
        const fetchedData = response.data.data.data.data;
        const safeReplies = Array.isArray(fetchedData) ? fetchedData : [];

        setReplies(safeReplies);
        setMeta(response.data.data.data.meta || {});
      } else {
        setError(response.data.message || "Failed to load replies.");
        setReplies([]);
      }
    } catch (err) {
      setError("Could not connect to the API or network error.");
      console.error("Replies fetch error:", err);
      setReplies([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);

  return { replies, loading, error, meta };
};
