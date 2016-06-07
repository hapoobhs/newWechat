var PORT=9529;
var http=require('http');
var qs=require('qs');
var replyText=require('./reply.js').replyText;
var TOKEN = 'hahaha';
var getUserInfo=require('/user.js').getUserInfo;

var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io');
 var io = require('./socket.js').wss;


function checkSignature(params,token)
{

  var key=[token,params.timestamp,params.nonce].sort().join('');
  var sha1=require('crypto').createHash('sha1');
  sha1.update(key);

  return  sha1.digest('hex')==params.signature;
}
var server=http.createServer(function(request,response)
{

  var query=require('url').parse(request.url).query;
  var params=qs.parse(query);

  
  if(!checkSignature(params,TOKEN))
  {
  
    response.end('signature fail');
    return ;
  }
  if(request.method=='GET')
  {
    response.end(params.echostr);
  }
  else
  {
    var postdata="";
    request.addListener("data",function(postchunk){
      postdata+=postchunk;
    });

    request.addListener("end",function()
    {
      var parseString =require('xml2js').parseString;
      parseString(postdata,function(err,result)
      {
        if(!err)
        {
           console.log(result+"result====");

           //if(result.xml.MsgType[0] === 'text'){
                        getUserInfo(result.xml.FromUserName[0])
                            .then(function(userInfo){
                                //获得用户信息，合并到消息中
                                result.user = userInfo;
                                //将消息通过websocket广播
                                
                               io.broadcast(result);
                                var res = replyText(result);

                                response.end(res);
                            })
                  //  }

                  //  else
                   // {
                   //    var res = replyText(result);

                   //             response.end(res);
                   // }

        
        }
      });
     
    });
  }
});

server.listen(PORT);
console.log(PORT);
var express = require('express');
var app = express();
app.get('/index',function(req,res){
    var options = {
        root:__dirname,
        headers:{
            'Upgrade':'websocket'
        }
    };
    res.sendFile('/index.html',options);
});
app.listen(80);