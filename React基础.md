# **React 采坑记 * 基础篇**
本人react小白一枚 跟大家分享下自己采坑记  记录个人对react学习的一点理解与分享  希望可以跟大家共同学习，共同进步，共同探讨    大家多多指教  不喜勿喷  (希望可以对react有共同兴趣的小伙伴有帮助)

[此次学习借鉴JsPang(技术胖)大佬分享，也希望大家多多支持JsPang](http://www.jspang.com/posts/)

### react特点：

* 虚拟DOM: React同vue一样也是以数据驱动的，每次数据变化React都会遍历整个虚拟DOM树，自动计算与上次虚拟DOM的差异变化，然后针对需要变化的部分进行实际的浏览器DOM更新。
* 组件化： React可以从功能角度横向划分，将UI分解成不同组件，各组件都独立封装，整个UI是由一个个小组件构成的一个大组件，每个组件只关系自身的逻辑，彼此独立。
* 单项数据流：React设计者认为数据双向绑定虽然便捷，但在复杂场景下副作用也是很明显，所以React更倾向于单向的数据流动-从父节点传递到子节点。（使用React也可实现双向绑定，但不建议使用  个人认为react父子组件通信比vue更加快捷方便）

废话不多说  开始第一篇   大家熟悉的Hello world！再此需要引入三个静态js文件  去react官网就可找到
## **Hello world！及 初识 JSX 语法**
- - -
``` 
    <!-- react此时用到了JSX语法 需引入以下js文件 并且需要添加type类型为 text/babel  -->
    <!-- 此处必须添加次类型值  否则不可使用JSX语法去进行编码 -->
    <script src="http://cdn.bootcss.com/babel-core/5.8.38/browser.min.js"></script>
    <script type="text/babel">
        var Hello = React.createClass({
            render:function(){
                return  <h1>
                            Hello World!   
                        </h1>;
            }
            <!-- 下面这种写法是有问题的   无法正常渲染  解决方法 return 后写() 或者如上写法 -->
            render:function(){
                return  
                    <h1>
                        Hello World!   
                    </h1>;
            }
        });
        ReactDOM.render(
            <Hello/>,                                   // 所放组件标签
            document.getElementById('box')              // 要挂载到的容器里
        )
    </script>
```
### **以上代码就完成了一个Hello world！  此处需要知道** 
* React.createClass 是注册一个组件类 里面为一个render函数  返回一个组件
* ReactDOM.render() 是将组件转为HTML语言并插入指定的DOM节点 

### **使用JSX语法的好处：**

* 使用熟悉的语法仿照HTML来定义虚拟DOM
* 使用JSX语法使程序代码看起来更加直观
* JSX 可与 js 等价转换
* JSX是可支持表达式 是用{}即可

### **JSX特定属性**
* 你可以通过使用引号，来将属性值指定为字符串字面量：
```
    const element = <div tabIndex="0"></div>;
```
* 使用大括号，来在属性值中插入一个 JavaScript 表达式：
```
    <!-- 切记不要习惯VUE的写法后使用表达式而去添加引号 -->
    const element = <img src={user.avatarUrl}></img>;
```
**接下来是用表达式将上面代码进行改造**
```
    <script type="text/babel">
        var Hello = React.createClass({
            render:function(){
                return  (
                    <h1>
                        Hello {this.props.str?this.props.str:'我是你的苍老师'}   
                    </h1>;
                ) 
            }
        });
        ReactDOM.render(
            <Hello str="王某人"/>,
            document.getElementById('box')
        )
    </script>
```
## **JSX数组输出**

```
<script type="text/babel">
  let arr = ['angular', 'react', 'vue'];
  var Arr = React.createClass({
    render() {
      return (
        <div>
          <ul>
            {arr.map((res,index) => {
              return <li key={res}>Hello,{res},{index}!</li>;
            })}
          </ul>
        </div>
      );
    },
  });
  ReactDOM.render(<Arr/>, document.getElementById('box'));
```
<font color=red>**注：**</font> 在使用循环时，需要注意添加key，虽不添加不会对我们的结果造成影响，但是控制台会报错，(吐槽一下，在用vue团队开发项目中在使用v-for 时 成员不使用key，控制台警告提示，作为强迫症的我很是难受 哈哈 所以要有良好的编码习惯 )，新版本的React需要使用key，key的作用是生成虚拟DOM时，需要使用key来进行标记,DOM更新时进行比较。

# **React组件：state**

## **state是什么？**
* React 的核心思想是组件化，而组件中最重要的概念是State（状态），State是一个组件的UI数据模型，  是组件渲染时的数据依据。
状态（state） 和 属性（props） 类似，都是一个组件所需要的一些数据集合，但是state是私有的，可以认为state是组件的“私有属性（或者是局部属性）”。

<font color=red>**注：**</font>props在后面会做解释

## **如何判断是否为State？**
* 这个变量是否是通过Props从父组件中获取？如果是，那么它不是一个状态。
* 这个变量是否在组件的整个生命周期中都保持不变？如果是，那么它不是一个状态。
* 这个变量是否可以通过其他状态（State）或者属性(Props)计算得到？如果是，那么它不是一个状态。
* 这个变量是否在组件的render方法中使用？如果不是，那么它不是一个状态。这种情况下，这个变量更适合定义为组件的一个普通属性，例如组件中用到的定时器，就应该直接定义为this.timer，而不是this.state.timer。

<font color=red>**注：**</font>并不是组件中用到的所有变量都是组件的状态！当存在多个组件共同依赖一个状态时，一般的做法是状态上移，将这个状态放到这几个组件的公共父组件中。

## **setState()**
**使用this.state.xxx是不会去改变状态值，必须使用this.setState去改变state状态值**

* 调用setState后，setState会把要修改的状态放入一个队列中（因而 组件的state并不会立即改变）；

* 之后React 会优化真正的执行时机，来优化性能，所以优化过程中有可能会将多个 setState 的状态修改合并为一次状态修改，因而state更新可能是异步的。

* 所以不要依赖当前的State，计算下个State。当真正执行状态修改时，依赖的this.state并不能保证是最新的State，因为React会把多次State的修改合并成一次，这时，this.state将还是这几次State修改前的State。另外需要注意的事，同样不能依赖当前的Props计算下个状态，因为Props一般也是从父组件的State中获取，依然无法确定在组件状态更新时的值。

```
<!-- 这样去做计算是错误的 -->
this.setState({
  counter: this.state.counter + this.props.increment,
});
```
要想解决上面错误，我们学使用 this.setState() 的另一种形式,使它接受一个函数而不是一个对象。这个函数有两个参数：
* 第一个是当前最新状态的前一个状态（本次组件状态修改前的状态）

* 第二个是当前最新的属性props

```
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));
```

## **关于state的demo**
```
<script type="text/babel">
    var  TextBoxComponent = React.createClass({
        <!-- getInitialState 必须有返回值  在es6中取消该写法采用 constructor() 方法-->
        getInitialState:function(){
            return {enable:false}
        },
        handleClick:function(event){
            this.setState({enable:!this.state.enable})
        },
        render:function(){
            return (
                <p>
                    <input type="text" disabled={this.state.enable} />
                    <button onClick={this.handleClick}>改变textbox状态</button>
                </p>
            )
        }
    });

    ReactDOM.render(<TextBoxComponent/>,document.getElementById("reactContainer"));
</script>
```
## **React组件：props和render成员**
props是组件固有属性的集合，其数据由外部传入，一般在整个组件的生命周期中都是只读的。属性的初识值通常由React.createElement函数或者JSX中标签的属性值进行传递，并合并到组件实例对象的this.props中。

**初识一下props**
```
<script type="text/babel">
    var Hello = React.createClass({
    getInitialState:function(){
        return {
            enable:false
        }
    },
    hand:function(event){
        this.setState({enable:!this.state.enable})
    },
    render: function() {
      return (
        <div>
            <h1>
               {'Hello' + this.props.name + this.props.sex}
            </h1>
        </div>
      );
    },
  });
  ReactDOM.render(<Hello name="王先森" sex="男"></Hello>, document.getElementById('box'));
  
</script>
```

## **State 与 Props 区别**
* props 是组件对外的接口，state 是组件对内的接口。
* State是可变的，是一组用于反映组件UI变化的状态集合；
* 而Props对于使用它的组件来说，是只读的，要想修改Props，只能通过该组件的父组件修改。
在组件状态上移的场景中，父组件正是通过子组件的Props, 传递给子组件其所需要的状态。
* state只能在所在组件内部更改，或在外部调用setState函数对状态进行间接修改。



