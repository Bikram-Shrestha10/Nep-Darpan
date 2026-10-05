import type { ArticleBodyBlock } from "@/lib/content/contracts";
import { ArticleMedia } from "@/components/content/article-media";

export function ArticleBody({ blocks }: { blocks: ArticleBodyBlock[] }) {
  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "paragraph":
            return <p key={key}>{block.text}</p>;
          case "heading":
            return block.level === 2 ? (
              <h2 key={key}>{block.text}</h2>
            ) : (
              <h3 key={key}>{block.text}</h3>
            );
          case "image":
          case "video":
            return <ArticleMedia key={key} media={block.media} />;
          case "quote":
            return (
              <blockquote key={key}>
                <p>{block.text}</p>
                {block.attribution ? <cite>{block.attribution}</cite> : null}
              </blockquote>
            );
          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List key={key}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </List>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
