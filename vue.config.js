const path = require("path");
const { title } = require("./src/config");

const name = title || "vru_web";
const port = process.env.VUE_APP_BASE_PORT || 8090;

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  runtimeCompiler: true,
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false, //可以使得打包过后的文件不包含未压缩的.map文件，减少压缩后代码体积
  devServer: {
    port: port,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080/",
        changeOrigin: true,
        ws: true,
        pathRewrite: { "^/api": "" }
      },
      "/baidu": {
        target: "http://api.map.baidu.com/",
        changeOrigin: true,
        pathRewrite: { "^/baidu": "" }
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
    // 为了补删除换行而加的配置
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    /**
     * webpack中实现代码分割的两种方式：
     * 1.同步代码：只需要在webpack配置文件总做optimization的配置即可
     * 2.异步代码(import)：异步代码，无需做任何配置，会自动进行代码分割，放置到新的文件中
     */
    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });
  }
};
