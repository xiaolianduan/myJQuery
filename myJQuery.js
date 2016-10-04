
// 创建构造函数
function jquery(selector,context){
	  this.flag=="jQuery"
	  if (/^<[a-z][a-z1-6]{0,6}>$/.test(selector)){
	  	  var createEle=document.createElement(selector.slice(1,-1))
	  	  this[0]=createEle;
	  	  this.length=1;
	  }else if (typeof selector=="string") {
		  var context=context||[document];
		  var reg=/[\.#]?[a-z][\w]*\b/g;
		  var selecArr=(selector.match(reg))
		  for (var i = 0; i < selecArr.length; i++) {
		     var context=this.getEle(selecArr[i],context)
		  };
		  for (var i = 0; i < context.length; i++) {
		  	 // 把每次循环的对象添加给 this
		  	 this[i]=context[i]
		  };
		  // 把要循环对象的长度添加给 this
		  this.length=context.length
	  }else if (typeof selector=="function") {
	  	  this.ready(selector)
	  }else if (typeof selector=="object"&&selector.nodeType==1){
	  	  // 当传入的参数是对象时,需要将此对象转换成类数组的Jquery的对象
	  	  this[0]=selector;
	  	  this.length=1;
	  }else if(typeof selector=="object"&&selector.flag=="jQuery"){
	  	  return selector;
	  }
}

// 添加到原型上的方法
jquery.fn=jquery.prototype={
	each:function(callback){
		for (var i = 0; i < this.length; i++) {
			// 循环目标数组,i指的是循环对象的下标,this[i]指每次循环的对象
			// 这里回调函数里的参数是实参
			callback(i,this[i])		
		};
	},
	click:function(callback){
		// index 指的是循环对象的下标,obj 指每次循环的对象
		this.each(function(index,obj){
			obj.onclick=function(){
				// 不使用call指向事件对象时,this指的是window
				callback.call(obj)
			}
		})
		// 返回对象本身,为了链式调用
		return this;
	},
	// 参数格式为json格式,需要用for..in..循环
	// i 指的是属性名, cssObj[i]指的是属性值
	mousemove:function(callback){
		this.each(function(index,obj){
			obj.onmousedown=function(){
				callback()
			}
		})
	},
	css:function(cssObj){
		this.each(function(index,obj){			
			for(var i in cssObj){
				if (i=="width"||i=="height") {
					obj.style[i]=cssObj[i]+"px"
				}else{
					obj.style[i]=cssObj[i]
				}				
			}
		})
		return this;
	},
	attr:function(attrObj){
		this.each(function(index,obj){
			for(var i in attrObj){			
				obj.setAttribute(i,attrObj[i])
			}
		})
		return this;
	},
	html:function(val){
		if (val) {
			this.each(function(index,obj){
				obj.innerHTML=val
			})			
		}else{
			return this[0].innerHTML;
		}
		return this;				
	},
	ready:function(obj){
		window.onload=function(){
			obj()
		}
	},
	getEle:function(selector,context){
	    var arr=[];
	    if (typeof selector=="string") {
	      if (selector.charAt(0)=="#") {
	        arr.push(document.getElementById(selector.substr(1)))
	      }else if(selector.charAt(0)=="."){
	        // 寻找在父元素数组中每个元素的子元素
	        for (var i = 0; i < context.length; i++) {
	          var objs=this.getClass(selector.substr(1),context[i])
	          for (var j = 0; j < objs.length; j++) {
	              arr.push(objs[j])
	          };
	        }
	      }else if(/^[a-z|1-6]{1,10}$/g.test(selector)){
	        for (var i = 0; i < context.length; i++) {
	          var objs=context[i].getElementsByTagName(selector)
	          for (var j = 0; j < objs.length; j++) {
	              arr.push(objs[j])
	          };
	        }         
	      }
	    }
	    return arr;
	},
	getClass:function(classname,context){
	  var context=context||document;
	  if(context.getElementsByClassName){
	     return context.getElementsByClassName(classname);
	  }else{
	    var all=context.getElementsByTagName("*");
	    var arr=[];
	    for(var i=0;i<all.length;i++){
	      if(this.checkClass(all[i].className,classname)){
	        	arr.push(all[i]);
	      }
	    }
	    return arr;
	  }		
	},
	checkClass:function(str,val){
	  var arr=str.split(" ");
	  for(var i in arr){
	    if(arr[i]==val){
	      return true;
	    }
	  }
	  return false;		
	},	
	// 获取的是原生对象,必须用原生的方法
	// 所以必须将它转换为类数组jquery对象,才可以调用jquery对象的属性和方法
	eq:function(num){		
		this[0]=this[num];
		this.length=1
		return this;
	},

	// 返回的是下标数字,不是返回jquery对象,所以不能调用jquery对象的属性和方法
	index:function(ele){
       for(var i=0;i<this.length;i++){
       	   // 循环对象,当某对象与参数相等时,返回某对象的下标
           if(this[i]==ele){
               return i;
           }
           // return this  没有任何意义,return只会执行一次
       }
	},
	append:function(parent){
		var parent=parent||document.body;
		parent.appendChild(this[0])
		return this;
	},
	get:function(num){
		return this[num];
	},
	extend:function(obj){
		for(var i in obj){
			jquery.fn[i]=obj[i]
		}
	}
}

// 省下每次需要实例化,就可以直接调用
function $ (selector,context) {
	// 返回新创建的实例对象
	return new jquery(selector,context)
}

window.jQuery=$