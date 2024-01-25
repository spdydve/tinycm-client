import {
  Author,
  GetPostsByAuthorResponse,
  GetPostsByTagResponse,
  GetPostsResponse,
  Post,
  Tag,
} from "./types";

function logError(...args: any[]) {
  console.error("[ERROR] ", ...args);
}

function throwError(msg: string, ...args: any[]) {
  logError(msg, ...args);
  throw new Error(msg);
}

function createDebugger(debug: boolean) {
  return (...args: any[]) => {
    if (debug) {
      console.log("[DEBUG]", ...args);
    }
  };
}

export type ClientConfiguration = {
  apiKey: string;
  projectId: string;
  version: "v1";
  debug?: boolean;
  _baseUrl?: string;
};

function setConfig(
  apiKey: string,
  projectId: string,
  version: string,
  _baseUrl?: string
): { url: string; headers: HeadersInit } {
  if (!apiKey) {
    throwError("apiKey is required");
  }

  if (!projectId) {
    throwError("projectId is required");
  }

  const baseUrl = _baseUrl ?? "https://tinycm.com";

  const apiUrl = `${baseUrl}/api/${version}/content`;

  return {
    url: apiUrl,
    headers: {
      "x-api-key": apiKey,
      "x-project-id": projectId,
      "Content-Type": "application/json",
    },
  };
}

export function createClient({
  apiKey,
  projectId,
  version,
  debug,
  _baseUrl,
}: ClientConfiguration) {
  const clientConfig = setConfig(apiKey, projectId, version, _baseUrl);
  const log = createDebugger(debug || false);
  log("createClient ", clientConfig);

  async function request(path: string, params?: Object) {
    const url =
      clientConfig.url +
      path +
      (!!params ? `?${new URLSearchParams(params as any).toString()}` : "");

    log({ url, path, params });

    const response = await fetch(url, { headers: clientConfig.headers });

    if (!response.ok) {
      throwError("Error fetching data from API", response);
    }

    return await response.json();
  }

  return {
    posts: {
      getAll: async function (
        params?: { limit?: number; page?: number } | undefined
      ): Promise<GetPostsResponse> {
        return await request("/posts", {
          sort: "publishedDate:desc",
          limit: params?.limit || 10,
          page: params?.page || 0,
        });
      },
      getBySlug: async function (slug: string): Promise<Post> {
        return await request("/posts/" + slug);
      },
      getAllByTag: async function (
        tag: string,
        params?: { limit?: number; page?: number } | undefined
      ): Promise<GetPostsByTagResponse> {
        return await request("/posts/tag/" + tag, {
          sort: 'publishedDate:desc',
          limit: params?.limit || 25,
          page: params?.page || 0,
        });
      },
      getAllByAuthor: async function (
        author: string,
        params?: { limit?: number; page?: number } | undefined
      ): Promise<GetPostsByAuthorResponse> {
        return await request("/posts/author/" + author, {
          sort: 'publishedDate:desc',
          limit: params?.limit || 10,
          page: params?.page || 0,
        });
      },
      getAllSlugs: async function (): Promise<string[]> {
        return await request("/posts/slugs");
      },
    },
    authors: {
      getAll: async function (
        params?: { limit?: number; page?: number } | undefined
      ): Promise<Author[]> {
        return await request("/authors", {
          limit: params?.limit || 10,
          page: params?.page || 0,
        });
      },
    },
    tags: {
      getAll: async function (
        params?: { limit?: number; page?: number } | undefined
      ): Promise<Tag[]> {
        return await request("/tags", {
          limit: params?.limit || 25,
          page: params?.page || 0,
        });
      },
    },
  };
}
