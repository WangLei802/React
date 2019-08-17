    https://github.com/thinkeridea/jsonDB

    //创建一张user数据表，并定义一个DB的jsonDB别名
    var data = [{username:'张三',sex:'男',birthday:{year:2000,month:6,day:18}},{username:'李红',sex:'女',birthday:{year:1986,month:9,day:22}}];
    //以下方法可以通过两种方式获取别名，一个是通过init方法获取(推荐)，一个是获取jsonDB()方法的返回值
    //以后示例中都将使用init()方法创建的别名操作数据
    var jDB = jsonDB(data,'user').init('DB');

    //插入一条新的数据
    data = {username:'李想',sex:'男',birthday:{year:1990,month:2,day:15}};
    DB.insert(data,'user');

    //查询姓名为李红的性别,where条件必须加()否者会出现错误
    var result =DB.query('select sex from user where (username="李红")');
    //结果：[{"sex":"女"}]

    //查询2000年之前出生的且按出生年先后排序
    var result =DB.query('select * from user where (birthday.year<2000) order by birthday.year asc');
    //结果：[{"username":"李红","sex":"女","birthday":{"year":1986,"month":9,"day":22}},{"username":"李想","sex":"男","birthday":{"year":1990,"month":2,"day":15}}]

    //查询年龄最小的两个人
    var result =DB.query('select * from user order by birthday.year desc limit 2');
    //查询结果：[{"username":"张三","sex":"男","birthday":{"year":2000,"month":6,"day":18}},{"username":"李想","sex":"男","birthday":{"year":1990,"month":2,"day":15}}]

    //修改李红的出生日期
    var result =DB.query('update user set birthday.year=1991 where (username="李红") limit 1');
    //影响条数为一条，可以通过DB.findAll('user')获取全部数据查看是否被修改成功

    //删除姓名为李想的数据
    var result =DB.query('delete from user where (username="李想") limit 1');
    //影响条数为一条，可以通过DB.findAll('user')获取全部数据查看是否被删除成功

    //数据库中所有数据
    //[{"username":"张三","sex":"男","birthday":{"year":2000,"month":6,"day":18}},{"username":"李红","sex":"女","birthday":{"year":1991,"month":9,"day":22}}]