import React, { Component } from 'react';

class XiaojiejieItem   extends Component {
    // state = { :  }
    
    render() { 
        return (
           <li onClick={this.click.bind(this)}>
               {this.props.content}
           </li>
        );
    }
    click(){
        console.log(this.props.index)
        this.props.cli(this.props.index)
    }
}
 
export default XiaojiejieItem;