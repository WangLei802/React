# **React生命周期**
一个组件完整的生命周期包含实例化阶段、活动阶段、销毁阶段三个阶段。每个阶段又由相应的方法管理。

**其主要有三个阶段**
* mounting:表示正在挂接虚拟DOM到真实DOM。
* updating:表示正在被重新渲
* unmounting:表示正在将虚拟DOM移除真实DOM

每个阶段会提供以下函数

* omponentWillMount()
* componentDidMount()
* componentWillUpdate(object nextProps, object nextState)
* componentDidUpdate(object prevProps, object prevState)
* componentWillUnmount()

**DEMO**
```
<script type="text/babel">
    var Helloo = React.createClass({
        getInitialState(){
            return {
                num:Math.random() * 100
            }
        },
        propsChange() {
            this.setState({
                num: Math.random() * 100
            });
        },
        render:function(){
            return(
                <div>
                    {this.state.num}<br/>
                    <Hello num={this.state.num}></Hello>
                    <button onClick={this.propsChange}>change</button>
                </div>
            )
        }
    });

    var Hello = React.createClass({
   /* 在使用es6的class语法时是没有这个钩子函数的，可以直接在constructor中定义this.state。此时可以访问this.props
      相当于vue中的date 用来做初始化数据
   */
    getInitialState(){
        console.log('1...getInitialState')
        return {
            count:1,
            sum:2
        }
    },

    // 组件初始化时只调用，以后组件更新不调用，整个生命周期只调用一次，此时可以修改state。
    componentWillMount(){
        console.log('2...componentWillMount');
    },

    // 组件渲染之后调用，只调用一次。在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。
    componentDidMount() {
        console.log('3...componentDidMount');
    },

    // props发生变化是触发此函数执行
    componentWillReceiveProps(){
        console.log('666...componentWillReceiveProps')
    },

    // 组件初始化时不调用，只有在组件将要更新时才调用，此时可以修改state
    componentWillUpdate() {
        console.log('4...componentWillUpdate');
    },

    // 组件初始化时不调用，组件更新完成后调用，此时可以获取dom节点。
    componentDidUpdate() {
        console.log('4...componentDidUpdate');
    },

    handleClick(){
        this.setState({
            count:this.state.count+1,
            sum:this.state.sum+1,

        })
    },
    render: function() {
        return(
            <div>
                {this.state.count} + { this.state.sum}<br/>
                <button onClick={this.handleClick}>Add</button>
                <div>{this.props.num}</div> 
            </div>
        )
    },
  });
   
  ReactDOM.render(<Helloo></Helloo>, document.getElementById('box'));
</script>
```

**this.props.children**

它表示组件所有的子节点
```
<script type="text/babel">
    var Hello = React.createClass({
        render:function(){
            return(
                <ol>
                    {React.Children.map(this.props.children,function(child,index) {
                        return(
                            <li>{child}---{index}</li>
                        )
                    })}
                </ol>
            )
        }
    });
    ReactDOM.render(
        <Hello>
            <span>666</span>
            <span>888</span>
        </Hello>,
        document.getElementById('box')
    )
</script>
```
**this.props.children可能出现的三种请情况**
* 组件没有节点         则为undfined
* 若有一个节点         则为object
* 若有多个节点         则为Array

## **props属性验证**
组件的属性是可以接收任何值的，但有时候我们希望对外界父级组件传递进来的属性数据进行限定，比如希望name属性不能缺少、onClick属性必须是函数类型等，这对确保组件被正确使用非常有意义。为此React引入了propTypes机制。React.PropTypes提供各种验证器（validator）来验证传入数据的有效性。当向props传入无效数据时，React会在JavaScript控制台抛出警告。

**废话不多说，举例说明**
```
<script type="text/babel">
    var str = 123;    
    var Hello = React.createClass({
        /* 此次明确规定name必须存在，并且为字符串类型 */
        propTypes:{
            name:React.PropTypes.string.isRequired,
        },

        /* 此函数用来设置组件属性的默认值 */
        getDefaultProps(){
        /* 此处如若为 123456 number类型  控制台会报错 */
            return{
                name:'123456'
            }
        },

        render:function(){
            return(
                <div>
                    {this.props.name}
                </div>
            )
        }
    });

    ReactDOM.render(
        <Hello/>,
        document.getElementById('box')
    )
</script>.
```

## **获取DOM元素**
eact中的DOM也是虚拟DOM，这点Vue非常类似。只有当它插入文档以后，才会变成真实的DOM。React也是在虚拟DOM发生变化时，进行比对后，只渲染变化的部分，它是React极高性能的主要原因之一。

**废话不多说，举例说明**

获取dom使他获取焦点  此处获取dom元素跟vue一样，同样是使用ref属性来获取dom元素
```
<script type="text/babel">
    var Hello = React.createClass({
        propTypes:{
            name:React.PropTypes.string.isRequired,
        },
        getDefaultProps(){
            return{
                name:'123456'
            }
        },
        handleClick(){
            this.refs.inp.focus()
        },
        render:function(){
            return(
                <div>
                    <input type="text" ref="inp"/>
                    <input type="button" value="Focus the text input" onClick={this.handleClick}/> 
                </div>
            )
        }
    });
    ReactDOM.render(
        <Hello/>,
        document.getElementById('box')
    )
</script>
```
## **注意：**
* **由于this.refs.[refName]属性获取的是真实DOM，所以必须得到虚拟DOM插入文档以后，才能使用这个属性，否则会报错。**