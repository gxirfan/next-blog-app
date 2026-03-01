export interface SearchResult {
  id: number;
  type: "user" | "post" | "flow" | "tag" | "topic";
  title: string;
  description?: string;
  avatar?: string;
  url?: string;
}
