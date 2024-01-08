import { tinycmClient } from "../src";

const tcmClient = tinycmClient({
  apiKey: 'tcmak_GfnnNfcl_wjmhtVF0PBdR6yGBrUj5b0Ue',
  projectId: 'wUGvzRxD',
  version: 'v1',
  _baseUrl: 'http://localhost:3000'
})

async function main() {
  // console.log(await tcmClient.posts.getAll())
  console.log(await tcmClient.posts.getByTag('blokfeed'))
  console.log(await tcmClient.posts.getByAuthor('author'))
  // console.log(await tcmClient.posts.getSlugs())
  // console.log(await tcmClient.posts.getBySlug('test'))
  // console.log(await tcmClient.tags.getBySlug('blokfeed'))
}

main()