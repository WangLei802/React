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