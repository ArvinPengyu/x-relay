# x-relay

一个极简中转：`GET /?url=<encoded>` → 服务器去取，带 CORS 头返回。

部署到 Koyeb / Railway / 任意 VPS 后，把这个地址填进 x-view.html 的「⚙ 中转」：

```
https://你的站点域名/?url={url}
```

本地跑：

```bash
node server.js        # 默认 8000 端口
```
