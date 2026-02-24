export interface SearchResult {
  id: string;
  type: "user" | "post" | "flow" | "tag" | "topic";
  title: string;
  description?: string;
  avatar?: string;
  url?: string;
}
