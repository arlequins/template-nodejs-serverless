# template-nodejs-serverless

template for nodejs using serverless framework v4

**This repository is a template. Do not store any real secrets or credentials in the codebase. All sensitive information (API keys, tokens, credentials, etc.) must be managed via environment variables or secret managers.**

## requires

### softwares

```
"node": ">=20.x"
```

#### configuration variables

- need to make config.json and save in s3 bucket

## invoke functions

### usecase: scheduler-main

```
curl -X POST http://localhost:3002/2015-03-31/functions/template-nodejs-offline-scheduler-main/invocations \
  -d '{"type": "draft"}' \
  -H "Content-Type: application/json"
```

## release command

init: `git flow init`

```
CURRENT_VERSION=1.0.0
git flow release start "${CURRENT_VERSION}"
git flow release finish "${CURRENT_VERSION}"
git push origin main develop
git push --tags
```
