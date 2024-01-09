# Official TinyCM API Client

## Install

```bash
    npm install tinycm-client
```

## Usage example

```typescript
import { createClient } from "tinycm-client";

const tinycmClient = createClient({
  apiKey: "TINYCM_API_KEY", // Create an api key in the TinyCM Dashboard.
  projectId: "TINYCM_PROJECT_ID", // Find your project id in the TinyCM Dashboard
  version: "v1", // Current TinyCM API Version
});

const posts = await tinycmClient.posts.getAll();
const post = await tinycmClient.posts.getBySlug("post-slug");
```