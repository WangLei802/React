// 该文件为管理模块
import {GET_LIST,CHANGE_INPUT,ADD_ITEM,DEL} from './actionTypes'
//默认数据
const defaultState = {
    inputValue : '',
    list:[
        '早上4点起床，锻炼身体',
        '中午下班游泳一小时'
    ]
}  
/*
state: 指的是原始仓库里的状态。
action: 指的是action新传递的状态。
*/
export default (state = defaultState,action)=>{  //就是一个方法函数
    console.log('5555')
    console.log(state,action)
    let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
    if(action){
        switch(action.type){
            case GET_LIST:
                newState.list = action.value
                return newState   
                break
            case CHANGE_INPUT:
                newState.inputValue = action.value
                return newState   
                break
            case ADD_ITEM:
                // let newState = JSON.parse(JSON.stringify(state)) 
                console.log(newState)
                newState.list.push(newState.inputValue)  //push新的内容到列表中去
                newState.inputValue = ''
                return newState
                break
            case DEL:
                // let newState = JSON.parse(JSON.stringify(state)) 
                newState.list.splice(action.index,1)  //push新的内容到列表中去
                return newState
                break
        }
    }
    return state
}