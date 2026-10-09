import type { ArticleBodyBlock } from "@/lib/content/contracts";
import { ArticleMedia } from "@/components/content/article-media";
import { LocalizedText } from "@/components/layout/site-preferences";

export function ArticleBody({ blocks }: { blocks: ArticleBodyBlock[] }) {
  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "paragraph":
            return (
              <p key={key}>
                <LocalizedText ne={block.text} />
              </p>
            );
          case "heading":
            return block.level === 2 ? (
              <h2 key={key}>
                <LocalizedText ne={block.text} />
              </h2>
            ) : (
              <h3 key={key}>
                <LocalizedText ne={block.text} />
              </h3>
            );
          case "image":
          case "video":
            return <ArticleMedia key={key} media={block.media} />;
          case "quote":
            return (
              <blockquote key={key}>
                <p>
                  <LocalizedText ne={block.text} />
                </p>
                {block.attribution ? (
                  <cite>
                    <LocalizedText ne={block.attribution} />
                  </cite>
                ) : null}
              </blockquote>
            );
          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List key={key}>
                {block.items.map((item) => (
                  <li key={item}>
                    <LocalizedText ne={item} />
                  </li>
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
