import ReactMarkdown from 'react-markdown';
import { Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { visit } from 'unist-util-visit';
import { getYoutubeEmbedUrl } from '../utils/general.js';

// Lines starting with "* " would otherwise be parsed as a bullet (CommonMark
// treats "-", "*", and "+" as equivalent list markers). Escaping the asterisk
// keeps it as literal text instead - only "-" stays a real bullet.
function escapeAsteriskBullets(text) {
  return text.replace(/^(\s*)\*(\s)/gm, '$1\\*$2');
}

// Personal markup convention: only the leading "*" itself is bold, the rest
// of the line stays normal. ("-" bullets get their own bold marker via CSS
// ::marker, since they become real <li> - see .farsiPost li::marker.)
function remarkBoldMarkedLines() {
  return (tree) => {
    visit(tree, 'paragraph', (node) => {
      const first = node.children[0];
      if (first?.type === 'text' && first.value.startsWith('*')) {
        const rest = first.value.slice(1);
        node.children = [
          { type: 'strong', children: [{ type: 'text', value: '*' }] },
          ...(rest ? [{ type: 'text', value: rest }] : []),
          ...node.children.slice(1)
        ];
      }
    });
  };
}

// A paragraph consisting of nothing but a single link - "[label](url)" alone
// on its own line - is a post author's markup for "embed this", not a link
// to render. Returns that link's href, or null for an ordinary paragraph.
function soleLinkHref(node) {
  const onlyChild = node?.children?.length === 1 ? node.children[0] : null;
  return onlyChild?.type === 'element' && onlyChild.tagName === 'a' ? onlyChild.properties?.href : null;
}

function YoutubeEmbed({ url }) {
  return (
    <span className="post-youtube-embed">
      <iframe
        src={url}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </span>
  );
}

// Block-level elements need the same className as <p> or they fall back to
// the default font/direction instead of the post's Farsi styling.
// skipEmbeds drops the video entirely (used for the truncated preview) -
// the embed only belongs on the full, selected-post page.
function blockComponents(className, { skipEmbeds = false } = {}) {
  const styled = (Tag) => ({ node, ...props }) => <Tag className={className} {...props} />;
  return {
    p: ({ node, children, ...props }) => {
      const embedUrl = getYoutubeEmbedUrl(soleLinkHref(node));
      if (embedUrl) return skipEmbeds ? null : <YoutubeEmbed url={embedUrl} />;
      return <p className={className} {...props}>{children}</p>;
    },
    li: styled('li'),
    ul: styled('ul'),
    ol: styled('ol'),
    h1: styled('h1'),
    h2: styled('h2'),
    h3: styled('h3'),
    h4: styled('h4'),
    h5: styled('h5'),
    h6: styled('h6')
  };
}

// Renders a post's raw markdown body. Shared by the preview list (blogComponent)
// and the full single-post page (singlePostComponent) across blog/review/noises.
// Pass maxLength + continueTo to get a truncated preview with an inline "/ادامه/" link;
// omit them to render the full body untruncated.
export default function PostMarkdown({ body, className, maxLength, continueTo }) {
  const shouldTruncate = maxLength != null && body.length > maxLength;
  const rawText = shouldTruncate ? body.slice(0, maxLength) : body;
  const text = escapeAsteriskBullets(rawText);

  if (!shouldTruncate) {
    return (
      <ReactMarkdown remarkPlugins={[remarkBoldMarkedLines]} components={blockComponents(className)}>
        {text}
      </ReactMarkdown>
    );
  }

  // Last top-level block (paragraph, list, heading, ...) in text, to decide
  // whether "..." /ادامه/ can be appended inline into a trailing <p>.
  const lastBlockText = (text.trim().split(/\n\s*\n/).pop() || '').trimStart();
  const lastBlockIsPlainParagraph = !/^(-|\\\*|#)/.test(lastBlockText);

  const ellipsisLink = (
    <span className="blog-preview-ellipsis">
      ...{' '}
      <Header as={Link} to={continueTo} size="tiny" className="blog-preview-link">
        {' ادامه '}
      </Header>
    </span>
  );

  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkBoldMarkedLines]}
        components={{
          ...blockComponents(className, { skipEmbeds: true }),
          p: ({ node, children, ...props }) => {
            const embedUrl = getYoutubeEmbedUrl(soleLinkHref(node));
            if (embedUrl) return null;
            const isLastParagraph = lastBlockIsPlainParagraph && node?.position?.end?.offset >= text.length - 2;
            return (
              <p className={className} {...props}>
                {children}
                {isLastParagraph && ellipsisLink}
              </p>
            );
          }
        }}
      >
        {text}
      </ReactMarkdown>
      {!lastBlockIsPlainParagraph && <p className={className}>{ellipsisLink}</p>}
    </>
  );
}
