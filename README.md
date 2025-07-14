# template-nodejs-serverless

template for nodejs using serverless framework v4

**This repository is a template. Do not store any real secrets or credentials in the codebase. All sensitive information (API keys, tokens, credentials, etc.) must be managed via environment variables or secret managers.**

## requires

### softwares

```
"node": ">=20.x"
```

#### GCP SA KEY

- need to make gcp_key_base.txt
  - `base64 -i key.json -o gcp_key_base.txt`
  - or `sh ./script/init.sh`

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
