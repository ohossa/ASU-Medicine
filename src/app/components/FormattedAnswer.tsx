import React from "react";

interface FormattedAnswerProps {
  text: string;
  query?: string;
}

const HighlightText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query.trim()) return <>{text}</>;
  const safe = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${safe})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <mark
            key={i}
            className="rounded-[3px] px-0.5 bg-amber-500/25 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 font-medium"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export const renderTextWithFormatting = (text: string, query?: string) => {
  if (!text) return null;
  // Split by "**" to identify bold sections
  const boldParts = text.split(/\*\*([^*]+)\*\*/g);
  return boldParts.map((part, index) => {
    const isBold = index % 2 === 1;
    return isBold ? (
      <strong className="font-bold text-gray-900 dark:text-white" key={index}>
        {query ? <HighlightText text={part} query={query} /> : part}
      </strong>
    ) : (
      <span key={index}>
        {query ? <HighlightText text={part} query={query} /> : part}
      </span>
    );
  });
};

export const FormattedAnswer: React.FC<FormattedAnswerProps> = ({ text, query }) => {
  if (!text) return null;

  const lines = text.split(/\r?\n/);
  const blocks: { type: "text" | "table"; content: string[] }[] = [];

  for (const line of lines) {
    const isTableLine = line.trim().startsWith("|") && line.trim().endsWith("|");
    if (isTableLine) {
      if (blocks.length > 0 && blocks[blocks.length - 1].type === "table") {
        blocks[blocks.length - 1].content.push(line);
      } else {
        blocks.push({ type: "table", content: [line] });
      }
    } else {
      if (blocks.length > 0 && blocks[blocks.length - 1].type === "text") {
        blocks[blocks.length - 1].content.push(line);
      } else {
        blocks.push({ type: "text", content: [line] });
      }
    }
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, blockIdx) => {
        if (block.type === "table") {
          const rawRows = block.content;
          if (rawRows.length === 0) return null;

          const headerLine = rawRows[0];
          const headers = headerLine
            .split("|")
            .map((s) => s.trim())
            .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

          const hasDivider = rawRows[1] && rawRows[1].includes("---");
          const dataStartIndex = hasDivider ? 2 : 1;

          const dataRows = rawRows.slice(dataStartIndex).map((rowStr) => {
            return rowStr
              .split("|")
              .map((s) => s.trim())
              .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          });

          return (
            <div key={blockIdx} className="my-4 overflow-x-auto rounded-2xl border border-gray-200/80 dark:border-white/[0.08] shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-white/[0.08] border-collapse">
                <thead className="bg-gray-50/75 dark:bg-white/[0.02]">
                  <tr>
                    {headers.map((h, hIdx) => (
                      <th
                        key={hIdx}
                        className="px-4 py-3 text-start text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider border-b border-gray-200 dark:border-white/[0.08]"
                      >
                        {renderTextWithFormatting(h, query)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-white/[0.05] bg-white/40 dark:bg-neutral-900/10">
                  {dataRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-gray-50/40 dark:hover:bg-white/[0.01] transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-2.5 text-sm text-gray-700 dark:text-neutral-300 align-top">
                          {renderTextWithFormatting(cell, query)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        } else {
          const textLines = block.content;
          return (
            <div key={blockIdx} className="space-y-2">
              {textLines.map((line, lineIdx) => {
                const trimmed = line.trim();
                // Check if it is a list item starting with a bullet
                if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
                  const content = trimmed.substring(1).trim();
                  return (
                    <div key={lineIdx} className="flex items-start gap-2.5 pl-1.5 py-0.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <div className="text-gray-700 dark:text-neutral-300 text-[14px] leading-relaxed">
                        {renderTextWithFormatting(content, query)}
                      </div>
                    </div>
                  );
                }
                return (
                  <p key={lineIdx} className="text-gray-700 dark:text-neutral-300 text-[14px] leading-relaxed whitespace-pre-wrap">
                    {renderTextWithFormatting(line, query)}
                  </p>
                );
              })}
            </div>
          );
        }
      })}
    </div>
  );
};
