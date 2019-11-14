import  {GET_LIST,CHANGE_INPUT,ADD_ITEM,DEL}  from './actionTypes'


// 中间件  (可将后台请求数据这步操作放在中间件)
export const getTodoList = () =>{
    // 此函数可直接传递进dispatch，我们只需dispatch(action)直接调用就好
    return (dispatch)=>{
        const data = [1,3]
        const action = getList(data)
        dispatch(action)
    }
}
export const getList = (value)=>({
    type:GET_LIST,
    value
})
export const changeInputAction = (value)=>({
    type:CHANGE_INPUT,
    value
})
export const addItemAction  = ()=>({
    type:ADD_ITEM
})
export const deleteItemAction  = (index)=>({
    type:DEL,
    index
})