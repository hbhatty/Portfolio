import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ThemeToggle from "../../components/ThemeToggle";
import { getAllBlogPosts, getBlogPost } from "../../lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Writing | Harshdeep Bhatty" };
  }

  return {
    title: `${post.title} | Harshdeep Bhatty`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <article className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
        <header className="border-b border-border pb-10">
          <div className="flex items-center justify-between">
            <Link
              href="/blog"
              className="font-mono text-xs text-muted underline-offset-4 hover:text-heading hover:underline"
            >
              ← All writing
            </Link>
            <ThemeToggle />
          </div>
          <h1 className="mt-12 text-3xl font-medium leading-tight tracking-tight text-heading sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            {post.description}
          </p>
          <time
            dateTime={post.publishedAt}
            className="mt-6 block font-mono text-xs text-muted"
          >
            {post.displayDate}
          </time>
        </header>

        <div className="pt-10">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => (
                <h2 className="mb-4 mt-12 text-xl font-medium tracking-tight text-heading first:mt-0">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mb-3 mt-10 text-base font-medium text-heading">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="my-5 text-base leading-8 text-foreground">{children}</p>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={href?.startsWith("http") ? "noreferrer" : undefined}
                  className="text-heading underline decoration-subtle underline-offset-4 hover:decoration-heading"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="my-5 list-disc space-y-2 pl-6 text-base leading-8 text-foreground">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="my-5 list-decimal space-y-2 pl-6 text-base leading-8 text-foreground">
                  {children}
                </ol>
              ),
              blockquote: ({ children }) => (
                <blockquote className="my-7 border-l-2 border-border pl-5 italic text-muted">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-sm text-foreground">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="my-7 overflow-x-auto rounded border border-border bg-surface p-4 font-mono text-sm leading-6 text-foreground [&_code]:bg-transparent [&_code]:p-0">
                  {children}
                </pre>
              ),
              hr: () => <hr className="my-10 border-border" />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
