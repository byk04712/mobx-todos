### 预览

![项目简介](https://raw.githubusercontent.com/byk04712/mobx-todos/master/introduce.png)



---


![项目简介](https://raw.githubusercontent.com/byk04712/mobx-todos/master/introduce.gif)






### 安装 mobx 和 mobx-react

`npm install mobx mobx-react --save`

>>>使用 mobx 时，建议使用 ES7 注解语法，因此需要进行以下操作来支持
`npm install babel-plugin-syntax-decorators babel-plugin-transform-decorators-legacy --save-dev`

###在项目根目录下 `.babelrc` 文件里添加如下代码
```
{
  "presets": ["react-native"],
+  "plugins": [
+    "syntax-decorators",
+    "transform-decorators-legacy"
+  ]
}

```