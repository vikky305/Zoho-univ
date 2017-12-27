var http =require('http');
var url=require('url');
var fs=require('fs');
var request=require('request');
var qs=require('querystring');
var home=fs.readFileSync("fitnics.html");
var userde;
var det;
var redis    = require('redis');
var client   = redis.createClient();
    client.on('connect',function(){
        console.log('connected');
    });
http.createServer(form).listen(8080);

function form(req,res) {
    var body="";
    res.writeHead(200, {'Content-Type': 'text/html'});
    var a=url.parse(req.url,true);
    
    if(a.pathname=="/"){
        if(req.headers.cookie!==undefined){
            res.write('<script>location.href="/fitness"</script>');
            res.end();
        }
        else{
            res.write(fs.readFileSync("signup.html"));
            res.end();
        }
    }
    
    else if(a.pathname=="/signup"){
        if(req.method=='POST'){
            req.on('data',function(chunk){
                body+=chunk;
            });
            req.on('end',function(){
              signupcheck(body); 
            });
        }
    }
    
    else if(a.pathname=="/signin"){
        if(req.method=='POST'){
            req.on('data',function(chunk){
                body+=chunk;
            });
            req.on('end',function(){
              signincheck(body); 
            });
        }
    }
    
    else if(a.pathname=="/fitness"){
        if(req.headers.cookie===undefined){
            res.write('<script>location.href="/"</script>');
            res.end();
        }
        else{
            res.write(home);
            res.end();
        }
    }
    
    else if(a.pathname=="/load"){
        if(req.method=='POST'){
            req.on('data',function(chunk){
                body+=chunk;
            });
            req.on('end',function(){
              load(body); 
            });
        }
    }
    
    else if(a.pathname=="/dataAdd"){
        if(req.method=='POST'){
            req.on('data',function(chunk){
                body+=chunk;
            });
            req.on('end',function(){
              edit(body); 
            });
        }
    }
    
    else if(a.pathname=='/add'){
        if(req.method=='POST'){
            req.on('data',function(chunk){
                body+=chunk;
            });
            req.on('end',function(){
              edit(body); 
            });
        }
    }
    
    else if(a.pathname=='/add1'){
        if(req.method=='POST'){
            req.on('data',function(chunk){
                body+=chunk;
            });
            req.on('end',function(){
              daily(body); 
            });
        }
    }
    
    else if(a.pathname=="/addfood"){
        if(req.method=='POST'){
            req.on('data',function(chunk){
                body+=chunk;
            });
            req.on('end',function(){
              add(body); 
            });
        }
    }
    
    else if(a.pathname=="/get"){
        var Name=a.query.Id;
        console.log(Name)
        request.get({
            url:'https://creator.zoho.com/api/json/api/view/calorie_Report?ID='+Name,
            headers:{
                'Authorization':'9c8dce45da7be621057f18366088b4d8',
                'Scope':'creatorapi'
            },
        }
        ,function(error,response,body){
            var a=JSON.parse(body.substring(body.indexOf("{"),body.lastIndexOf("}")+1)).calorie;
            a=JSON.stringify(a);
            res.write(a);
            res.end();
        });
    } 

    else if(a.pathname=="/graph"){
        var name=qs.parse(req.headers.cookie);
        var email=name.Email;
        client.hgetall('dailyCount', function(err, object) {
            if(object==null||object[email]===undefined){
                res.write('data');
                res.end();
            }
            else{
                var data=JSON.parse(object[email]);
                data=JSON.stringify(data);
                res.write(data);
                res.end();
            }
            
        });
        // request.get({
        //     url:'https://creator.zoho.com/api/json/api/view/daily_count_Report?Email='+email,
        //     headers:{
        //         'Authorization':'9c8dce45da7be621057f18366088b4d8',
        //         'Scope':'creatorapi'
        //     },
        // }
        // ,function(error,response,body){
        //     var a=JSON.parse(body.substring(body.indexOf("{"),body.lastIndexOf("}")+1)).daily_count;
        //     a=JSON.stringify(a);
        //     res.write(a);
        //     res.end();
        // });
    }
    
    else if(a.pathname=="/delete"){
        var name1=qs.parse(req.headers.cookie);
        client.HDEL('userInformation',(name1.Email).toString());
        client.HDEL('dailyCount',(name1.Email).toString());
        res.end("account delete sucessfully");
    }
    
    else if(a.pathname=="/forget"){
        if(req.method=='POST'){
            req.on('data',function(chunk){
                body+=chunk;
            });
            req.on('end',function(){
                var data=qs.parse(body);
                client.hgetall('userInformation', function(err, object) {
                    var a=data.Email;
                    object[a]=JSON.parse(object[a]);
                    var object12={"fromAddress": "vigneshwaran.p@zohouniv.com","toAddress": a,"subject": "This is your password ","content": "please enter this in the fitnics app "+"  "+"<h1 style='color:blue;'>"+object[a].Password+"<h1>"};
                    if(object[a]!==undefined){
                        request.post({
                            url:'https://mail.zoho.com/api/accounts/3613221000000008001/messages',
                            headers:{
                                'Authorization':'Zoho-authtoken d849261954b33c9058e59e371d6d04ac'
                            },
                            body:JSON.stringify(object12),
                            method :'POST'
                            },function(error,response,body){
                                res.write("Email sent to you");
                                res.end();
                        });
                        
                    }
                    else{
                        res.write("email doesn't exist please enter correct email id");
                        res.end();
                    }
                });
            });
        }
    }
    
    else if(a.pathname=="/forget1"){
        if(req.method=='POST'){
            req.on('data',function(chunk){
                body+=chunk;
            });
            req.on('end',function(){
                var data=qs.parse(body);
                client.hgetall('userInformation', function(err, object) {
                    var a=data.Email;
                    object[a]=JSON.parse(object[a]);
                    if(data.Password==object[a].Password){
                        res.write("signin successful");
                        res.end();
                    }
                    else{
                        res.write("password mismatch");
                        res.end();
                    }
                });
            });
        }
    }
    
    function signupcheck(body){
        var data=qs.parse(body);
        var email=data.Email;
        data.calorie =0; 
        if(req.url=="/signup"){
            client.hgetall('userInformation', function(err, object) {
                var a=data.Email;
                if(object==null||object[a]===undefined){
                    client.hmset('userInformation',(email).toString() , JSON.stringify(data));
                    res.write("Signup sucessfully");
                    res.end();
                }
                else{
                    res.write("email already exist please use different email id");
                    res.end();
                }
            });
        }
    }
    
    function signincheck(body){
        var data=qs.parse(body);
        if(req.url=="/signin"){
            client.hgetall('userInformation', function(err, object) {
                var a=data.Email;
                if(object[a]!==undefined){
                    object[a]=JSON.parse(object[a]);
                    if(data.Password==object[a].Password){
                        res.write("signin successful");
                        res.end();
                    }
                    else{
                        res.write("password mismatch");
                        res.end();
                    }
                }
                else{
                    res.write("email doesn't exist please enter correct email id");
                    res.end();
                }
            });
        }
    }
    
    function load(body){
        var data=qs.parse(body);
        if(req.url=="/load"){
            client.hgetall('userInformation', function(err, object) {
                var a=data.Email;
                det = JSON.stringify(object[a]);
                res.write(""+det);
                res.end();
            });
        }
    }
    
    function edit(body){
        var name=qs.parse(req.headers.cookie);
        var object=qs.parse(body);
        var data=JSON.parse(det);
        data=JSON.parse(data);
        for(i=0;i<Object.keys(object).length;i++){
            data[Object.keys(object)[i]] =object[Object.keys(object)[i]];
        }
        client.hmset('userInformation',(name.Email).toString() , JSON.stringify(data));
        res.write("data added sucessfully");
        res.end();
    }
    
    function add(body){
        var object=qs.parse(body);
        if(req.url=="/addfood"){
            request.post({
                url:'https://creator.zoho.com/api/vigneshwaran46/json/api/form/calorie/record/add',
                headers:{
                    'Authorization':'9c8dce45da7be621057f18366088b4d8',
                    'Scope':'creatorapi'
                },
                form:object
            },function(error,response,body){
                res.write("food added sucess fully");
                res.end();
            });
        }
    }
    
    function daily(body1){
        
        var name=qs.parse(req.headers.cookie);
        var data=qs.parse(body1);
        client.hgetall('dailyCount', function(err, object) {
            var a=name.Email;
            if(object==null||object[a]===undefined){
                client.hmset('dailyCount',(a).toString() , JSON.stringify(data));
                res.end();
            }
            else if(Object.keys(JSON.parse(object[a])).indexOf(Object.keys(data)[0])!=-1){
                var data1=JSON.parse(object[a]);
                data1[Object.keys(data)[0]]=Number(JSON.parse(object[a])[Object.keys(data)[0]])+Number(data[Object.keys(data)[0]])
                client.hmset('dailyCount',(a).toString() , JSON.stringify(data1));
                res.end();
            }
            else{
                var data1=JSON.parse(object[a]);
                data1[Object.keys(data)[0]]=data[Object.keys(data)[0]];
                client.hmset('dailyCount',(a).toString() , JSON.stringify(data1));
                res.end();
            }
        });
    }
    
    
    
    
}