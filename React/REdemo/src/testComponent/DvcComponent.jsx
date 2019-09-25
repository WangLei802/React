import React,{Component} from 'react';
import '../css/DvcComponent.css'
class DvcComponent extends Component{
    render() {
      return (
        <div className="layer-success">
          <div className="box">
            <img
              className="layer"
              src="https://ai-sample.oss-cn-hangzhou.aliyuncs.com/test/3177ea209d6911e9bb385faeee3e7623.png"
            />
            <span className="hd">
              助力成功
            </span>
            <span className="bd">
              晒一个自己的心愿
            </span>
            <span className="submain">
              皇包车送你去旅行
            </span>
            <div className="main">
              <span className="title">
                晒心意 抽免单
              </span>
            </div>
          </div>
        </div>
      );
    }
  }
  export default DvcComponent;