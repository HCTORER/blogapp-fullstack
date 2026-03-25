export const extractTags = (content?: string) => {
  if (!content) return { tags: [], cleanContent: "" };

  const tagMatch = content.match(/\[TAGS\]([\s\S]*?)\[\/TAGS\]/);

  if (!tagMatch) return { tags: [], cleanContent: content };

  const tags = tagMatch[1]
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const cleanContent = content.replace(tagMatch[0], "").trim();

  return { tags, cleanContent };
};
