import { Bot, User } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface AIChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export const AIChatMessage = ({ role, content, timestamp }: AIChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div 
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? "bg-accent text-accent-foreground" 
            : "bg-gradient-to-br from-amber-500 to-yellow-400"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4 text-slate-900" />
        )}
      </div>

      {/* Message */}
      <div className={`flex-1 max-w-[85%] ${isUser ? "text-right" : ""}`}>
        <div 
          className={`inline-block rounded-2xl px-4 py-3 ${
            isUser 
              ? "bg-accent text-accent-foreground rounded-tr-sm" 
              : "bg-muted rounded-tl-sm"
          }`}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="text-sm">
              <MarkdownRenderer content={content} />
            </div>
          )}
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground mt-1 block">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
};
