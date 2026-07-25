import { renderBoldQuotes } from '../utils/general.js';

// A line containing Arabic-script (covers Persian) or Hebrew characters reads RTL.
const RTL_PATTERN = /\p{Script=Arabic}|\p{Script=Hebrew}/u;

// Renders a shuffled reader comment as a few big lines, aligning (and setting
// text direction for) each line to match its own script - RTL lines read
// right-to-left and sit right, LTR lines read left-to-right and sit left.
// Line breaks are explicit (blank-line-separated blocks in comments.txt), authored by hand rather
// than computed, so where a comment splits is never a guess.
// Used to fill the "empty square" slots woven into the postbox photo grid.
export default function CommentPlaceholder({ comment }) {
  const lines = comment.split("\n");

  return (
    <div className="commentPlaceHolder">
      {lines.map((line, idx) => {
        const isRtl = RTL_PATTERN.test(line);
        return (
          <p
            key={idx}
            dir={isRtl ? "rtl" : "ltr"}
            className={`postbox-comment-text ${isRtl ? "right" : ""}`}
          >
            {renderBoldQuotes(line)}
          </p>
        );
      })}
    </div>
  );
}
