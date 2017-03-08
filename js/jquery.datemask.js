/**
 * jquery.datemask 时间日期输入格式化
 * author: liulingli
 * date :2016-12-22
 */
;(function(){
	var methods = {
		init:function(options){
			return this.each(function(){
				var $this = $(this);
                var defaluts = {
			        datemask : 'default', //默认时间格式
			        isHasChoose :true //是否需要添加checkbox,点击写入当前时间
                }
      		  //合并默认参数opt和defaluts
              settings = $.extend({},defaluts,options);
              //methods.initHtml.call($this, settings); 
			  methods.datamaskMain.call($this, settings);  
			});
		},
		datamaskMain:function(){
			return this.each(function(){
				var $this = $(this),
				    setting = settings;
				var datemask = {
					'default': "yyyy-mm-dd HH:MM:SS",
		            'shortDate1': "mm/dd/yyyy",
		            'shortDate2':"dd/mm/yyyy",
		            'shortDate2':"yyyy/dd/mm",
		            'shortTime': "yyyy/mm/dd HH:MM:SS",
		            'isoDate': "yyyy-mm-dd",
		            'isDate':"yyyy-mm",
		            'isoTime': "HH:MM:SS",		          
		            'ChineseDate': 'yyyy年mm月dd日HH时MM分SS秒'//中国类型的日期
				},
				RULES = {
					getCursorPos:function(element){ //获取光标位置
						if(document.selection){//ie
			                var caretPos = 0;
			                var sel = document.selection.createRange();
			                sel.moveStart("character",element.value,length);
		                    caretPos = Sel.text.length;
                        }else if(element.selectionStart || element.selectionStart == '0'){//支持firefox
                            caretPos = element.selectionStart;
                        }
                        return caretPos;
					},
					setCursorPos:function(element,pos){ //设置光标位置
						if(element.setSelectionRange){
                            element.setSelectionRange(pos,pos);
                        }else if(element.createTextRange) {
                            var range = element.createTextRange();
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
					},
					getSelectText:function(element){ //获取选中文本
						if(element.selectionStart!=undefined){
		                    return element.value.substring(element.selectionStart, element.selectionEnd);
	                    }else{
		                    var range = document.selection.createRange();
		                    return range.text;
	                    }
					},
					setSelectText:function(element,leftPos,rightPos){ //设置选中文本
						if(element.selectionStart !== undefined) {
		                    element.setSelectionRange(leftPos, rightPos);
	                    }else{
		                    var range = element.createTextRange();
		                    range.move("character", -element.value.length); //光标移到0位置。
		                    range.moveStart("character", leftPos);
		                    range.moveEnd("character", rightPos);		    
		                    range.select();
	                    }
					},
					initHtml:function(element){
						var placeholder = datemask[setting.datemask];
						$(element).attr("placeholder",placeholder);
						if(setting.isHasChoose){
							var width = $(element).width()-4;
			                var checkDiv = "<input type='checkbox' style='width:15px;height:15px;vertical-align:middle;"
			                             + "margin-left:"+-width+"px;margin-right:"+width+"px' class='showCurDate'>"
			                $(element).css("text-indent","25px").after(checkDiv);
						}						
					},
					maskCurDate:function($this){						
				        var placeholderCone = $this.prev().attr("placeholder");
				        var curDate = new Date();
				        var date = {
					        yyyy: curDate.getFullYear(),
					        mm: curDate.getMonth() < 10 ? "0" + curDate.getMonth()+1 : curDate.getMonth()+1,
					        dd: curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate(),
					        HH: curDate.getHours() < 10 ? "0" + curDate.getHours() : curDate.getHours(),
					        MM: curDate.getMinutes() < 10 ? "0" + curDate.getMinutes() : curDate.getMinutes(),
					        SS: curDate.getSeconds() < 10 ? "0" + curDate.getSeconds() : curDate.getSeconds()
				        };
				        var json = "{" ;//存放对应字符串长度 
					        $.each(placeholderCone.split(/[\u4e00-\u9fa5\-\:\s\/]/g), function(i, c) {
						        if(c!=''&&c!==null){
							        if(json=='{'){
								        json += c+":\""+c.length+"\"";
							        }else{
							            json += ", "+c+":\""+c.length+"\"";
							        }
					            }
					        });
				            json +="}";
				            json = eval("("+json+")");
				        for(i in json){
					        var reg = eval("/[" + i + "]{" + json[i] + "}/g");
					        placeholderCone = placeholderCone.replace(reg, date[i])
				        }				 
				        return placeholderCone;				
					}
				};
			
			    /****** input时间输入框初始化 ******/
			    RULES.initHtml($this);
			    
			    var input = $this;
			    /********** 添加事件  **********/
			    input.on("focus",function(){
			    	var $this = $(this),
			    	    placeholder = $this.attr("placeholder");
		            if($this.val()==''||$this.val()==placeholder){
			            $this.val(placeholder);
			            RULES.setSelectText(this,0,1);
		            }
			    });
			    input.on("keydown",function(e){
			    	var $this = $(this), //当前触发事件的输入框
		                keyCode = e.keyCode||e.which, //获取键码
		                placeholder = $this.attr("placeholder"),
		                totalLen = placeholder.length; //长度
		                totalLenBuffer = totalLen;//缓存长度
		                cursorIndex = RULES.getCursorPos(this); //获取光标位置		  
		            if((keyCode >= 48 && keyCode <= 57)||(keyCode>=96&&keyCode<=105)){
		                var len = $(this).val().length,
		                    selectText =$this.val().charAt(cursorIndex); //获取选中的文本
			            //如果placeholder的最后一个元素是分隔符
		                if(/[\u4e00-\u9fa5\-\/\:\s]$/.test(placeholder)){
			                totalLenBuffer = totalLen-1;
		                }
		                if(cursorIndex==totalLenBuffer){
			                return false;
		                }else if(/[\u4e00-\u9fa5\-\/\:\s]/.test(selectText)&&totalLen==len){ //分隔符
			                RULES.setSelectText(this,cursorIndex+1,cursorIndex+2);
		                }else{
			                RULES.setSelectText(this,cursorIndex,cursorIndex+1);
		                }
		            }else{
			            return false;
		            }
			    });
			    input.on("keyup",function(e){
			    	var keyCode = e.keyCode||e.which,
		                placeholder = $(this).attr("placeholder");
		            if(keyCode==8||keyCode==46){ //回格键或删除键	
		                var slectText = RULES.getSelectText(this)
		                var delLen = slectText.length;		
			            //删除的位置还原					    
			            var pos = placeholder.split(""),
			                cursor = RULES.getCursorPos(this),
			                ar = $(this).val().split("");
			            if(cursor==0&&delLen==placeholder.length){ //删除全部时
				            $(this).val(placeholder); 
				            return false;
			            }else if(cursor==0&&delLen==0){ //当光标在最前面时不能删除
		    	            return false;
		                }else{
		    	            if(delLen == 0) {
				                var posChar = pos[cursor-1];
					            ar.splice(cursor-1, 1, posChar);									
			                }else{
			    	            var posChar = placeholder.substring(cursor,(cursor + delLen));
			                    posChar = posChar.split(""); 			        
				                ar.splice(cursor, delLen, posChar);
		                    }
			                ar = ar.join('').replace(/[,]/g,'');
			                $(this).val(ar);
			                //光标前面的字符	                	
			                var prePosChar = pos[cursor-2];			                    
			                //如果光标前是分隔符 则将光标位置向前移动
			                if(delLen==0){
			                   	if(/[\u4e00-\u9fa5\-\/\:\s]/.test(prePosChar)){
			    	                RULES.setSelectText(this,cursor-2,cursor-2);	
			                    }else{
			                    	RULES.setSelectText(this,cursor-1,cursor-1);
			                    }
			                }else{
			                	var prePosChar = pos[cursor-1];	
			                	if(/[\u4e00-\u9fa5\-\/\:\s]/.test(prePosChar)){
			    	                RULES.setSelectText(this,cursor-1,cursor-1);	
			                    }else{
			                   	    RULES.setSelectText(this,cursor,cursor);	
			                    }
			                }		       
		                }			
		            }else if(keyCode==37){ //键盘向左
		            	var cursor = RULES.getCursorPos(this);
		            	if(cursor>0){
		            	    RULES.setCursorPos(this,cursor-1);	
		            	}		            	
		            }else if(keyCode==39){ //键盘向右
		            	var cursor = RULES.getCursorPos(this);
		            	RULES.setCursorPos(this,cursor+1);	
		            }else if(keyCode >= 48 && keyCode <= 57){
		            	var curIndex = RULES.getCursorPos(this);
		            	var number =keyCode-48;		            	    
 		            }
		        });
		        /******** 点击显示当前时间  ********/
		        if(setting.isHasChoose){		           			          
		            input.next().on("click",function() {
		                var $this = $(this),
		                    placeholder = input.attr("placeholder");
		                if($this.prop("checked")){
			                input.val(RULES.maskCurDate($this));
	                    }else{
		                    input.val(placeholder);
                        }
	                }); 
		        }
			});
		}
	};
	$.fn.datemask = function(){
		var method = arguments[0];
		if(methods[method]){
			method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
		}else if(typeof(method)=='object'||!method){
            method = methods.init;
		}else{
            $.error( 'Method ' +  method + ' does not exist on jQuery.pluginName' );
            return this;
		}
        return method.apply(this, arguments);
	}
})(jQuery);

$("input.dateInputer").datemask();
