import { GetPostsByTagResponse, GetPostsResponse, Post, Tag } from "./types";

function logError(...args: any[]) {
  console.error("[🍊] ", ...args);
}

function throwError(msg: string, ...args: any[]) {
  logError(msg, ...args);
  throw new Error("[🚨] " + msg);
}

function createDebugger(debug: boolean) {
  return (...args: any[]) => {
    if (debug) {
      console.log("[🍊] ", ...args);
    }
  };
}

export type ClientConfiguration = {
  apiKey: string;
  projectId: string;
  version: 'v1'
  debug?: boolean;
  _baseUrl?: string;
};

function setConfig(apiKey: string, projectId: string, version: string, _baseUrl?: string): { url: string, headers: HeadersInit } {
  if (!apiKey) {
    throwError("apiKey is required");
  }

  if (!projectId) {
    throwError("projectId is required");
  }

  const baseUrl = _baseUrl ?? "https://tinycm.com";

  const apiUrl = `${baseUrl}/api/${version}/content`
  
  return {
    url: apiUrl,
    headers: {
      'x-api-key' : apiKey,
      'x-project-id': projectId,
      'Content-Type': 'application/json'
    }
  };
}

export function tinycmClient({
  apiKey,
  projectId,
  version,
  debug,
  _baseUrl
}: ClientConfiguration) {

  // const {apiKey, projectId, version, debug, _baseUrl} = configuration
  const clientConfig = setConfig(apiKey, projectId, version, _baseUrl);
  const log = createDebugger(debug || false);
  log("createClient ", clientConfig);

  async function request(path: string, params?: Object ) {

    const url =
      clientConfig.url +
      path +
      (!!params ? `?${new URLSearchParams(params as any).toString()}` : "");

    console.log({url, clientConfig, params})
    const response = await fetch(url, {headers: clientConfig.headers})

    if (!response.ok) {
      throwError("Error fetching data from API", response);
    }

    return await response.json();
  }

  return {
    posts: {
      getAll: async function(limit = 10, page = 0): Promise<GetPostsResponse> {
        return await request(
          '/posts',
          {
            sort: 'publishedDate:desc',
            limit: limit,
            page: page
          }
        )
      },
      getByTag: async function(tag: string): Promise<GetPostsByTagResponse> {
        return await request(
          '/tags/' + tag,
        )
      },
      getByAuthor: async function(author: string): Promise<GetPostsByTagResponse> {
        return await request(
          '/author/' + author,
        )
      },
      getSlugs: async function(): Promise<{slug: string}[]> {
        return await request(
          '/posts/slugs',
        )
      },
      getBySlug: async function(slug: string): Promise<Post> {
        return await request(
          '/posts/' + slug,
        )
      },
    },
    authors: {
      getAll: async function(limit = 10, page = 0): Promise<Tag[]> {
        return await request(
          '/authors',
          {
            limit: limit,
            page: page
          }
        )
      },
    },
    tags: {
      getAll: async function(limit = 10, page = 0): Promise<Tag[]> {
        return await request(
          '/tags',
          {
            limit: limit,
            page: page
          }
        )
      },
    },
  };
}

