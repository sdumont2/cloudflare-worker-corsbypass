# cloudflare-worker-corsbypass

This project is just to test cors bypassing using cloudflare workers.   

Included original Licenses that came with wrangler generation of worker.

Essentially the purpose is to use the worker to use the URL passed to it to perform the request you'd and provide/replace cors headers so the browser allows the calls to be made.

TODOs:

- Handle Redirects.

- Obfuscate as much as possible.

- Add blacklists/whitelists for origins.


Below is the Base README from when you first make a worker using wrangler.

# 👷 `worker-template` Hello World

A template for kick starting a Cloudflare worker project.

[`index.js`](https://github.com/cloudflare/worker-template/blob/master/index.js) is the content of the Workers script.

#### Wrangler

To generate using [wrangler](https://github.com/cloudflare/wrangler)

```
wrangler generate projectname https://github.com/cloudflare/worker-template
```

#### Serverless

To deploy using serverless add a [`serverless.yml`](https://serverless.com/framework/docs/providers/cloudflare/) file.