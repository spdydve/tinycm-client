export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  heroImageUrl: string;
  tags: Tag[];
  author: Author;
  seo: {
    title: string;
    description: string;
    image: string;
  };
  publishedDate: Date;
};

export type Author = {
  name: string;
  slug: string;
};

export type Tag = {
  name: string;
  slug: string;
};

export type GetPostsResponse = {
  posts: Post[];
  metadata: {}
};

export type GetPostsByAuthorResponse = {
  posts: Post[];
  metadata: {
    author: Author
  }
};

export type GetPostsByTagResponse = {
  posts: Post[];
  metadata: {
    tag: Tag
  }
};