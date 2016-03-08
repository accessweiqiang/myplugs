// JavaScript Document
//移动端广告轮播
;(function($){
	$.fn.slideAdvertise = function(voptions){
		
		//默认参数
		var defaults = {  
					interval : 5000,//自动滚动的时间间隔
					duration : 200, //动画切换的速度
                    buttonPosition : "center",       //按钮位置默认居中
					radio : false  ,//图片比列h/w,如果定义则按照比列设置高度，如果没有定义则去slide容器的高度
					has_btn : true,//是否显示按钮
					autoscroll: true ,//是否滚动
					margin:0
        };
		//扩展参数  
		$.extend(defaults,voptions);
		//遍历每个元素
		this.each(function(){
			//定义变量
			var $adslide = $(this);//slideContainer
			var Timer,offsetX,startX,startTime,offsetTime,startLeft;
			var interval = defaults.interval;
			var scale = $adslide.width()!=0 ? $adslide.width()-defaults.margin : $(window).width()-defaults.margin;//slide的宽度
			var slideHeight = $adslide.height();
			var imgheight = defaults.radio ? scale*defaults.radio : slideHeight;
			var bounbary = scale/6;
			
			var length = $adslide.find(".item").length;
			var duration = defaults.duration;
			var currIndex = 1;//起始索引
			
			var $list = $adslide.children(".list");//imageContainer
			var list = $list[0];
			var $imgs = $list.children(".item");
			var $button,$circles; 
			$list.css({left:-scale+"px"});
			
			//定义函数
			//设置定时器
			function setTimer(){
				Timer = setInterval(function(){
					currIndex++;
					goIndex(currIndex);
					
				},interval)
			}
			function clearTimer(){
				$adslide.find(":animated").stop(true,true);
				clearInterval(Timer);
			}
			//跳转
			function goIndex(i){
				if(currIndex>length){
					$list.animate({left:(-(i+0)*scale)+"px"},duration,function(){
						$list.css({left:-scale+"px"})
					});
					currIndex = 1;
				}else if(currIndex < 1){
					$list.animate({left:(-(i+0)*scale)+"px"},duration,function(){
						$list.css({left:-scale*length+"px"})
					});
					currIndex = length;
				}else {
					$list.animate({left:(-(i+0)*scale)+"px"},duration)
				}	
				$circles.eq(currIndex-1).css("background","#428bca").siblings().css("background","#D3D3D3");
			}
			
			//开始触摸
			function startHandler(event){
				clearTimer();//触摸的时候，停止滚动
				startX = event.touches[0].pageX;
				startTime = new Date()*1;
				startLeft =  $list.css("left").replace("px","")*1;
				offsetX = 0;
				 
			}
			//移动
			function moveHandler(event){
				 offsetX = event.touches[0].pageX - startX;
				 if($list.is(":animated")){ return false;}
				 $list.css("left",(startLeft+offsetX)*1+"px");
			}
			//触摸结束
			function endHandler(event){
				setTimer();
				offsetTime = new Date()*1 - startTime;
				if(offsetTime>300){
					if(offsetX>bounbary){
						currIndex--;
						goIndex(currIndex);
					}else if(offsetX<-bounbary){
						currIndex++;
						goIndex(currIndex);
					}
				}else{
					//优化
					//快速移动也能使得翻页
					if(offsetX > 50){
						currIndex--;
						goIndex(currIndex);
					}
					else if(offsetX < -50){
						currIndex++;
						goIndex(currIndex);
					}
					else{
						goIndex(currIndex);
					}
				}
			}
			function render(){
				//创建按钮元素
				var $vbtns = $('<div class="buttons"></div>');
				var $vcircle = $(' <sapn class="circle" ></span>');
				
				for(var i = 0 ; i<length ; i++)
				{
					$vbtns.append($vcircle.clone());
				}
				$adslide.append($vbtns);
				$button = $adslide.children(".buttons"); 
				$circles = $button.children(".circle");
				
				//复制首尾图片元素,分别到尾部，和首部
				$firstImg = $imgs.first().clone();
				$lastImg = $imgs.last().clone();
				$list.prepend($lastImg).append($firstImg);
				$imgs = $list.children(".item");
				//设置样式
				//slide容器
				$adslide.css({ width:scale+"px",margin:"0px auto",height:imgheight+"px",overflow:"hidden",position:"relative"})
				//list
				$list.css({width:(length+2)*scale+"px",position:"absolute"})
				//图片
				$imgs.each(function(index,element){
					$(this).css({"height":imgheight+"px","width":scale+"px","float":"left"})
				})
				//按钮
				$button.css({position:"absolute","bottom":"10px"})
				$circles.css({float:"left",display:"inline-block",width:"10px",height:"10px",background:"#D3D3D3","border-radius":"100%","margin-left":"10px"})
				$circles.first().css({margin:"0px","background":"#428bca"})
				switch(defaults.buttonPosition){
						case "center" : $button.css("left",(scale-$button.width())/2+"px"); break;
						case "left" : $button.css("left","20px"); break;
						case "right" : $button.css("right","20px"); break;
				}
				//是否显示
				if(defaults.has_btn){
					$vbtns.show();
				}else{
					$vbtns.hide();
				}
			}
			
			
			//渲染
			render();
			
			//绑定事件
			list.addEventListener('touchmove', moveHandler,false);
			list.addEventListener("touchstart",startHandler,false);
			list.addEventListener("touchend",endHandler,false);
			//设置定时器
			if(defaults.autoscroll){
				setTimer();
			}
		
			return $adslide;
		})// end each
		
	}//end plugin
})(jQuery)