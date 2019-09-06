import React, { Component,Fragment } from 'react';
import './Todolist.css'
import 'antd/dist/antd.css'
import { Input, Button, List} from 'antd'

const data = [
    '早8点开晨会，分配今天的开发工作',
    '早9点和项目经理作开发需求讨论会',
    '晚5:30对今日代码进行review'
]
class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <Fragment>
                <div className='margin'>
                    <h1>Antd-UI框架</h1>
                    <Input placeholder='jspang' style={{ width:'250px'}}/>
                    <Button type="primary">Primary</Button>
                    <div style={{margin: '20px auto',width:'600px',}}>
                        <List 
                        bordered
                        dataSource={data}
                        renderItem={item=>(<List.Item>{item}</List.Item>)}
                        /> 
                    </div>
                           
                </div>    
            </Fragment>
         );
    }
}
 
export default TodoList;