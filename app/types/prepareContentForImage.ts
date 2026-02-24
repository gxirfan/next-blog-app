import { ENV } from "@/config/env.config";

export function prepareContentForImage(
  htmlContent: string | undefined | null,
  removeFirstImage = false,
) {
  if (!htmlContent) return "";

  let processedContent = htmlContent.replace(
    /src="\/?\//g,
    `src="${ENV.API_IMAGE_URL}/`,
  );

  if (removeFirstImage) {
    processedContent = processedContent.replace(
      /(<p[^>]*>)?\s*<img[^>]*>\s*(<\/p>)?/i,
      "",
    );
  }

  return processedContent;
}
