import React, { Fragment } from 'react';
import './Todolist.css'
import 'antd/dist/antd.css'
import { Input, Button, List} from 'antd'
const TodoListUi = (props)=>{
    return ( 
        <Fragment>
            <div className='margin'>
                <h1>Antd-UI框架</h1>
                <Input placeholder="请输入" value={props.inputValue} style={{ width:'250px'}} onChange={props.changeInputValue.bind(this)}/>
                <Button type="primary" onClick={props.click.bind(this)}>Primary</Button>
                <div style={{margin: '20px auto',width:'600px',}}>
                    <List 
                    bordered
                    dataSource={props.list}
                    renderItem={(item,index)=>(<List.Item onClick={props.del.bind(this,index)}>{item}</List.Item>)}
                    /> 
                </div>
                        
            </div>    
        </Fragment>
    );
}
 
export default TodoListUi ;