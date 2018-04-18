# vdiMAS-front
这个仓库是 vdi 大管理平台的前端仓库，仓库自带 web server ，web server 有以下特性：

* 使用 commonjs 方式写 js 代码
* 当 js 代码变化后，自动编译，并缓存于内存中，避免频繁写磁盘
* 支持页面发出的 ajax 请求，并返回 ajax 的数据（通过将 ajax 映射为本地 json 文件实现）
* 支持 [mockjs](https://github.com/nuysoft/Mock/wiki) 数据生成语法
* 支持编译、打包 js 文件
* 支持压缩 html, css 文件
* 支持合并 angular 模板文件（目前只支持合并到指定 js 文件内）

# 如何开始
如果你是项目指定的前端开发成员，执行以下步骤建立开发环境：

首先，克隆本仓库到你的本地目录：
```bash
git clone https://git.coding.net/mystorp/vdiMAS-front.git <your_dev_dir_or_empty>;
```
执行以下命令安装依赖包：
```
npm install
```
安装完成之后，运行以下命令启动服务器：
```bash
npm start
```
启动之后，你会在控制台看到这样的消息：`server started at: http://127.0.0.1:3000`。复制里面的网址并打开浏览器粘贴回车后就可以看到前端界面了。

# 配置文件 config.json
配置文件可以改变 web server 的一些参数。举个例子：
```json
{
	"page_prefix": "/",
	"page_directory": "./pages",
	"view_prefix": "/views",
	"view_directory": "./views",
	"static_prefix": "/static",
	"static_directory": "./static",
	"server": {
		"host": "127.0.0.1",
		"port": 3000
	},
	"bundle": {
		"app": {
			"src": "./static/js/app.js",
			"dest": "./static/js/app.bundle.js",
			"destMin": "./static/js/app.bundle.min.js"
		},
		"login": {
			"src": "./static/js/login.js",
			"dest": "./static/js/login.bundle.js",
			"destMin": "./static/js/login.bundle.min.js"
		}
	}
}
```
`page_prefix` 表示访问页面时的 url 前缀，页面表示独立的页面，不是模板文件，比如：login.html, index.html。

`page_directory` 表示访问页面时（比如访问：http://127.0.0.1:3000/index.html ）到哪个目录查找页面文件

`view_prefix` 表示访问模板文件的 url 前缀

`view_directory` 表示访问 angular 模板时，到哪个目录查找模板文件

`static_prefix` 表示访问静态资源的 url 前缀

`static_directory` 表示访问静态资源文件时，到哪个目录查找静态资源文件

**需要注意的是：上面的 `page_prefix`, `view_prefix`, `static_prefix` 一定不能相同**

`server` 字段可以控制 web server 绑定的 ip 和端口

`bundle` 字段表示需要动态编译的 js 文件，它是一个对象，其中键表示名称，值里面的 `src` 字段表示入口 js 文件。当入口 js 文件及其依赖文件发生变化后将自动编译并缓存，页面访问入口 js 文件时返回缓存。`dest` 字段表示编译后存放的目标 js 文件，一般由 `bin/build` 生成；`destMin` 表示压缩后的 js 文件，一般由 `bin/min-js` 生成。

# 命令
`bin/build` 打包编译入口 js 文件到目标文件

`bin/min-html.js` 压缩 html, css 文件

`bin/min-js.js` 压缩 js 文件

`bin/merge-views.js` 合并 angular 模板到 app.bundle.js

为了方便，只需要运行如下命令就可以完成打包，压缩的全部任务了：
```bash
npm run build
```

# angular 文档
为了开发时方便查阅 angular 文档，项目静态文件里面包含了 angular 文档数据。访问：
```plain
/angular
```
就可以看到 `1.4.7` 的文档。

