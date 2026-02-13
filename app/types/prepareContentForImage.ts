export function prepareContentForImage(
  htmlContent: string | undefined | null,
  removeFirstImage = false
) {
  if (!htmlContent) return "";

  const API_URL =
    process.env.NEXT_PUBLIC_API_IMAGE_URL || "http://localhost:3000";

  let processedContent = htmlContent.replace(
    /src="\/?public\//g,
    `src="${API_URL}/public/`
  );

  if (removeFirstImage) {
    processedContent = processedContent.replace(
      /(<p[^>]*>)?\s*<img[^>]*>\s*(<\/p>)?/i,
      ""
    );
  }

  return processedContent;
}
