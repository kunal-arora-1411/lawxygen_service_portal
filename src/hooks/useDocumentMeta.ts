import { useEffect } from "react";

function setMetaDescription(content: string) {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = "description";
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function useDocumentMeta(title?: string, description?: string) {
  useEffect(() => {
    if (!title) return;

    const previousTitle = document.title;
    const previousDescription = document
      .querySelector<HTMLMetaElement>('meta[name="description"]')
      ?.content;

    document.title = title;
    if (description) setMetaDescription(description);

    return () => {
      document.title = previousTitle;
      if (previousDescription !== undefined) setMetaDescription(previousDescription);
    };
  }, [title, description]);
}
