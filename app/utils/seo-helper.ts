export const createCleanDescription = (
  content: string,
  limit: number = 160,
) => {
  if (!content) return "";

  const cleanText = content
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (cleanText.length <= limit) return cleanText;

  const truncated = cleanText.substring(0, limit);
  const lastSpace = truncated.lastIndexOf(" ");

  return truncated.substring(0, lastSpace > 0 ? lastSpace : limit) + "...";
};
