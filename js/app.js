(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!

	var $header = $(".header");
	var $main = $(".main");
	var $todoList = $(".todo-list");
	var $footer = $(".footer");
	var taskList = [];
	var key = 0;

	init();
	submit();
	check();
	checkAll();
	clear();
	clearCompleted();
	tab();
	edit();

	//init
	function init(){
		taskList = store.get("taskList") || [];
		bind();
	}

	//submit
	function submit(){
		$header.find("form").on("submit", function(ev){
			ev.preventDefault();
			if(!$header.find("input").val()){
				return;
			}
			taskList.push({
				content: $header.find("input").val()
			});
			$header.find("input").val("");
			bind();
		})
	}

	//create html
	function html(data, index){
		var str = '';
		str += '<li data-index="' + index + '">';
		str += '<div class="view">';
		str += '<input class="toggle" type="checkbox">';
		str += '<label>' + data.content + '</label>';
		str += '<button class="destroy"></button>';
		str += '</div>';
		str += '<input class="edit" value="">';
		str += '</li>';

		return $(str);
	}

	//bind html
	function bind(){
		$todoList.empty();
		key = 0;
		var complete = false;
		var allChecked = true;
		if(taskList.length > 0){
			$main.find("label").show();
		}else{
			$main.find("label").hide();
		}
		$.each(taskList, function(index){
			var $str = html(taskList[index], index);
			$todoList.append($str);
			if(taskList[index].complete && taskList[index].complete == true){
				$footer.find(".todo-count strong").html(key);
				$str.addClass("completed");
				$str.find(".toggle").prop('checked',true);
				complete = true;
			}else{
				$footer.find(".todo-count strong").html(++key);
				$str.removeClass("completed");
				$str.find(".toggle").prop('checked',false);
				allChecked = false;
			}
		});
		if(complete){
			$footer.find(".clear-completed").show();
		}else{
			$footer.find(".clear-completed").hide();
		}
		if(allChecked){
			$main.find(".toggle-all").prop('checked',true);
		}else{
			$main.find("#toggle-all").prop('checked',false);
		}
		filters();
		storeData();
		edit();
	}

	//store data
	function storeData(){
		store.set("taskList", taskList);
	}

	//check task
	function check(){
		$todoList.on("click", ".toggle", function(){
			var index = $(this).parent().parent().data("index");
			if($(this).is(":checked")){
				taskList[index].complete = true;
			}else{
				taskList[index].complete = false;
			}
			bind();
		})
	}

	//check all task
	function checkAll(){
		$main.find(".toggle-all").on("click", function(){
			if($main.find(".toggle-all").is(":checked")){
				$.each(taskList, function(index){
					taskList[index].complete = true;
				});
			}else{
				$.each(taskList, function(index){
					taskList[index].complete = false;
				});
			}
			bind();
		})
	}

	//clear task
	function clear(){
		$todoList.on("click", ".destroy", function(){
			var index = $(this).parent().parent().data("index");
			taskList.splice(index, 1);
			bind();
		})
	}

	//clear all completed task
	function clearCompleted(){
		$footer.find(".clear-completed").on("click", function(){
			for(var i = taskList.length - 1; i >= 0; i--){
				if(taskList[i].complete && taskList[i].complete == true){
					taskList.splice(i, 1);
				}
			}
			bind();
		})
	}

	//tab
	function tab(){
		$footer.find(".filters li").each(function(index, ele){
			$(ele).on("click", function(){
				$(this).find("a").addClass("selected");
				$(this).siblings().find("a").removeClass("selected");
				filters();
			})
		});
	}

	//filter tasks which are not meet the conditions
	function filters(){
		if($footer.find(".filters li").eq(0).find("a").hasClass("selected")){
			$todoList.find("li").show();
		}else if($footer.find(".filters li").eq(1).find("a").hasClass("selected")){
			$todoList.find("li").hide();
			$todoList.find("li").not(".completed").show();
		}else{
			$todoList.find("li").hide();
			$todoList.find("li").filter(".completed").show();
		}
	}


	//double click to edit a todo
	function edit(){
		$todoList.find("label").on("dblclick", function(){
			$(this).hide();
			$(this).parent().parent().find(".edit").show().val($(this).html());
		});
		$todoList.find(".edit").on("blur", function(){
			var index = parseInt($(this).parent().data("index"));
			$(this).hide();
			$(this).parent().find("label").show();
			taskList[index].content = $(this).val() ? $(this).val() : taskList[$(this).index()].content;
			bind();
		})
	}

})(window);
