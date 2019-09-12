import React, { Component,Fragment } from 'react';
import './Todolist.css'
import 'antd/dist/antd.css'
import store from './store'
import { Input, Button, List} from 'antd'
// import { CHANGE_INPUT , ADD_ITEM , DEL } from './store/actionTypes'
import {changeInputAction,addItemAction,deleteItemAction} from './store/actionCreators'
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
        const action = changeInputAction(e.target.value)
        //要通过dispatch()方法传递给store
        store.dispatch(action)
    }
    click(){
        const action = addItemAction()
        store.dispatch(action)
    }
    del(index){
        const action = deleteItemAction(index)
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
                        renderItem={(item,index)=>(<List.Item onClick={this.del.bind(this,index)}>{item}</List.Item>)}
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