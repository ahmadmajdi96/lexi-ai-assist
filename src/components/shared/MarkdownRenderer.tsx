import { useMemo } from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className = "" }: MarkdownRendererProps) => {
  const formattedContent = useMemo(() => {
    if (!content) return "";
    
    let html = content
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-foreground">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-foreground">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-foreground">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold"><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted/50 rounded-lg p-4 my-4 overflow-x-auto text-sm font-mono border border-border"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      // Lists
      .replace(/^\d+\.\s+(.*$)/gm, '<li class="ml-6 list-decimal mb-1">$1</li>')
      .replace(/^[-*]\s+(.*$)/gm, '<li class="ml-6 list-disc mb-1">$1</li>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="my-6 border-border" />')
      // Blockquotes
      .replace(/^>\s+(.*$)/gm, '<blockquote class="border-l-4 border-accent pl-4 my-4 italic text-muted-foreground">$1</blockquote>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br />');
    
    // Wrap in paragraph
    if (!html.startsWith('<h') && !html.startsWith('<pre') && !html.startsWith('<ul') && !html.startsWith('<ol')) {
      html = `<p class="mb-3">${html}</p>`;
    }
    
    return html;
  }, [content]);

  return (
    <div 
      className={`prose prose-sm max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
};
