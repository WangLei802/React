import React,{Component,Fragment} from 'react';
import '../App.css'
class testComponent extends Component{
    constructor(props){
      super(props)
      this.state = {
        arr:['angular','vue','react'],
        arr1:['头部按摩','精油推背'],
        inp:''
      }
    }
    add = () =>{
      console.log('1111')
      const state = this.state
      this.setState({
        arr1:[...state.arr1,state.inp]
      })
    }
    change = (e) =>{
      this.setState({
        inp:e.target.value
      })
    }
    cli(index){
      console.log(index)
      this.setState({
        arr1: this.state.arr1.filter((_, i) => i !== index)
      })
    }
    
    render(){
        return  (
            /*
              sadas
            */
            <Fragment>
<<<<<<< HEAD
              <div>
                <input value={this.state.str} onChange={this.change}/> <button onClick={this.add}> 增加服务 </button>
              </div>
              <ul>
                {this.state.arr1.map((res,index)=>{
                  return <li key={index+res} onClick={this.cli.bind(this,index)}>{res}</li>
                })}
              </ul> 
=======
               <div><input /> <button> 增加服务 </button></div>
               <ul>
                   <li>头部按摩4</li>
                   <li>精油推背</li>
               </ul> 
>>>>>>> 815cd9cbd3968b8e1b4b634b8092ad31b4d9d347
            </Fragment>
        )
    }
  }
export default testComponent;