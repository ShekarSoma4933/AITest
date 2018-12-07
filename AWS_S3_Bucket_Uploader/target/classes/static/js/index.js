var fileListTable = null;
	
$(document).ready(function() {
	$('.loginForm').hide();
	$('.forgetForm').hide();
	$("#alrdyUser").click(function() {
		$('.loginForm').show();
		$('.signinForm').hide();
		$('.forgetForm').hide();
	});
	$("#frgtPwd").click(function() {
		$('.loginForm').hide();
		$('.signinForm').hide();
		$('.forgetForm').show();
	});
	$("#frgtPwdLogin").click(function() {
		$('.loginForm').hide();
		$('.signinForm').hide();
		$('.forgetForm').show();
	});
	
	
	$("#signIn").click((event) => {
	    event.preventDefault();
		window.location.replace("/welcome/uploadFilePage");
	});
	
	$("#btnSubmit").click((event) => {
	    event.preventDefault();
	    doAjax();
	});
	
	
	$("#s3Uploader").click(function() {
		$('.container').show();
	});
	
    //DO POST
	function doAjax() {

	// Get form
	var form = $('#fileUploadForm')[0];
	var data = new FormData(form);

	$.ajax({
	    type: "POST",
	    enctype: 'multipart/form-data',
	    url: "/welcome/upload",
	    data: data,
	    processData: false, 
	    contentType: false,
	    cache: false,
	    success: (data) => {
	       $("#uploadfile").val('');
	       $("#listFiles").text(data);
	    },
	    error: (e) => {
	       $("#listFiles").text(e.responseText);
	    }
	});
	}

	$("#btnGetFiles").click( (event) => {
		event.preventDefault();
		ajaxGet();
	});
	var fileListTable= $('#fileListTable').DataTable({		
        "paging":true,
        "ordering":false,
        "searching": true,
        "bInfo" : false,
	});
	
	// DO GET
	function ajaxGet(){
		$.ajax({
			type : "GET",
			dataType: "json",	
			url : "/welcome/getAllFiles",
			success: (data) => {
				
				$("#fileListTable tbody").empty();
				var tbody = $('#fileListTable:last');
				$.each(data, (index, filename) => {
					tbody.append(
						
						'<tr>'+
						'<td> <span style="color:black;font-family: monospace;font-size: 18px;list-style-type: none;margin-left:-2px;">' + filename + '</span></td>'+
						'<td> <a class="fas fa-trash-alt" style="margin-left: 150px;position: absolute;margin-top: 1px;list-style-type: none;" aria-hidden="true" onclick="deleteFile(\''+filename+'\')"></a>'+'<a class="fas fa-file-download" style="list-style-type: none;margin-left: 120px;color: black;" aria-hidden="true" href=/welcome/getfile/' + filename + ' ></a></td>'+
						'</tr>'
				);
				});
				/*
					$("#listFiles").html("");
					$("#listFiles").append('<ul>');
					$.each(data, (index, filename) => {
						$("#listFiles").append('<li><span style="color:black;font-family: monospace;font-size: 18px;list-style-type: none;margin-left:42px;">' + filename + '</span>'+'<a style="cursor:pointer;position:absolute;color:black;padding: 7px 0px;margin-left:80px" class="fas fa-trash-alt" aria-hidden="true" onclick="deleteFile(\''+filename+'\')"></a>'+'<a class="fas fa-arrow-circle-down" style="margin-left:110px;cursor:pointer;color:black;position: absolute;padding: 12px 16px;margin-top:-5px" aria-hidden="true" href=/welcome/getfile/' + filename + ' >'+'</a>'+'</li>');
						$("#listFiles").append('<br/>');
					});
					$("#listFiles").append('</ul>');
			*/
				
			},
			error : (err) => {
				$("#listFiles").html(err.responseText);
			}
		});		
	}
	
});

function deleteFile(data){
	$.ajax({
		type : "POST",
		url : "/welcome/deleteFile",
		contentType : "application/json",
		dataType : "json",
		data : JSON.stringify({'keyName':data}),
		success : function(data) {
			fileListTable.clear();
			fileListTable.rows.add(data);
			fileListTable.draw();
			
		},
		error : function() {
			
		}
	});
}
