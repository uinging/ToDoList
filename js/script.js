(function($){
    //设置任务内容元素尺寸
    function setWidth(){
        var $task = $(".task");
        var $contentBox = $("#contentBox");

        $task.each(function(){
            if($(this).css("display") === "block") {
                if($(this).outerWidth() < 400) {
                    $(this).width(400);
                }
                else if($(this).outerWidth() >= 400){

                    $(this).width($contentBox.outerWidth());
                }
            }
        });

        //设置任务编辑窗口的大小
        var $editWindow = $("#editWindow");
        if($editWindow[0]) {
            $editWindow.width($contentBox.outerWidth());
            $("textarea",$editWindow).eq(0).height($contentBox.outerHeight - 94);
            var input = $("input",$editWindow);
            input.eq(0).width($contentBox.outerWidth - 102);
            input.eq(1).width($contentBox.outerWidth - 102);
        }
    }

    //一开始调用setWidth来设置任务内容的宽度
    setWidth();
    //窗口大小改变时候调用setWidth;
    $(window).on("resize",setWidth);

    //任务内容点击取消冒泡
    $(".task").on("click",function(event){
        event.stopPropagation();
    })

    //任务点击展开
    function todoItemToggle(){
        var $todoItem = $(".todoItem");
        var $task = $(".task");
        //任务内容默认隐藏
        $task.css("display","none");
        $todoItem.on("click",function(event){
            $todoItem.css("backgroundColor","");
            $(this).css("backgroundColor","#ADD8E6");
            //先把所有的任务隐藏,再显示当前
            $task.css("display","none");
            $(this).next().css("display","block");
            event.stopPropagation();
            setWidth();
        })
        //任务内容点击事件取消冒泡
        $task.on("click",function(event){
            event.stopPropagation();
        })
    }
    todoItemToggle();

    //项目点击展开
    function taskItemToggle(){
        var $taskItem = $(".taskItem");
        $taskItem.on("click",function(){
            //把所有任务取消选择状态
            $taskItem.removeClass("selectedTaskItem");
            //隐藏所有任务
            $(".task").css("display","none");
            //隐藏所有项目内容
            $(".taskItem .taskDate").hide();
            //把当前任务的内容显示出来,并标记当前任务为选中状态
            $(this).addClass("selectedTaskItem");
            $("dl,dt,dd,.todoItem",$(".selectedTaskItem")).show();
            //默认显示所有
            $("#all").click();
        })
    }
    taskItemToggle();

    //文件夹点击展开,再点击关闭
    function folderToggle(){
        var $parentEle = $(".taskFolder:first").parent();
        //如果当前是打开,就关闭;如果当前是关闭,就先关闭别的,再打开当前.
        $parentEle.on("click",".taskFolder",function(){
            if($(this).hasClass("folderOpen")) {
                $(this).removeClass("folderOpen");
            } else {
                $(".taskFolder").removeClass("folderOpen");
                $(this).addClass("folderOpen");
            }
        })
    }
    folderToggle();

    //刷新项目数
    function refreshTaskItemNum(){
        var $taskItemNum = $(".taskItemNum");

        $taskItemNum.each(function(){
            var parentEle = $(this).parent().next();
            $(this).html($(".taskItem",parentEle).length);
        })
    }
    refreshTaskItemNum();

    //刷新任务数
    function refreshTodoItemNum (){
        var $todoItemNum = $(".todoItemNum");
        $todoItemNum.each(function(){
            var parentEle = $(this).parent();
            $(this).html($(".todoItem",parentEle).length);
        })
    }
    refreshTodoItemNum();

    //为"所有" "未完成" "已完成" 按钮添加事件函数
    (function(){
        var $displayAll = $("#all");
        var $displayUnDone = $("#unDone");
        var $displayAllDone = $("#allDone");
        
        //为当前点击的按钮增加active 类
        function toggleActive(event){
            event = event || window.event;
            var $taskListBox = $("#taskListBox");
            var $btn = $("div",$taskListBox);
            $btn.removeClass("active");
            $(event.target).addClass("active");
        }
        function hideSelected(){
            var $selectedTask = $(".selectedTaskItem .todoItem");
            $selectedTask.each(function(){
                if($(this).next()[0]) {
                    $(this).next().css("display","none");
                }
                $(this).css("display","none");
            })
        }
        //"所有"按钮
        $displayAll.on("click",function(event){
            //为当前点击的按钮增加active 类
            toggleActive(event);
            //点击"所有"按键时,显示选中任务下的所有子任务
            $("dl,dt,dd,.todoItem",$(".selectedTaskItem")).show();
            var $selectedTask = $(".selectedTaskItem .todoItem");
            $selectedTask.each(function(){
                if($(this).next()[0]) {
                    $(this).css("display","block");
                }
            })
        })

        //"未完成"按钮
        $displayUnDone.on("click",function(event){
            //先显示所有,再把完成的隐藏
            $displayAll.click();
            //为当前点击的按钮增加active 类
            toggleActive(event);

            $(".done").css("display","none");
            //如果没有显示出的子元素,就隐藏掉
            var $parentEle = $(".selectedTaskItem .taskDate").eq(0);
            var $dd = $("dd",$parentEle);
            $dd.each(function(){
                if(!$(":visible",$(this))[0]) {
                    $(this).prev().hide();
                    $(this).hide();
                }
            })
        })
        //"已完成"按钮
        $displayAllDone.on("click",function(event){
            //为当前点击的按钮增加active 类
            toggleActive(event);
            //先隐藏所有,再把完成的显示
            hideSelected();
            $("h3.done").show();
            $(".done").parent().show();
            $(".done").parent().prev().show();

            //如果没有显示出的子元素,就隐藏掉
            var $parentEle = $(".selectedTaskItem .taskDate").eq(0);
            var $dd = $("dd",$parentEle);
            $dd.each(function(){
                if(!$(":visible",$(this))[0]) {
                    $(this).prev().hide();
                    $(this).hide();
                }
            })
        })
    })();

    //完成 按钮的事件处理函数
    function taskDone(){
        var $doneBtn = $(".doneBtn");
        $doneBtn.on("click",function(event){
            if(!$(this).parent().hasClass("done")) {
                var message  = confirm("确定完成任务了?");
                if(message) {
                    $(this).parent().addClass("done");
                    $(this).parent().prev().addClass("done");
                    $(this).prev().css("visibility","hidden");
                }
            }
            event.stopPropagation();
        })
    }
    taskDone();

    //点击 编辑 按钮弹出编辑窗口;定义相关按钮事件
    function editTask(){
        var $editBtn = $(".edit");
        $editBtn.on("click",function(event){
            //创建 编辑窗口 
            var editWindow = document.createElement("div");
            editWindow.id = "editWindow";
            //创建 几个输入框和按钮
            var taskHead = document.createElement("input");
            var taskDeadline = document.createElement("input");
            var taskContent = document.createElement("textarea");
            var submitBtn = document.createElement("input");
            var cancelBtn = document.createElement("input");    

            taskHead.type = "text";
            $(taskHead).addClass("taskHead");
            $(taskHead).val($("h3",$(this).parent()).eq(0).html());

            if(!taskHead.value) {
                taskHead.placeholder = "输入标题";
            }

            //点击编辑按钮时,如果完成日期有内容,就把编辑窗口内容设为完成日期
            //点击新建按钮时,如果没有完成日期,就把当天作为默认完成日期
            taskDeadline.type = "text";
            $(taskDeadline).addClass("taskDeadline");
            $(taskDeadline).val($("span",$(this).parent()).eq(2).html());
            // taskDeadline.value = this.parentNode.getElementsByTagName('span')[2].innerHTML;
            if(!taskDeadline.value){
                taskDeadline.placeholder = "完成日期: " + getToday();
            }

            $(taskContent).addClass("taskContent");

            var taskContentValue = $("p",$(this).parent()).eq(0).html();
            $(taskContent).val($.trim(taskContentValue));
            if(!taskContent.value) {
                taskContent.placeholder = "输入内容";
            }

            submitBtn.type = "button";
            submitBtn.className = "submitBtn";
            submitBtn.value = "确定";
            submitBtn.disabled = "disabled";//确定按钮默认是禁用的.通过内容检查后才启用

            cancelBtn.type = "button";
            cancelBtn.className = "cancelBtn";
            cancelBtn.value = "取消";
            //将 输入框和按钮 放入 编辑窗口
            $(editWindow).append($(taskHead),$(taskDeadline),$(taskContent),$(submitBtn),$(cancelBtn));

            //将 编辑窗口 放到任务div.task 父元素的最后面,也是div.task 的 nextSlibing
            $(this).parent().parent().append($(editWindow));
            //设置元素尺寸
            setWidth();
            //标题输入时检查
            $(taskHead).on("focus keyup",check);
            taskHead.focus();

            //截止日期的格式检查
            $(taskDeadline).on("blur",function(){
                if(!/^\s*\d{4}-\d{1,2}-\d{1,2}\s*$/.test($(taskDeadline).val())) {
                    $(taskDeadline).css("border","2px solid red");
                    if(taskDeadline.value.indexOf("请") === -1) {
                        taskDeadline.value += '          请按照格式: "YYYY-MM-DD" 输入日期!';
                    }
                }
                else {
                    taskDeadline.style.border = "";
                }

                check();
            });

            //重新focus的时候删掉提示文字
            $(taskDeadline).on("focus",function(){
                console.log("focus");
                if(taskDeadline.value.indexOf('请按照格式: "YYYY-MM-DD" 输入日期!') > -1) {
                    taskDeadline.value = taskDeadline.value.replace(/\s+请按照格式: "YYYY-MM-DD" 输入日期!/,"");
                }
                else if(!taskDeadline.value) {
                    taskDeadline.value = getToday();
                }
            });

            //取消按钮的事件函数
            var $cancelBtn;
            $cancelBtn = $(".cancelBtn", $(editWindow)).eq(0);
            var body = $("body");
            $cancelBtn.on("click",function(event){
                var message = confirm("确定放弃任务?");
                if(message) {
                    $(editWindow).remove();
                    //检查是否有空的任务
                    checkTask();
                    //检查是否有空的日期
                    checkTodayTask();
                    //刷新任务数
                    refreshTodoItemNum();
                }
                event.stopPropagation();
            });
            if(submitBtn.disabled) {
                $(submitBtn).css("color","#ccc");
            }

            //确定按钮事件函数
            var $taskContainer = $(this).parent();
            $(submitBtn).on("click",function(event){
                var $h3 = $("h3",$taskContainer).eq(0);
                $h3.html($(taskHead).val());
                $taskContainer.prev().html($(taskHead).val());
                $("h4 span",$taskContainer).html($(taskDeadline).val());
                // $("h4 span",$taskContainer).eq(0).children().eq(1).html($(taskDeadline).val());
                $("p",$taskContainer).eq(0).html($(taskContent).val());
                $(editWindow).remove();
                event.stopPropagation();
            });

            //检查是否所有输入框都有填写
            function check(){
                if(taskHead.value && (taskDeadline.value && taskDeadline.style.border != "2px solid red")) {
                    submitBtn.disabled = "";
                    submitBtn.style.color = "#333";
                }
                else {
                    submitBtn.disabled = "disabled";
                    submitBtn.style.color = "#ccc";
                }
            }
            //检查是否有空的日期
            function checkTodayTask(){
                var $dd = $("dd");
                $dd.each(function(){
                    if(!$(this).html()[0]) {
                        $(this).prev().remove();
                        $(this).remove();
                    }
                })
            }
           
            //检查是否有空的任务
            function checkTask(){
                var $p = $("p");
                $p.each(function(){
                    if(!$(this).html()[0]) {
                        $(this).parent().prev().remove();
                        $(this).parent().remove();
                    }
                })
            }
            // 编辑窗口中的按钮取消冒泡
            $("#editWindow").on("click",":input:lt(3)",function(event){
                event.stopPropagation();
            })

            //编辑按钮本身取消冒泡
            event.stopPropagation();
        })
    }
    editTask();

    //创建 input 函数
    function createInput(className,placeholder){
        var input = document.createElement("input");
        input.type = "text";
        input.className = className;
        input.placeholder = placeholder;
        input.style.display = "block";
        input.style.height = "23px";
        return input;
    }

    //新建文件夹 事件处理函数
    (function(){
        var $newFolder = $("#newFolder");
        var $classifyList = $("#classifyList");
        $newFolder.on("click",function(){
            //先用一个input来输入文件夹名,然后用dt替换;
            var temp = createInput("taskFolder","新建文件夹");
            var $dl = $("dl",$classifyList).eq(0);
            $dl.append(temp);
            temp.focus();

            var dt = document.createElement("dt");
            $(dt).addClass("taskFolder");

            var span = document.createElement("span");
            $(span).addClass("taskItemNum");
            $(span).html(0);

            var dd = document.createElement("dd");
            $(dd).addClass("taskFolderContent");

            //按下回车键时blur
            $(temp).on("keydown",function(event){
                event = event || window.event;
                if(event.keyCode) {
                    if(event.keyCode == 13) {
                        temp.blur();
                    }
                }
            });

            $(temp).on("blur",function(){
                if(!temp.value) {
                    temp.value = temp.placeholder;
                }
                $(dt).html($(temp).val() + "(");
                $(dt).append($(span));
                $(dt).html($(dt).html() + ")");

                $(temp).remove();
                $dl.append(dt);
                $dl.append(dd);

                dt.click();
            })
        })
    })();

    //新建项目 事件处理函数
    (function(){
        var $newItem = $("#newItem");
        $newItem.on("click",function(){
            var $selectedTaskItem = $(".folderOpen").eq(0);
            var $parentEle = $selectedTaskItem ? $selectedTaskItem.next() : $(".taskFolder").eq(0).next();
            var temp = createInput("taskItem", "新建项目");

            $parentEle.append(temp);
            temp.focus();
            if(!$parentEle.prev().hasClass("folderOpen")) {
                $parentEle.prev().click();
            }

            var div = document.createElement("div");
            $(div).addClass("taskItem");

            var span = document.createElement("span");
            $(span).addClass("todoItemNum");
            $(span).html(0);

            var dl = document.createElement("dl");
            $(dl).addClass("taskDate");

            $(temp).on("keydown",function(event){
                event = event || window.event;
                if(event.keyCode) {
                    if(event.keyCode == 13) {
                        temp.blur();
                    }
                }
            });

            $(temp).on("blur",function(){
                if(!temp.value) {
                    temp.value = temp.placeholder;
                }
                $(div).html($(temp).val() + "(");
                $(div).append($(span));
                $(div).html($(div).html() + ")");
                $(div).append(dl);

                $(temp).remove();
                $parentEle.append(div);

                refreshTaskItemNum();
                taskItemToggle();
            })
        })
    })();

    //新建任务 按钮事件处理函数
    (function(){
        var $newTask = $("#newTask");
        $newTask.on("click",function(){
            //得到旧的editWindow,如果有,说明有新建的任务,退出.防止多次点击.
            var $oldEditWindow = $("#editWindow");
            if($oldEditWindow[0]){
                return false;
            }

            var $selectedTaskItem = $(".selectedTaskItem");
            var $parentEle = $selectedTaskItem[0] ? $selectedTaskItem.eq(0) : $(".taskItemDefault").eq(0);
            $parentEle.parent().prev().addClass("folderOpen");
            $parentEle.click();
            
            //用today保存新建任务时候的日期.
            var today = getToday();
            var $dl = $(".taskDate",$parentEle).eq(0);
            var $dt = $("dt",$dl);
            //如果现存的日期中有today,就在目前的日期设为容器.否则,新建一个 today 日期设为容器
            var $container = null;
            $dt.each(function(){
                if($(this).html() === today) {
                    $container = $(this).next();
                }
            });

            if(!$container) {
                var _dt = document.createElement("dt");
                _dt.innerHTML = today;
                var dd = document.createElement("dd");
                $dl.append(_dt);
                $dl.append(dd);
                $container = $(dd);
            }

            var h3 = document.createElement("h3");
            $(h3).addClass("todoItem");
            $(h3).html("新任务");

            var div = document.createElement("div");
            $(div).addClass("task");

            var span1 = document.createElement("span");
            span1.title = "编辑任务";
            $(span1).addClass("edit");
            //待修改
            var span2 = document.createElement("span");
            span2.className = "doneBtn";
            span2.title = "完成任务";
            var h3_2 = document.createElement("h3");
            h3_2.innerHTML = "";
            h3_2.placeholder = "新任务";
            var h4 = document.createElement("h4");
            h4.innerHTML = "任务日期: ";
            h4.appendChild(document.createElement("span"));
            var p = document.createElement("p");

            $(div).append(span1,span2,h3_2,h4,p);

            $container.append(h3);
            $container.append(div);

            //任务点击展开
            todoItemToggle();
            //刷新任务数目
            refreshTodoItemNum();
            //设置宽度
            setWidth();
            //显示任务内容
            h3.click();
            //为完成按钮和编辑按钮添加事件处理函数
            taskDone();
            editTask();
            //显示编辑窗口,编辑任务
            span1.click();
        })
    })();

    //得到当天的日期
    function getToday(){
        var now = new Date();
        return now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
    }
})(jQuery);