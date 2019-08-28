import React, { Component ,Fragment} from 'react';

class Sum extends Component {
    state = {  }
    sum = () => {
        this.props.sum()
    }
    render() { 
        return (  
            <Fragment>
                <button onClick={this.sum}>点我++</button>
                <div>
                    <span>我是++出来数：</span><span>{this.props.count}</span>
                </div>
            </Fragment>
        );
    }
}
 
export default Sum;