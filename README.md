### 预览
    
    ![项目简介](https://raw.githubusercontent.com/byk04712/mobx-todos/master/introduce.png)
    
    
    
    ---
    
    
    ![项目简介](https://raw.githubusercontent.com/byk04712/mobx-todos/master/introduce.gif)
    
    
    
    
    
    
    ### 安装 mobx 和 mobx-react
    
    `npm install mobx mobx-react --save`
    
    >使用 mobx 时，建议使用 ES7 注解语法，因此需要进行以下操作来支持
    
    >`npm install babel-plugin-syntax-decorators babel-plugin-transform-decorators-legacy --save-dev`
    
    >###在项目根目录下 `.babelrc` 文件里添加如下代码
    
    ```
    {
      "presets": ["react-native"],
    +  "plugins": [
    +    "syntax-decorators",
    +    "transform-decorators-legacy"
    +  ]
    }
    
    ```
    
    ---
    

#### mobx 是什么，能做什么，这个我这里就不详细说了，大家去google上百度一下吧。我只强调一点，mobx 建议最小模块化，所有能分离成子组件的尽量分离出来，避免不必要的`render`。 如果能独立完成这个demo，基本上可以说，mobx 你已经掌握核心内容了。
    
---
  
### 主要代码在 `Main.js` 文件中，各个子组件和模快没有做相应分离到各个文件中去了，一是自己懒得去分离了，分离后每个头部又要 `import` 一腿重复的文件，二是方便大家阅读代码，免得文件与文件之间来回切换查看。