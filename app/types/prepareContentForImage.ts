import { ENV } from "@/config/env.config";

export function prepareContentForImage(
  htmlContent: string | undefined | null,
  removeFirstImage = false,
) {
  if (!htmlContent) return "";

  let processedContent = htmlContent.replace(
    /src="\/?public\//g,
    `src="${ENV.API_IMAGE_URL}/public/`,
  );

  if (removeFirstImage) {
    processedContent = processedContent.replace(
      /(<p[^>]*>)?\s*<img[^>]*>\s*(<\/p>)?/i,
      "",
    );
  }

  return processedContent;
}
