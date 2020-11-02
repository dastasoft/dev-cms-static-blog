# DEV.TO as CMS for STATIC BLOG with NEXTJS

Full guide on [Nimbel](https://nimbel.net/blog/posts/simple-static-blog-with-next-js-and-dev-to-as-cms-4pej)

## Webhooks

If you want to maintain your posts in dev.to and your blog sync, you'll need a webhook. You must create a new webhook to respond the events of `article_created` and/or `article_updated`.

### Check created webhooks

Add your `API_KEY` to check the current created webhooks

```sh
curl -H "api-key: API_KEY" https://dev.to/api/webhooks
```

### Create new webhook

Add your `API_KEY` and the `TARGET_URL` of the container which listens for new builds.

```sh
curl -X POST -H "Content-Type: application/json" \
  -H "api-key: API_KEY" \
  -d '{"webhook_endpoint":{"target_url":"TARGET_URL","source":"DEV","events":["article_created", "article_updated"]}}' \
  https://dev.to/api/webhooks
```

### Delete webhook

Add your `API_KEY` and the `ID` of the webhook you want to delete.

```sh
curl -X DELETE \
  -H "api-key: API_KEY" \
  https://dev.to/api/webhooks/ID
```
