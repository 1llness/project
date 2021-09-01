
/** 
   * getStyle 获取样式 
   * startMove 运动主程序 
*/  
                   
  function getStyle(obj, attr){  
      if(obj.currentStyle)    {  
          return obj.currentStyle[attr]; //for ie 
     }else{  
         
         return getComputedStyle(obj, false)[attr];  // for ff
     }  
 }  
 function move(obj,json,fn){  
     //停止上一次定时器  
     clearInterval(obj.timer); //关闭前一个定时器，解决对同个对象同时调用多个Move()时，定时器叠加问题。使用obj.timer给每个调用Move()的对象赋予各自的定时器，防止多个对象同时调用Move()时，同用一个定时器，而导致相关干扰问题。 
     //保存每一个物体运动的定时器  
     obj.timer = setInterval(function(){  
         //判断同时运动标志  
         var bStop = true;  
         for(var attr in json){    
             //取当前值    
             var iCur = 0;  //创建一个变量，用于存储 attr属性每时每刻的值
             if(attr == 'opacity'){  
              //针对在FF中opacity属性值为浮点数值问题，将属性值 四舍五入、转换成浮点型。乘以100，使opacity属性值与IE统一为百分数
                 iCur = Math.round(parseFloat(getStyle(obj, attr))*100);  
             }else{  
                 iCur = parseInt(getStyle(obj,attr)); //将除opacity外的属性(width/fontSize/MarginLeft等)的初始值 转换为整型 
                
             }  
             //计算速度  
             var iSpeed = (json[attr] - iCur) / 8;  //创建 递减的速度speed变量。实现属性值的变速改变
             iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);  //取整，解决浏览器忽略小于1px的数值 导致运动结束时，离目标值Itarget少几个像素的问题
             //检测同时到达标志  
             
             if(iCur != json[attr]){  
                 bStop = false;  
             }     
             //更改属性，获取动画效果  
             if(attr=='opacity'){  
                 iCur += iSpeed  
                 obj.style.filter='alpha(opacity:' + iCur + ')';  
                 obj.style.opacity=iCur / 100;  
             }  
             else{  
                 obj.style[attr]=iCur+iSpeed+'px';  
             }  
         }  
         //检测停止  
         if(bStop){  
             clearInterval(obj.timer);  
             if(fn) fn.call(obj);  
         }  
     },30)  
  }