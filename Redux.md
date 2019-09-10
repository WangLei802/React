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
### **在store中为todoList初始化数据**
仓库store和reducer都创建好了，可以初始化一下todoList中的数据了，在reducer.js文件的defaultState对象中，加入两个属性:inputValue和list

```
const defaultState = {
    inputValue : 'Nmae',
    list:[
        '11111',
        '22222'
    ]
}  
```

### **todolist组件获得store中的数据**

先引入  import store from './store/index'

引入后我们可以使用构造方法在控制台将引入的的store数据进行打印

```
constructor(props){
    super(props)
    console.log(store.getState())
}
```
接下来我们将store中的数据对todolist文件的数据进行赋值

```
class TodoList extends Component {
constructor(props){
    super(props)
    //关键代码-----------start
    this.state=store.getState();
    //关键代码-----------end
    console.log(this.state)
}
    render() { 
        return ( 
            <div style={{margin:'10px'}}>
                <div>
                    <Input placeholder={this.state.inputValue} style={{ width:'250px', marginRight:'10px'}}/>
                    <Button type="primary">Add</Button>
                </div>
                <div style={{margin:'10px',width:'300px'}}>
                    <List
                        bordered
                        //关键代码-----------start
                        dataSource={this.state.list}
                        //关键代码-----------end
                        renderItem={item=>(<List.Item>{item}</List.Item>)}
                    />    
                </div>
            </div>
         );
    }
}
export default TodoList;
```
以上就是创建store，reduce和如何使用store中的数据的一些基本知识点

接下来就来感受一下redux工作流程

* 添加input响应事件 onChange 事件  在todolist.js文件中
```
<Input 
    placeholder={this.state.inputValue} 
    style={{ width:'250px', marginRight:'10px'}}
    //---------关键代码----start
    onChange={this.changeInputValue.bind(this)}
    //---------关键代码----end
/>

changeInputValue(e){
    console.log(e.target.value)
}
```
基于前面的学习  现在input 的事件我们可以拿到当前的value值 那么接下来我们就要去改变store里面的值

根据前面的redux工作流程，接下来我们首先要去创造**Action**

```
changeInputValue(e){
    const action ={
        type:'change_input_value',
        value:e.target.value
    }
}
```
* **Action**里面有两个属性，第一个则是对**action**的描述，第二个则是要改变的值

* 到这里还不能说可以改变到**store**里面的值，需要注意的是创建完**action**我们必须去通过**dispatch()** 方法传递给 **store** 从而建立联系
```
changeInputValue(e){
    const action ={
        type:'changeInput',
        value:e.target.value
    }
    store.dispatch(action)
}
```

## **store的自动推送策略**
 通过react 的官网流程图我们可以看到，**store**只是一个仓库，他没有管理能力，然而他会把接收到的**action**传送给**reducer**，我们在reducer控制打印台打印结果看下

 ```
 export default (state = defaultState,action)=>{
    console.log(state,action)
    return state
}
 ```
* **state:** 指的是原始仓库里的状态。
* **action:** 指的是action新传递的状态。

现在通过浏览器控制台打印我们可以清楚的看到 **Reducer** 已经成功地拿到传递过来的新数据，接下来就要去改变 **store** 里面的值。

* 首先我们要去判断 **action** 中的 **type** 类型是否正确，如若正确，则需要声明一个新的变量 **newState** 
* 然后进行赋值操作并将新声明的 **newState** return出去
* **需要注意的是：** **Reducer**里只能接收 **state** ，不能改变 **state**

```
export default (state = defaultState,action)=>{
    <!-- 此处就是action提交过来的类型值 去做判断 -->
    if(action.type === 'changeInput'){
        let newState = JSON.parse(JSON.stringify(state))     //深度拷贝state
        newState.inputValue = action.value
        return newState
    }
    return state
}
```

此时 **store** 中的数据已完成更新，但是我们在组件中可以看到数据并没有更新，我们需要在todolist.js中 **constructor** 添加下面代码

```
constructor(props){
    super(props)
    this.state=store.getState();
    this.changeInputValue= this.changeInputValue.bind(this)
    //----------关键代码-----------start
    this.storeChange = this.storeChange.bind(this)  //转变this指向
    store.subscribe(this.storeChange) //订阅Redux的状态
    //----------关键代码-----------end
}

```
我们还需在下面写 **storeChange** 的方法 ，并且重新setState一次就可以实现组件也是变化的。在代码的最下方，编写storeChange方法。
```
storeChange(){
     this.setState(store.getState())
 }
```