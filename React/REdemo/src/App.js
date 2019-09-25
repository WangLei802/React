import React,{Component} from 'react';
import logo from './logo.svg';
import './App.css';
import TestComponent  from './testComponent/testComponent'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Name/>
        <TestComponent ></TestComponent >
      </header>
      
    </div>
  );
}
class Name extends Component{
  constructor(props){
    super(props)
    this.state = {
      arr:['angular','vue','react']
    }
  }
  render(){
      return (
        <div className="App-link">
          Hello world! {this.props.name?this.props.name:'么的给我传props'}
          <ul>
            {
              this.state.arr.map((item,index)=>{
                return(
                  <li key={index}>{item} -- {index}</li>
                )
              })
            }
          </ul>
        </div>
      )
  }
}
// function Name() {
//   return (
//     <div className="App-link">
//       Hello world
//     </div>
//   )
// }
export default App;
