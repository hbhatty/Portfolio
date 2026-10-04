import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "../lib/blog";

export const metadata: Metadata = {
  title: "writing",
  description: "writing my thoughts",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-24">
        <header>
          <Link
            href="/"
            className="font-mono text-xs text-zinc-400 underline-offset-4 hover:text-zinc-100 hover:underline"
          >
            ← Harshdeep Bhatty
          </Link>
          <h1 className="mt-12 text-2xl font-medium tracking-tight text-white">
            Writing
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            no ai, not proofread, and not edited. purely my thoughts and how i think.
          </p>
        </header>

        {posts.length > 0 && (
          <section aria-label="Writing posts" className="mt-12">
            <ol className="divide-y divide-white/10 border-y border-white/10">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <h3 className="text-sm text-zinc-100 underline-offset-4 group-hover:underline">
                        {post.title}
                      </h3>
                      <time
                        dateTime={post.publishedAt}
                        className="shrink-0 font-mono text-xs text-zinc-400"
                      >
                        {post.displayDate}
                      </time>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {post.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </main>
  );
}
