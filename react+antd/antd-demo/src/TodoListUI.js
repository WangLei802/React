import React, { Component,Fragment } from 'react';
import './Todolist.css'
import 'antd/dist/antd.css'
import { Input, Button, List} from 'antd'
class TodoListUi  extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <Fragment>
                <div className='margin'>
                    <h1>Antd-UI框架</h1>
                    <Input value={this.props.inputValue} style={{ width:'250px'}} onChange={this.props.changeInputValue.bind(this)}/>
                    <Button type="primary" onClick={this.props.click.bind(this)}>Primary</Button>
                    <div style={{margin: '20px auto',width:'600px',}}>
                        <List 
                        bordered
                        dataSource={this.props.list}
                        renderItem={(item,index)=>(<List.Item onClick={this.props.del.bind(this,index)}>{item}</List.Item>)}
                        /> 
                    </div>
                           
                </div>    
            </Fragment>
         );
    }
}
 
export default TodoListUi ;