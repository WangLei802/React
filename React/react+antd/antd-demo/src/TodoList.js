import React, { Component } from 'react';
import './Todolist.css'
// import 'antd/dist/antd.css'
import store from './store'
// import { Input, Button, List} from 'antd'
// import { CHANGE_INPUT , ADD_ITEM , DEL } from './store/actionTypes'
import TodoListUI from './TodoListUI';
import {changeInputAction,addItemAction,deleteItemAction,getList} from './store/actionCreators'
import { Modal} from 'antd'
const { confirm } = Modal;
class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = store.getState()
        console.log(store.getState())
        //----------关键代码-----------start
        this.storeChange = this.storeChange.bind(this)  //转变this指向
        store.subscribe(this.storeChange) //订阅Redux的状态
    }
    componentDidMount(){
        let data = [1,2]
        const action = getList(data)
        store.dispatch(action)
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
        confirm({
            title: '你确定要删除么?',
            // content: 'Some descriptions',
            okText: '是',
            // okType: 'danger',
            cancelText: '否',
            onOk() {
                const action = deleteItemAction(index)
                store.dispatch(action)
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
        
    }
    render() { 
        return ( 
            <TodoListUI
                inputValue={this.state.inputValue}
                list={this.state.list}
                changeInputValue={this.changeInputValue}
                click={this.click}
                del={this.del}
            />
         );
    }
    storeChange(){
        this.setState(store.getState())
    }
}
 
export default TodoList;