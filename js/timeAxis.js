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
					curDate:new Date(), //时间轴当前显示时间
					callback:function(){} //选中时间后的回调函数
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
					getFloor:function(number){ //当number大于0时，像下取整，当number小于0时向上取整
						var number = parseFloat(number);
						if(number>0) return Math.floor(number);
						return Math.ceil(number);
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
					parseDate:function(dateStr){ //解析日期是否合法，合法返回日期，不合法返回false
						var splitArray = dateStr.split(/\s/);//按空格分割成数组
				        if(splitArray.length>1){
				            var str1 = dateStr.split(/\s/)[0].replace(/[\u4e00-\u9fa5\-\/]/g,"/").replace(/\/$/,''),
				                str2 = dateStr.split(/\s/)[1].replace(/[\u4e00-\u9fa5\-\/:]/g,":").replace(/:$/,'');
				            var str = str1+' '+str2;
				    	}else{
					   		var str1 = dateStr.split(/\s/)[0].replace(/[\u4e00-\u9fa5\-\/]/g,"/").replace(/\/$/,'');
					    	var str = str1;
				    	}
				    	var curDate = new Date(), //获取当前时间
				    	    curDay = RULES.getDate(curDate), 
				    	    curHour = RULES.getHour(curDate); //当前第几号
				    	var datestr = str+" "+curHour+":00:00"; //新生成的时间
				    	if(RULES.getDate(new Date(str))==1){ //当没有输入多少号时，根据当前时间获取
				    		var datestr = str+"/"+curDay+" "+curHour+":00:00";
				    	}
                    	var dataParse = Date.parse(new Date(str));
	  	       	 		if(isNaN(dataParse)){ //日期是否合法
	  	       	 	    	return false; //不合法时返回false
	  	       	 		}
	  	       	 		return new Date(datestr); //合法时返回解析好的日期
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
						    	headHtml += "<div class='dateGroup year' id='group"+(curYear+i)+"' style='left:"+left+"px;' data-year='"+(curYear+i)+"' data-day='"+curDay+"' data-hour='"+curHour+"'>"
						    	         + "<div class='showDate' data-year='"+(curYear+i)+"' data-day='"+curDay+"' data-hour='"+curHour+"'>"+(curYear+i)+"</div>"
										 + "<div class='line clearfix' data-year='"+(curYear+i)+"' data-day='"+curDay+"' data-hour='"+curHour+"'>";
						    	for(var j=1;j<13;j++){
						    	    headHtml += "<div class='scale' data-year='"+(curYear+i)+"' data-month='"+j+"' data-day='"+curDay+"' data-hour='"+curHour+"'>"+j+"</div>";													
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
					timeLineHtml:function(date){ 
						//获取年月日
						var year = RULES.getYear(date),
					        month = RULES.getMonth(date),
					        day = RULES.getDate(date),
					        hour =RULES.getHour(date);
						//将当前时间显示在正中间
						var width = 32*12; //每一年分配的宽度
						var lineLeft = $this.width()/2; //参考线的left值
						var daySelect = (setting.type=="day")?("selected='selected'"):"",
						    monthSelect = (setting.type=="month")?("selected='selected'"):"";
					    var headHtml = "<div class='timeline-head clearfix noselect'>"
							         + "<div class='timeline-head-content'>";	   
					    headHtml +=  createTA.headConHtml(setting.type,date,lineLeft); 
					    headHtml += "</div></div>"
					    headHtml += "<div class='timeline-footer noselect'>"
					    		 + "<div class='customType'><select class='changeType'><option value='month' "+monthSelect+">month</option><option value='day' "+daySelect+">day</option></select>"
					    		 + "<input type='text' class='gotoInput'><button class='goto'>Go to</button></div>"
					    		 + "<div class='tl-footer-center'>"
							     + "<div class='timeline-prev'>prev</div>"
							     + "<div class='showCurDate' id='showCurDate' data-year='"+year+"' data-month='"+month+"' data-day='"+day+"' data-hour='"+hour+"'>"+year+"年"+month+"月"+day+"日</div>"
							     + "<div class='timeline-next'>next</div></div></div>"
						         + "<div class='referenceLine'></div>"
					    return  headHtml;
					},
					initInputDate:function(date){
						if(setting.type=='day'){
		                	var datemask = 'isoDate';
		                }else if(setting.type=='month'){
		                	var datemask = 'isDate';
		                }
		                $this.find(".gotoInput").datemask({ //时间输入框格式化
		                	datemask:datemask,
				            isHasChoose:false
		                });
		                var year = RULES.getYear(date),
		                    month = RULES.getMonth(date)<10?('0'+RULES.getMonth(date)):RULES.getMonth(date),
		                    day = RULES.getDate(date)<10?('0'+RULES.getDate(date)):RULES.getDate(date);
		                if(setting.type=='month'){
		                	var curDate = year+'-'+month;
		                }else if(setting.type=='day'){
		                	var curDate = year+'-'+month+'-'+day;
		                }		                
		                $this.find(".gotoInput").val(curDate);
					},
					init:function(date){
					    var timeLineHtml =createTA.timeLineHtml(date);					     
		                $this.html(timeLineHtml);
		                createTA.initInputDate(date);
					},
					updateTL:function(date){
						var timeLineHtml =createTA.timeLineHtml(date);					     
		                $this.html(timeLineHtml);
		                createTA.initInputDate(date);
					}
				};
				var TimeL_Event = { //给时间轴添加事件
					randomClick:function(event,type){
						// 获取当前月份 
						var curYear = $(event.target).attr("data-year"),
							curMonth = $(event.target).attr("data-month"),
							curDay = $(event.target).attr("data-day"),
							curHour = new Date().getHours();//获取当前的hour
						var offSET = event.offsetX; 
						if(type=='month'){
							if(curMonth==undefined){
								curMonth = Math.ceil(offSET/32);
							}
							var date = new Date(curYear,curMonth-1,curDay,curHour);
							createTA.updateTL(date);
						}else if(type=='day'){														
							if(curDay==undefined){
								curDay = Math.ceil(offSET/32);
							}
							var date = new Date(curYear,curMonth-1,curDay,curHour);
						    createTA.updateTL(date);
						}
					},
					prevNextClick:function(type){
						var $showCurDate = $this.find("#showCurDate");
						var curYear = parseInt($showCurDate.attr("data-year")),
					    	curMonth = parseInt($showCurDate.attr("data-month")),
					    	curDay = parseInt($showCurDate.attr("data-day")),					
					    	curHour = new Date().getHours();//获取当前的hour
					    if(setting.type=='day'){
					    	var date = new Date(curYear,curMonth-1,curDay+(type),curHour);
					    }else if(setting.type=='month'){
					    	var date = new Date(curYear,curMonth-1+(type),curDay,curHour);
					    }						
			    		createTA.updateTL(date);					
					},
					changeType:function(value){
						var $showCurDate = $this.find("#showCurDate");
						var curYear = parseInt($showCurDate.attr("data-year")),
					    	curMonth = parseInt($showCurDate.attr("data-month")),
					    	curDay = parseInt($showCurDate.attr("data-day")),					
					    	curHour = new Date().getHours();//获取当前的hour
					    var date = new Date(curYear,curMonth-1,curDay,curHour);
						setting.type =  value;
						createTA.updateTL(date);	
					},
					goToDate:function(date){
						createTA.updateTL(date);
					}
				};
				var curShowDate = RULES.parseDate(setting.curDate);//将字符串解析成时间
				createTA.init(curShowDate); //初始化时间轴
				
				//点击切换时间显示类型
				$this.on("change",".changeType",function(){
					var value = $(this).val();
					TimeL_Event.changeType(value);
				})	
				//点击按钮根据输入框写入日期跳转
				$this.on("click","button.goto",function(){
					var $inputDate = $this.find(".gotoInput"),
					    dateStr = $inputDate.val(),
					    returnValue = RULES.parseDate(dateStr);
					if(returnValue){
						createTA.updateTL(returnValue);
					}else{
						alert("日期格式不合法")
					}
				})
				
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
				$this.on("mousedown.timeLine",".timeline-head",function(event){
					var event = event || window.event,
					    $target = $(event.target),
					    $tlHead =  $target.parents(".timeline-head-content"),
					    initX= event.clientX,
					    left = parseFloat($tlHead.css("left")),
					    tlHeadW = parseFloat($tlHead.css("width"))
					    lineLeft =  parseFloat($this.find(".referenceLine").css("left"));
					//获取当前时间
					var $showDate = $this.find("#showCurDate"),
					    year =parseInt($showDate.attr("data-year")),
					    month = parseInt($showDate.attr("data-month")),
					    day = parseInt($showDate.attr("data-day")),
					    hour = parseInt($showDate.attr("data-hour"));
					var totaldays = RULES.getDaysInMonth(year,month);//获取当月天数
					//缓存group的left值
					var groupLeft = [];
					$this.find(".dateGroup").each(function(){
						var left = parseFloat($(this).css("left"));
						groupLeft.push(left);
					})
					$(document).on("mousemove.timeLine",function(event){
						console.log($this.attr("id"))
						noneClick = false;
						var event = event||window.event;
						if(setting.type =='day'){
							var disX = event.clientX  - initX,
						        disday = disX/32;
							    _year = $showDate.attr("data-year"),
							    _month = $showDate.attr("data-month"),						   
								cday = parseInt(day)- parseFloat(disday)+parseInt(hour)/24,
								chour = Math.round((cday-Math.floor(cday))*24),
		                        showDay = Math.floor(cday);
	                        if(disX<0){
	                        	daysNext  = RULES.getDaysInMonth(_year,_month-1);//获取当月天数
	                        }
							var daysNext  = RULES.getDaysInMonth(_year,_month);//获取当月天数
					        if(showDay>totaldays){				        	
					        	if(parseInt(showDay)-parseInt(daysNext)==1){
					        	   cmonth = parseInt(month)+1;	
					        	}
					        	if(cmonth>12){
					        	    cmonth = cmonth-12;
					        	    if(cmonth-12==1)
					        		cyear = year+1;	
					        	}				        	
					        	showD = showDay-totaldays;
					        	cyear = year;
					        }else if(showDay<=0){
					        	var prevDays = RULES.getDaysInMonth(year,month-1);//获取当月天数
					        	showD = showDay+prevDays;
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
					        var width = createTA.totalWidth(setting.type,curShowDate,totaldays);
					       	$this.find(".referenceLine").css("border-color","#795548");
					       	$showDate.attr("data-year",cyear);
						    $showDate.attr("data-month",cmonth);
						    $showDate.attr("data-day",showD);
						    $this.find(".gotoInput").val(cyear+"-"+(month<10?('0'+month):month)+'-'+(showD<10?('0'+showD):showD));
						    $showDate.text(cyear+"年"+cmonth+"月"+showD+"日");
					       	$this.find(".dateGroup").each(function(i){
					       		if(i==0){
					       			if(groupLeft[i]+disX>=0||(groupLeft[0]+disX+width-tlHeadW<=0)) {
					       				var date = new Date(cyear,cmonth-1,showD,chour);
					       				createTA.updateTL(date);
					       				return false;
					       			}			       			
					       		}					       		
					       		$(this).css("left",(groupLeft[i]+disX)+'px');
					       	})
						}else if(setting.type=='month'){
							var _year = $showDate.attr("data-year"),
							    _month = $showDate.attr("data-month"),
							    _day = $showDate.attr("data-day"),
							    days = RULES.getDaysInMonth(_year,_month), //获取当月天数
							    disX = event.clientX  - initX,	
							   // disDay = disX>0?(day+1):(day-1),
						        disMonth = RULES.getFloor(disX/32-day/days),
						        disMonth = (disX/32-day/days)>=0?(disMonth+1):disMonth,
						        curYear = year,
						        curMonth = month-disMonth,
						        curDay = parseInt(((disX/32-day/days)-disMonth)*days)-1;

						    //计算当前天数
						    if(curDay<0){
						    	curDay = -curDay;
						    	if(curDay>days){
						    	    curDay = days;
						        }
						    }else{
						    	curDay = days-curDay;
						    	if(curDay>days){
						    	    curDay = days;
						    	    curMonth = curMonth-1;
						        }
						    }
						    //计算当前月份
						    if(curMonth>12){
						    	curMonth = curMonth-12,
						    	curYear = curYear+1;
						    }else if(curMonth<=0){
						    	curMonth = curMonth+12,
						    	curYear = curYear-1;
						    }
						    var width = createTA.totalWidth(setting.type,curShowDate,days);
					       	$this.find(".referenceLine").css("border-color","#795548");
					       	$showDate.attr("data-year",curYear);
							$showDate.attr("data-month",curMonth);
							$showDate.attr("data-day",curDay);
							$this.find("[data-day]").attr("data-day",curDay);
							$this.find(".gotoInput").val(curYear+"-"+(curMonth<10?('0'+curMonth):curMonth));
					    	$showDate.text(curYear+"年"+curMonth+"月"+curDay+"日");
						    $this.find(".dateGroup").each(function(i){
						    	if(i==0){
					       			if(groupLeft[i]+disX>=0||(groupLeft[0]+disX+width-tlHeadW<=0)) {
					       				var date = new Date(curYear,curMonth-1,curDay,hour);
					       				createTA.updateTL(date);
					       				return false;
					       			}			       			
					       	}
					       		$(this).css("left",(groupLeft[i]+disX)+'px');
						    })
						}
					});
					$(document).on("mouseup.timeLine",function(){
					    $this.find(".referenceLine").css("border-color","#b5b1b1");
						$(document).off("mousemove.timeLine");
						$(document).off("mouseup.timeLine");
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





