import { POSTBOX_MAX_COMMENT_LINES } from '../utils/constants.js';
import { renderBoldQuotes } from '../utils/general.js';

// Renders a shuffled reader comment as a few big lines, alternating
// left/right alignment. Used to fill the "empty square" slots woven into
// both the postbox and metro photo grids.
export default function CommentPlaceholder({ comment, seed }) {
  const words = comment.split(" ");
  const lines =
    words.length <= POSTBOX_MAX_COMMENT_LINES
      ? words
      : [words[0], words[1], words.slice(2).join(" ")];

  return (
    <div className="commentPlaceHolder">
      {lines.map((line, idx) => {
        const textAlign = (seed + idx) % 2 === 0 ? "right" : "left";
        return (
          <p
            key={idx}
            className={`postbox-comment-text ${textAlign === "right" ? "right" : ""}`}
          >
            {renderBoldQuotes(line)}
          </p>
        );
      })}
    </div>
  );
}
