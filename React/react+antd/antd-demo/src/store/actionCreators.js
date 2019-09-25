import  {CHANGE_INPUT,ADD_ITEM,DEL}  from './actionTypes'

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