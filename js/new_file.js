/* timeAxis 时间轴插件
   author :liulingli
   date: 2017-01-13
 * */

;
(function() {
	var methods = {
		init: function(options) {
			return this.each(function() {
				var $this = $(this);
				//定义属性
				var defaults = {
					type : 'month', //可选'year'、'month'、'day'、'hour',默认'month'
					beginDate : '',//时间轴开始日期
					endDate :'', //时间轴结束时间
					curDate:new Date() //时间轴当前显示时间
				};			
			//合并默认参数opt和defaluts
				settings = $.extend({}, defaults, options);
				methods.TimeAxis.call($this, settings);
			})
		},
		TimeAxis:function(){
			return this.each(function(){
				var $this = $(this),
				    setting = settings;
				/******** 私用静态方法  ***********************/
				var RULES = {
					isDate:function(date){//判断时间是否合法
						
					},
					getYear:function(date){ //获取年份
						var year = date.getFullYear();
						return year;
					},
					getMonth:function(date){//获取月份
						var month = date.getMonth() + 1;
						return month;
					},
					getDate:function(date){ //获取当月几号
						var day = date.getDate();
						return day;
					},
					getHour:function(date){
						var hour = date.getHours();
						return hour;
					},
					getDaysInMonth:function(year,month){  //根据年月获取当月天数
						if(month<=0){
							month = month+12;
							year = year-1;
						}else if(month>12){
							month = month-12;
							year = year+1;
						}
						var month = parseInt(month,10),
						    temp = new Date(year,month,0); 
						return temp.getDate(); 
					},
					parseDate:function(type,date,disX,days){
						if(type=='day'){
						var $showDate = $this.find("#showDate"),
						    _year = $showDate.attr("data-year"),
						    _month = $showDate.attr("data-month"),
						    disday = disX/32,
						    year = RULES.getYear(date),
						    month = RULES.getMonth(date),
						    day = RULES.getDate(date),
						    hour = RULES.getHour(date),
							cday = parseInt(day)- parseFloat(disday)+parseInt(hour)/24,
							chour = Math.round((cday-Math.floor(cday))*24),
	                        showDay = Math.floor(cday);
	                        if(disX<0){
	                        	daysNext  = RULES.getDaysInMonth(_year,_month-1);//获取当月天数
	                        }
							daysNext  = RULES.getDaysInMonth(_year,_month);//获取当月天数
					        if(showDay>days){				        	
					        	if(parseInt(showDay)-parseInt(daysNext)==1){
					        	   cmonth = parseInt(month)+1;	
					        	}
					        	if(cmonth>12){
					        	    cmonth = cmonth-12;
					        	    if(cmonth-12==1)
					        		cyear = year+1;	
					        	}				        	
					        	showD = showDay-days;
					        	cyear = year;
					        }else if(showDay<=0){
					        	days = RULES.getDaysInMonth(year,month-1);//获取当月天数
					        	showD = showDay+days;
					        	cmonth = month-1;
					        	if(cmonth<=0){
					        		cmonth = cmonth+12;	
					        		cyear = year-1;
					        	}
					        }else{
					        	cmonth = month;
					        	showD = showDay;
					        	cyear = year;
					        }
					        							
						}
					    var json = {
							year:year,
							month:month,
							day:day,
							hour:hour
						};
						return json;
					}
				};
				
				/********* 创建时间轴 *****************/
				var createTA = {
					totalWidth:function(type,date){
						var totalW = 0;
						if(type=='month'){
							totalW = 32*12*7;
						}else if(type=='day'){
							var curYear = RULES.getYear(date),
					            curMonth = RULES.getMonth(date),
					            curDay = RULES.getDate(date),
					            curHour = RULES.getHour(date);
					    	for(var j=curMonth-2;j<curMonth+3;j++){
					    		if(j<=0){ var curmonth= j+12;var curyear = curYear-1;}
					    		else {var curmonth = j;var curyear=curYear;}
					    		var days = RULES.getDaysInMonth(curyear,curmonth);//获取当月天数
					    		var groupWidth = 32*days;
					    		totalW += groupWidth; 
					    	}
						}
						return totalW;
					},
					headConHtml:function(type,date,lineLeft){
						var curYear = RULES.getYear(date),
					        curMonth = RULES.getMonth(date),
					        curDay = RULES.getDate(date),
					        curHour = RULES.getHour(date);
					    var headHtml='';
					    if(type=='month'){
					    	//显示当前年份相邻的3年共7年
					    	for(var i=-3;i<4;i++){
						    	var left = 384*(i- parseInt(curMonth-1)/12 - parseInt(curDay)/30/12)+lineLeft;
						    	headHtml += "<div class='dateGroup year' id='group"+(curYear+i)+"' style='left:"+left+"px;' data-year='"+(curYear+i)+"'>"
						    	         + "<div class='showDate' data-year='"+(curYear+i)+"'>"+(curYear+i)+"</div>"
										 + "<div class='line clearfix' data-year='"+(curYear+i)+"'>";
						    	for(var j=1;j<13;j++){
						    	    headHtml += "<div class='scale' date = '"+(curYear+i)+"."+j+"' data-year='"+(curYear+i)+"'>"+j+"</div>";													
						        }
					    		headHtml += "</div></div>";			
					        }
					    }else if(type=='day'){	
					        //显示当前月份相邻的两个月,共5个月
					        var groupLeft =0;		       
					    	for(var j=curMonth-2;j<curMonth+3;j++){
					    		if(j<=0){ var curmonth= j+12;var curyear = curYear-1;}
					    		else if(j>12){var curmonth= j-12;var curyear = curYear+1;}
					    		else {var curmonth = j;var curyear=curYear;}
					    		var days = RULES.getDaysInMonth(curyear,curmonth);//获取当月天数
					    		var groupWidth = 32*days;
					    	    var curLeft = lineLeft-32*(curDay-1+curHour/24);
					    	    if(j==curMonth) {
					    		   groupLeft = lineLeft-32*(curDay-1+curHour/24);	
					    		}else if(j==curMonth-1){
					    		    var disLeft1 = RULES.getDaysInMonth(curYear,curMonth-1)*32;
					    		    groupLeft = curLeft-disLeft1;
					    		}else if(j==curMonth-2){
					    		    var disLeft1 = RULES.getDaysInMonth(curYear,curMonth-1)*32,
					    		        disLeft2 = RULES.getDaysInMonth(curYear,curMonth-2)*32;
					    		    groupLeft = curLeft - disLeft1 -disLeft2;
					    		}else if(j==curMonth+1){
					    			var disLeft1 = RULES.getDaysInMonth(curYear,curMonth)*32;
					    			groupLeft = curLeft+disLeft1;
					    		}else if(j==curMonth+2){
					    			var disLeft1 = RULES.getDaysInMonth(curYear,curMonth)*32,
					    		        disLeft2= RULES.getDaysInMonth(curYear,curMonth+1)*32;
					    		    groupLeft = curLeft+disLeft1+disLeft2;
					    		}
					    		headHtml += "<div class='dateGroup month' id='monthGroup"+curyear+"' style='left:"+groupLeft+"px;width:"+groupWidth+"px;' data-year='"+curyear+"' date-month='"+curmonth+"'>"
					    	         + "<div class='showDate' data-year='"+curyear+"' data-month='"+curmonth+"' data-hour='"+curHour+"'>"+curyear+"年"+curmonth+"月</div>"
									 + "<div class='line clearfix' data-year='"+curyear+"'>";						
								for(var h=1;h<days+1;h++){
								    headHtml += "<div class='scale' data-year='"+curyear+"' data-month='"+curmonth+"' data-day='"+h+"' data-hour='"+curHour+"'>"+h+"</div>";	
								}
					    	   headHtml +="</div></div>";
					        }
					    }
					    return  headHtml;
					},
					timeLineHtml:function(date){ //按月份显示
						//获取年月日
						var year = RULES.getYear(date),
					        month = RULES.getMonth(date),
					        day = RULES.getDate(date),
					        hour =RULES.getHour(date);
						//将当前时间显示在正中间
						var width = 32*12; //每一年分配的宽度
						var lineLeft = $this.width()/2; //参考线的left值
					    var headHtml = "<div class='timeline-head clearfix noselect'>"
							         + "<div class='timeline-head-content'>";	   
					    headHtml +=  createTA.headConHtml(setting.type,date,lineLeft); 
					    headHtml += "</div></div>"
					    headHtml += "<div class='timeline-footer'><div class='tl-footer-center'>"
							     + "<div class='timeline-prev noselect'>prev</div>"
							     + "<div class='showCurDate noselect' id='showCurDate' data-year='"+year+"' data-month='"+month+"' data-day='"+day+"' data-hour='"+hour+"'>"+year+"年"+month+"月"+day+"日</div>"
							     + "<div class='timeline-next noselect'>next</div></div></div>"
						         + "<div class='referenceLine'></div>"
					    return  headHtml;
					},
					init:function(){
					    var timeLineHtml =createTA.timeLineHtml(setting.curDate);					     
		                $this.html(timeLineHtml)
					},
					updateTL:function(date){
						var timeLineHtml =createTA.timeLineHtml(date);					     
		                $this.html(timeLineHtml)
					}
				};
				var TimeL_Event = { //给时间轴添加事件
					randomClick:function(event,type){
						if(type=='month'){
							
						}else if(type=='day'){
							// 获取当前月份 
							var curYear = $(event.target).attr("data-year"),
							    curMonth = $(event.target).attr("data-month"),
							    curDay = $(event.target).attr("data-day"),
							    curHour = new Date().getHours();//获取当前的hour
							var offSET = event.offsetX; //
							if(curDay==undefined){
								curDay = Math.ceil(offSET/32);
							}
							var date = new Date(curYear,curMonth-1,curDay,curHour);
						    createTA.updateTL(date);
						}
					},
					prevNextClick:function(type){
						var $showCurDate = $("#showCurDate");
						var curYear = parseInt($showCurDate.attr("data-year")),
						    curMonth = parseInt($showCurDate.attr("data-month")),
						    curDay = parseInt($showCurDate.attr("data-day")),					
						    curHour = new Date().getHours();//获取当前的hour
						var date = new Date(curYear,curMonth-1,curDay+(type),curHour);
				    	createTA.updateTL(date);
					}			
				};
				createTA.init();
				
				//定义一个全局变量
				var noneClick = true; //当mousemove时，禁止click事件
				$this.on("click",".timeline-head",function(event){ //点击切换时间
					if(noneClick){
						TimeL_Event.randomClick(event,setting.type)
					}else{
					  noneClick	=true;
					}
				})				
				$this.on("click",".timeline-prev",function(){
					TimeL_Event.prevNextClick(-1);//prev
				})				
				$this.on("click",".timeline-next",function(){
					TimeL_Event.prevNextClick(1);//next
				})
				$this.on("mousedown",".timeline-head",function(event){
					var event = event || window.event,
					    $target = $(event.target),
					    $tlHead =  $target.parents(".timeline-head-content"),
					    initX= event.clientX,
					    left = parseFloat($tlHead.css("left")),
					    tlHeadW = parseFloat($tlHead.css("width"))
					    lineLeft =  parseFloat($(".referenceLine").css("left"));
					//获取当前时间
					var $showDate = $("#showCurDate"),
					    year =parseInt($showDate.attr("data-year")),
					    month = parseInt($showDate.attr("data-month")),
					    day = parseInt($showDate.attr("data-day"));
					    hour = parseInt($showDate.attr("data-hour"));
					    initDate = new Date(year,month,day,hour);
					var days = RULES.getDaysInMonth(year,month);//获取当月天数
					//缓存group的left值
					var groupLeft = [];
					$(".dateGroup").each(function(){
						var left = parseFloat($(this).css("left"));
						groupLeft.push(left);
					})
					$(document).on("mousemove",function(event){	
						noneClick = false;
						var event = event||window.event;
						var disX = event.clientX  - initX;							
					    var cyear = RULES.parseDate(setting.type,initDate,disX,days).year,
					        cmonth = RULES.parseDate(setting.type,initDate,disX,days).month,
					        showD = RULES.parseDate(setting.type,initDate,disX,days).day,
					        chour = RULES.parseDate(setting.type,initDate,disX,days).hour;
				        var width = createTA.totalWidth(setting.type,setting.curDate,days);
				       	$(".referenceLine").css("border-color","#795548");
				       	$(".dateGroup").each(function(i){
				       		if(i==0){
				       			if(groupLeft[i]+disX>=0||(groupLeft[0]+disX+width-tlHeadW<=0)) {
				       				var date = new Date(cyear,cmonth-1,showD,chour);
				       				createTA.updateTL(date);
				       				return false;
				       			}			       			
				       		}
				       		$showDate.attr("data-year",cyear);
						    $showDate.attr("data-month",cmonth);
						    $showDate.attr("data-day",showD);
						    $showDate.text(cyear+"年"+cmonth+"月"+showD+"日")
				       		$(this).css("left",(groupLeft[i]+disX)+'px');
				       	})
				        //$(".timeline-head-content").css("left",(left+disX)+'px');
					});
					$(document).on("mouseup",function(){
					    $(".referenceLine").css("border-color","#b5b1b1");
						$(document).off("mousemove");
						$(document).off("mouseup");
					})
				})
			});
		}
	}
	$.fn.TimeAxis = function() {
		var method = arguments[0];
		if(methods[method]) {
			method = methods[method];
			arguments = Array.prototype.slice.call(arguments, 1);
		} else if(typeof(method) == 'object' || !method) {
			method = methods.init;
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.pluginName');
			return this;
		}
		return method.apply(this, arguments);
	}
})(jQuery);

$(".timeline").TimeAxis({
	type:'day'
	/*curDate:new Date(2016,2,15)*/
});

 curDay = (disMonth - curMonth)*32;

