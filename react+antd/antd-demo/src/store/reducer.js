// 该文件为管理模块

//默认数据
const defaultState = {
    inputValue : '请输入要为你服务的小姐姐Nmae',
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
    console.log(state,action)
    if(action.type === 'changeInput'){
        let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
        newState.inputValue = action.value
        return newState
    }

    //state值只能传递，不能使用
    if(action.type === 'addItem' ){ //根据type值，编写业务逻辑
        let newState = JSON.parse(JSON.stringify(state)) 
        newState.list.push(newState.inputValue)  //push新的内容到列表中去
        newState.inputValue = ''
        return newState
    }
    return state
}