import "server-only";

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  displayDate: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
  draft: boolean;
};

function getMarkdownFiles() {
  if (!fs.existsSync(BLOG_DIRECTORY)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_DIRECTORY, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name);
}

function requiredString(
  attributes: Record<string, unknown>,
  key: "title" | "description" | "date",
  filename: string,
) {
  const value = attributes[key];

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${filename} is missing a valid \"${key}\" value.`);
  }

  return value.trim();
}

function readPost(filename: string): BlogPost {
  const source = fs.readFileSync(path.join(BLOG_DIRECTORY, filename), "utf8");
  const { data, content } = matter(source);
  const title = requiredString(data, "title", filename);
  const description = requiredString(data, "description", filename);
  const publishedAt = requiredString(data, "date", filename);
  const publishedDate = new Date(`${publishedAt}T00:00:00Z`);

  if (Number.isNaN(publishedDate.getTime())) {
    throw new Error(`${filename} has an invalid \"date\" value.`);
  }

  return {
    slug: filename.slice(0, -3),
    title,
    description,
    publishedAt,
    displayDate: new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(publishedDate),
    draft: data.draft === true,
    content,
  };
}

export const getAllBlogPosts = cache((): BlogPostMeta[] =>
  getMarkdownFiles()
    .map(readPost)
    .filter((post) => !post.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      publishedAt: post.publishedAt,
      displayDate: post.displayDate,
    })),
);

export const getBlogPost = cache((slug: string): BlogPost | undefined => {
  const filename = getMarkdownFiles().find((file) => file.slice(0, -3) === slug);

  if (!filename) {
    return undefined;
  }

  const post = readPost(filename);
  return post.draft ? undefined : post;
});
