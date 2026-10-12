type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

/** Opens in a new tab, and tells screen readers so */
export function ExternalLink({ children, ...props }: ExternalLinkProps) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}
