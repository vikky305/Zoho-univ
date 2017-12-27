var http =require('http');
var url=require('url');
var fs=require('fs');
var request=require('request');
var qs=require('querystring');
var body;
var redis    = require('redis');
var client   = redis.createClient();
    client.on('connect',function(){
        console.log('connected');
    });
http.createServer(form).listen(8080);

function form(req,res) {
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    var a=url.parse(req.url,true);
    if(a.pathname=="/"){
        res.write(fs.readFileSync("index.html"));
        res.end();
    }
    
    else if(a.pathname=="/signup"){
        if(req.method=='POST'){
            body="";
            req.on('data',function(chunk){
                body+=chunk;
            });
            req.on('end',function(){
                body=qs.parse(body);
                if(Object.keys(body).length>2){
                    signup(body);
                }
                else{
                   signin(body);
                }
            });
        }
    }
    
    else if(a.pathname=="/view"){
        if(body.Firstname==undefined){
            client.hgetall('Userdetails', function(err, object) {
                var email=body.Email;
                var data=object[email];
                data=JSON.parse(data);
                res.write("hi "+data.Firstname+" "+data.Lastname);
                res.end();
            });
        }
        else{
            res.write("hi "+body.Firstname+" "+body.Lastname);
            res.end();
        }
    }
    
    function signup(data){
        client.hgetall('Userdetails', function(err, object) {
            var a=data.Email;
            if(object[a]===undefined){
                client.hmset('Userdetails',(data.Email).toString() , JSON.stringify(data));
                res.write("signup success");
                res.end();
            }
            else{
                res.write("email id exist try another");
                res.end();
            }
        });
    }

    function signin(data){
        client.hgetall('Userdetails', function(err, object) {
            var a=data.Email;
            object[a]=JSON.parse(object[a]);
            if(object[a]!==undefined){
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
                res.write("account doesn't exist");
                res.end();
            }
        });
    }
        
    
}

