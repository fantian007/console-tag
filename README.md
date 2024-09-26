# console message with color tags
![示例](./images/console@2x.png)

## rspack
```typescript
rspack: (config, { appendPlugins, HtmlPlugin }) => {
  appendPlugins(new ConsoleTagRspackPlugin({ HtmlPlugin }))
},
```

## webpack
```typescript
webpackChain(config, { HtmlPlugin }) {
  config.plugin('tag').use(
    new ConsoleTagWebpackPlugin(
      {
        HtmlPlugin,
        git: {
          branch: true,
          hash: 7,
          lastCommitDateTime: true,
        },
        custom() {
          return {
            构建版本: process.env.BUILD_VERSION ?? '-',
          };
        },
      }
    )
  )
}
```
