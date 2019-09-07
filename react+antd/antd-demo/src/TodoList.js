import React, { Component,Fragment } from 'react';
import './Todolist.css'
import 'antd/dist/antd.css'
import store from './store'
import { Input, Button, List} from 'antd'

class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = store.getState()
        console.log(store.getState())
        //----------关键代码-----------start
        this.storeChange = this.storeChange.bind(this)  //转变this指向
        store.subscribe(this.storeChange) //订阅Redux的状态
    }
    changeInputValue(e){
        // Action就是一个对象
        const action ={
            type:'changeInput',                  //对action的描述
            value:e.target.value                        //要改变的值
        }
        //要通过dispatch()方法传递给store
        store.dispatch(action)
    }
    click(){
        const action = {
            type:'addItem'
        }
        store.dispatch(action)
    }
    render() { 
        return ( 
            <Fragment>
                <div className='margin'>
                    <h1>Antd-UI框架</h1>
                    <Input placeholder={this.state.inputValue} style={{ width:'250px'}} onChange={this.changeInputValue.bind(this)}/>
                    <Button type="primary" onClick={this.click.bind(this)}>Primary</Button>
                    <div style={{margin: '20px auto',width:'600px',}}>
                        <List 
                        bordered
                        dataSource={this.state.list}
                        renderItem={item=>(<List.Item>{item}</List.Item>)}
                        /> 
                    </div>
                           
                </div>    
            </Fragment>
         );
    }
    storeChange(){
        this.setState(store.getState())
    }
}
 
export default TodoList;