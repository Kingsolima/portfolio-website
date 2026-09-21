import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx";

const prettyCodeOptions: Options = {
  // Dark theme with warm orange accents — sits well with the amber HUD palette.
  theme: "vesper",
  // We style <pre> ourselves in globals.css.
  keepBackground: false,
  defaultLang: "plaintext",
};

/** Compile an MDX body (frontmatter already stripped) into React nodes. */
export async function renderMdx(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
      },
    },
  });
  return content;
}
