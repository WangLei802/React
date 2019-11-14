import  {GET_LIST,CHANGE_INPUT,ADD_ITEM,DEL}  from './actionTypes'

export const getTodoList = () =>{
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