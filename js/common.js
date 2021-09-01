/*
 * @作者 张三 李四
 * @功能 提供公共方法
 * @日期 2021.6.18
*/

/*
 * @方法 $
 * @描述 根据参数来获取元素
 * @参数 css css表达式 例如：span[name=aa]
 * @参数 el 元素对象 例如：document.getElementById('aa')
 * @返回 元素 
 * @示例 $('.aa',document.getElementById('aa'))
 	$('.aa',$('#bb'))
 */
function $(css,el){
	el = el || document;
	return el.querySelector(css);
}
/*
 * @方法 _
 * @描述 根据参数来获取元素集合
 * @参数 css css表达式 例如：span[name=aa]
 * @参数 el 元素对象 例如：document.getElementById('aa')
 * @返回 元素集合 
 * @示例 _('.aa',document.getElementById('aa'))
 	_('.aa',$('#bb'))
 */
function _(css,el){
	el = el || document;
	return el.querySelectorAll(css);
}
/*
 * @方法 each
 * @描述 数组循环并执行自定义函数
 * @参数 arr 数组(包含类数组)
 * @参数 callback 回调函数
 * @返回 没有返回
 * @示例 each([1,2,3],function(el,index){
		console.log(el,index)
		//el代表元素，index代表下标
 	})
*/
function each(arr,callback){
	for(var i=0;i<arr.length;i++){
		callback(arr[i],i);
	}
}
/*
 * @方法 makeListToArray
 * @描述 将集合转换成数组
 * @参数 list 集合
 * @返回 将转换的数组返回
*/
function makeListToArray(list){
	var arr = [];
	for(var i=0;i<list.length;i++){
		arr.push(list[i]);
	}
	return arr;
}
/*
 * @方法 extend
 * @描述 将多个对象参数复制到一个对象中
 * @参数 第一个参数是目标对象，其它所有的对象都复制到这个对象中
 * @示例 extend({},{name:123},{age:21});
*/
function extend(){
	//arguments 所有的参数集合
	var arr = makeListToArray(arguments);
	var obj = arr.shift();
	var element;
	for(var i=0;i<arr.length;i++){
		element = arr[i];
		for(var index in element){
			obj[index] = element[index];
		}
	}

	return obj;
}

/*
 * @描述 创建XMLHttpRequest
 * @函数 getRequest
 * @返回 XMLHttpRequest对象
*/
function getRequest(){
	var xmlHttp;
	if(window.XMLHttpRequest){
		xmlHttp = new XMLHttpRequest();
	}else{
		xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	return xmlHttp;
}
/*
 * @描述 发送请求，接收数据
*/

function ajax(obj){
	var url = obj.url,
		method = obj.method || 'GET',
		param = obj.param || '',
		//async必须是字符串
		async = obj.async || true,
		callback = obj.callback || function(){};
	var xmlHttp = getRequest();
	xmlHttp.onreadystatechange = function(){
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
			if(xmlHttp.responseXML){
				callback(xmlHttp.responseXML);
				return;
			}
			callback(JSON.parse(xmlHttp.responseText));
		}
	}
	
	xmlHttp.open(method,url,eval(async));
	if(method === 'POST'){
		xmlHttp.setRequestHeader ("content-type", "application/x-www-form-urlencoded" )		
	}
	xmlHttp.send(param);
}
/*
 * @描述 加载页面
 * @函数 load
 * @参数 obj 里面包括obj.el 元素对象
 * @参数 obj.url 地址
 * @示例 load({
	 el : $('#id'),
	 url : '地址'
 });
*/
function load(obj){
	var el = obj.el;
	var url = obj.url;
	var xmlHttp = getRequest();
	xmlHttp.onreadystatechange = function(){
		
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
			
			el.innerHTML = xmlHttp.responseText;
		}
	}
	
	xmlHttp.open('GET',url,true);
	xmlHttp.send();
}

var cookie = {};
/*
 * @描述 设置cookie
 * @函数 cookie.set
 * @参数
*/
cookie.set = function(key,value,day){
	day = day || 1;
	var date = new Date();
	var expires;
	date.setTime(date.getTime()+day*24*60*60*1000);
	expires = 'expires='+date.toGMTString();
	document.cookie=key+'='+value+';'+expires+';path=/';
}
/*
 * @描述 获取cookie
 * @函数 cookie.get
 * @参数 key
*/
cookie.get = function(key){
	var cookie = document.cookie;
	var arr = cookie.split(';');
	var obj = {};
	var element;
	for(var i=0;i<arr.length;i++){
		element=arr[i].split('=');
		obj[element[0]] = element[1];
	}
	return obj[key] ? obj[key] : obj[' '+key];
}
/*
 * @描述 删除cookie
 * @函数 cookie.remove
 * @参数 key 键
*/
cookie.remove = function(key){
	cookie.set(key,cookie.get(key),-1);
}

/*
	* @所有方法的集合
*/
var method={}
/*
 	* @ 元素显示
	* @ 参数 obj键值对集合
	* @ 参数 obj.attr fade淡入淡出
	* @ 参数 obj.attr slide 划入划出
*/
method.show=function(obj){
	var el=obj.el
	var attr=obj.attr// fade slide
	//el.style.opacity='0'
	switch(attr){
		case 'fade':
			el.style.display='block'
			move(el,{
				opacity:100
			})
			break
		case 'slide':
			el.style.display='block'
			move(el,{
				width:parseInt(el.width),
				height:parseInt(el.height)
			})
		case 'roll':
			el.style.display='block',
			move(el,{
				height:parseInt(el.height)
			})
			break
	}
	
	
}
/*
 	* @ 元素隐藏
	* @ 参数 obj键值对集合
*/
method.hide=function(obj){
	var el=obj.el
	var attr= obj.attr
	switch(attr){
		case 'fade':
			move(el,{
				opacity:0
			},function(){
				el.style.display='none'
			})
			break
		case 'slide':
			el.width= getStyle(el,'width')
			el.height=getStyle(el,'height')
			console.log(el.width,el.height)
			move(el,{
				width:0,
				height:0
			})
		case 'roll':
			el.height=getStyle(el,'height')
			move(el,{
				height:0
			})
	}
}


/*
 	* @ 给元素设置键值对
 */
method.data=function(el,key,value){
	if(!value){
		return el[key]
	}
	el[key]=value
}

method.removeData=function(el,key){
	if(!el[key]){
		throw TypeError(`没有${key}`)
	}

	delete el[key]
}

