import React,{Component,Fragment} from 'react';
import '../App.css'
class testComponent extends Component{
    constructor(props){
      super(props)
      this.state = {
        arr:['angular','vue','react']
      }
    }
    render(){
        return  (
            <Fragment>
               <div><input /> <button> 增加服务 </button></div>
               <ul>
                   <li>头部按摩4</li>
                   <li>精油推背</li>
               </ul> 
            </Fragment>
        )
    }
  }
export default testComponent;