import type { Components } from "react-markdown";

export const markdownComponents: Components = {
  p: (props) => <p className="mb-3 last:mb-0" {...props} />,
  a: (props) => (
    <a
      className="text-secondary-text underline underline-offset-2 hover:opacity-80"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="text-primary font-semibold" {...props} />
  ),
  em: (props) => <em className="italic" {...props} />,
  code: (props) => (
    <code
      className="px-1 py-0.5 rounded bg-secondary text-xs font-mono text-primary"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="list-disc list-outside pl-5 space-y-1 mb-3 last:mb-0"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal list-outside pl-5 space-y-1 mb-3 last:mb-0"
      {...props}
    />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
};
