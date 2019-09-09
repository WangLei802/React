# Redux

### 学习了之前的react基础语法糖及重要的生命周期后，自己对react的机制及思想更深了一点，作为码畜啊，就得不能把自己当人看，学不死往死学，接下来就继续探索react重要的用来管理管理数据状态和UI状态的JavaScript应用工具---- Redux

接下来的学习之路会用到antd UI 跟react 配合去做demo编码

先来安装antd'
```
npm install antd --save
```

 我们先来写一个 TodoList demo

 编写index.js

```
import React from 'react';
import ReactDOM from 'react-dom'
import TodoList from './TodoList'

ReactDOM.render(<TodoList/>,document.getElementById('root'))
 ```

编写TodoList.js文件  先引入CSS样式  然后再将所需的todolist 组件导入

```
import React, { Component } from 'react';
import 'antd/dist/antd.css'
import { Input , Button , List } from 'antd'

const data=[
    '11111',
    '22222',
    '33333'
]

class TodoList extends Component {
    render() { 
        return ( 
            <div style={{margin:'10px'}}>
                <div>
                    <Input placeholder='write someting' style={{ width:'250px', marginRight:'10px'}}/>
                    <Button type="primary">Add</Button>
                </div>
                <div style={{margin:'10px',width:'300px'}}>
                    <List
                        bordered
                        dataSource={data}
                        renderItem={item=>(<List.Item>{item}</List.Item>)}
                    />    
                </div>
            </div>
         );
    }
}
export default TodoList;
```

todolist 组件上面已经完成  接下来我们就开始学习redux数据更新渲染以及各个文件的作用



### **创建Redux中的store及reducer文件**

**redux的工作流程有四个 react components --> action -->store <==> reducers
store --> react components**

其中最重要的便是 **store**，所有的数据都要放到**store**中进行管理，所以我们要优先对store文件进行编写

* 先安装redux
```
npm install --save redux
```
* 在src文件下建立store文件，在该文件下创建index文件进行编码
```
import { createStore } from 'redux'  // 引入createStore方法
const store = createStore()          // 创建数据存储仓库
export default store                 //暴露出去
```

* 现在的这个仓库很混乱   我们此时就需要用一个有管理能力的模块来管理仓库 这个模块就是redux，在store文件下建立redux.js文件

```
const defaultState = {}  //默认数据
export default (state = defaultState,action)=>{  //就是一个方法函数
    return state
}
```
* **state:** 是整个项目中需要管理的数据信息,这里我们没有什么数据，所以用空对象来表示。

* **reducer**文件建立好了，把reducer引入到store中,再创建store时，以参数的形式传递给store。

将index文件进行改造
```
import { createStore } from 'redux'  //  引入createStore方法
import reducer from './reducer'    
const store = createStore(reducer) // 创建数据存储仓库
export default store   //暴露出去
```