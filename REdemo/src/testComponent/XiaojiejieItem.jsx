import React, { Component } from 'react';
import PropTypes from 'prop-types'

class XiaojiejieItem   extends Component {
    // state = { :  }
    
    render() { 
        return (
           <li onClick={this.click.bind(this)}>
              {this.props.avname}-为你服务-{this.props.content}
           </li>
        );
    }
    click(){
        console.log(this.props.index)
        this.props.cli(this.props.index)
    }
}
XiaojiejieItem.propTypes = {
    content:PropTypes.string,
    index:PropTypes.number,
    cli:PropTypes.func,
    // avname:PropTypes.string.isRequired
}
XiaojiejieItem.defaultProps = {
    avname:'松岛枫'
}
export default XiaojiejieItem;