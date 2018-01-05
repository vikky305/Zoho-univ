var http =require('http');
var url=require('url');
var fs=require('fs');
var request=require('request');
var qs=require('querystring');
http.createServer(form).listen(8080);

function form(req,res) {
    body="";
    var a=url.parse(req.url,true);
    var path=a.pathname.slice(1);
    var number=Number(path);
    if(a.pathname=="/"){
        res.write(fs.readFileSync("url.html"));
        res.end();
    }
    else if(a.pathname=="/add"){
        if(req.method=='POST'){
            req.on('data',function(chunk){
                body+=chunk;
            });
            req.on('end',function(){
               addcheck(body); 
            });
        }
    }
    else if(isNaN(number)){    }
    else{
         request.get({
                url:'https://creator.zoho.com/api/json/api/view/url_Report?number='+number,
                headers: { 'Authorization':'9c8dce45da7be621057f18366088b4d8',        
                           'Scope' : 'creatorapi'},
            },function(error, response, body){
                var userde=JSON.parse(body.substring(body.indexOf("{"),body.lastIndexOf("}")+1)).url[0];
                res.write('<script>location.replace("'+userde.url+'");</script>');
                res.end();
            });
    }
    function addcheck(body){
        var object=qs.parse(body);
        if(req.url=="/add"){
            request.post({
                url:'https://creator.zoho.com/api/vigneshwaran46/json/api/form/url/record/add',
                headers:{
                    'Authorization':'9c8dce45da7be621057f18366088b4d8',
                    'Scope':'creatorapi'
                },
                form:object
            },function(error,response,body){
                show(object.url);

            });
        }
        
    }
    function show(url){
        
         request.get({
                url:'https://creator.zoho.com/api/json/api/view/url_Report?url='+url,
                headers: { 'Authorization':'9c8dce45da7be621057f18366088b4d8',        
                          'Scope' : 'creatorapi'},
            },function(error, response, body){
                var userde=JSON.parse(body.substring(body.indexOf("{"),body.lastIndexOf("}")+1)).url[0].number;
                res.write('http://vigneshwaranp-9556.zcodeusers.com/'+userde);
                res.end();
            });
    }
}