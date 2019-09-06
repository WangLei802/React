import React,{Component,Fragment} from 'react';
import '../App.css'
import XiaojiejieItem from './XiaojiejieItem'
import DvcComponent from './DvcComponent'

class testComponent extends Component{
    constructor(props){
      super(props)
      this.state = {
        arr:['angular','vue','react'],
        arr1:[],
        inp:'',
        count:0
      }
    }
    add = () =>{
      console.log('1111')
      const state = this.state
      this.setState({
        arr1:[...state.arr1,state.inp],
        inp:'',
      })
    }
    change = (e) =>{
      this.setState({
        inp:e.target.value
      })
    }
    cli(index){
      /* arr1: this.state.arr1.filter((_, i) => i !== index)*/ 
      /*
      const a = this.state.arr1
      console.log(index)
      a.splice(index,1)
      this.setState({
        arr1: a
      })
      console.log(a)*/
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
              <div>
                <input value={this.state.inp} onChange={this.change}/> <button onClick={this.add}> 增加服务 </button>
              </div>
              {/* <li key={index+res} onClick={this.cli.bind(this,index)}>{res}</li> */}
              <ul>
                {this.state.arr1.map((res,index)=>{
                  return(
                    <XiaojiejieItem 
                    key={index+res}  
                    content={res} 
                    index={index}
                    avname='波多野结衣'
                    cli={this.cli.bind(this)}/>
                  )
                })}
              </ul> 
              
            </Fragment>
        )
    }
  }
export default testComponent;