import Markdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ content }: { content: string }) {
  return <div className="prose-content max-w-none"><Markdown rehypePlugins={[rehypeSanitize]} remarkPlugins={[remarkGfm]}>{content}</Markdown></div>;
}