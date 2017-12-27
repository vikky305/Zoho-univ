var http =require('http');
var url=require('url');
var fs=require('fs');
var request=require('request');
var qs=require('querystring');
var home=fs.readFileSync("home.html");
var add=fs.readFileSync("add.html");
var edit1=fs.readFileSync("edit1.html");
var delete1=fs.readFileSync("delete.html");
http.createServer(form).listen(8080);

function form(req,res) {
    var body="";
    res.writeHead(200, {'Content-Type': 'text/html'});
    var a=url.parse(req.url,true);
    if(a.pathname=="/"){
        res.write(home);
        res.end();
    }
    else if(a.pathname=="/add"){
        if(req.method=='POST'){
            res.write("data added sucess fully")
            req.on('data',function(chunk){
                body+=chunk;
            });
            req.on('end',function(){
               addcheck(body); 
            });
            res.end();
        }
        else{
            res.write(add);
            res.end();
        }
    }
    else if(a.pathname=="/edit"){
        res.write(fs.readFileSync("edit.html"));
        res.end();
    }
    else if(a.pathname=="/delete"){
        res.write(delete1);
        res.end();
    }
    else if(a.pathname=="/deleted"){
	    req.on('data',function(chunk){
            body+=chunk;
        });
        req.on('end',function(){
          del(body); 
        });
	}
    else if(a.pathname=="/check"){
        var Name=a.query.user;
        res.writeHead(200,{'set-Cookie':"user="+Name , 'content-type':'text/html'});
        request.get({
            url:'https://creator.zoho.com/api/json/api/view/api_call_Report?user='+Name,
            headers:{
                'Authorization':'9c8dce45da7be621057f18366088b4d8',
                'Scope':'creatorapi'
            },
        }
        ,function(error,response,body){
                var val=JSON.parse(body.substring(body.indexOf("{"),body.lastIndexOf("}")+1));
                val1=val.api_call;
                if(val1.length!==0){
                    res.write("finish");
                    res.end();
                }
                else{
                    res.write('enter valid name');
                    res.end();
                }
        });
    } 
    else if(a.pathname=="/edited"){
        res.write(edit1);
        res.end();
    }
    else if(a.pathname=='/update'){
        if(req.method=='POST'){
            req.on('data',function(chunk){
                body+=chunk;
            });
            req.on('end',function(){
              edit(body); 
            });
        }
    }
    else if(a.pathname=="/load"){
        val1 = JSON.stringify(val1[0]);
        res.write(val1);
        res.end();
    }
    else {
         res.end();
    }
    function addcheck(body){
        var object=qs.parse(body);
        if(req.url=="/add"){
            request.post({
                url:'https://creator.zoho.com/api/vigneshwaran46/json/api/form/api_call/record/add',
                headers:{
                    'Authorization':'9c8dce45da7be621057f18366088b4d8',
                    'Scope':'creatorapi'
                },
                form:object
            },function(error,response,body){
                res.write("data added sucess fully");
                res.end();
            });
        }
    }
    function edit(body){
         var name=req.headers.cookie;
            var object=qs.parse(body);
            console.log(object)
            console.log(name)

            if(req.url=="/update"){
                object.criteria=name;
                request.post({
                    url:'https://creator.zoho.com/api/vigneshwaran46/json/api/form/api_call/record/update',
                    headers:{
                        'Authorization':'9c8dce45da7be621057f18366088b4d8',
                        'Scope':'creatorapi'
                    },
                    form:object
                    },function(error,response,body){
                        console.log(body)
                        console.log(error)
    			        res.writeHead(200, {'Content-Type': 'text/html','Set-Cookie':req.headers.cookie+'; expires=Thu, 01 Jan 1970 00:00:00 GMT'});
                        res.write("data edited sucessfully");
                    	res.end();
                });
            }
    }
    function del(body){
        if(req.url=="/deleted"){
            request.post({
            url:'https://creator.zoho.com/api/vigneshwaran46/json/api/form/api_call/record/delete',
            headers:{
                'Authorization':'9c8dce45da7be621057f18366088b4d8',
                'Scope':'creatorapi'
            },
                form:{'criteria':body}
                },function(error,response,body){
                    res.write("data deleted sucessfully");
                    res.end();
            });
        }}
}