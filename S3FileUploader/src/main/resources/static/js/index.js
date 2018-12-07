$(document).ready(function() {
	
	$("#alrdyUser").click(function() {
		window.location.replace("/welcome/login");
	});
	$("#frgtPwd").click(function() {
		window.location.replace("/welcome/getPasswordPage");
	});
	
	$("#signIn").click((event) => {
	    event.preventDefault();
		window.location.replace("/welcome/uploadFilePage");
	});
	
	$("#btnSubmit").click((event) => {
	    event.preventDefault();
	    doAjax();
	});
	
	
	//$('#uploadForm').hide();
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
						'<td> <span style="color:black;font-family: monospace;font-size: 18px;list-style-type: none;margin-left:56px;">' + filename + '</span></td>'+
						'<td> <a class="fas fa-trash-alt" style="margin-left: 150px;position: absolute;margin-top: 1px;" aria-hidden="true" onclick="deleteFile(\''+filename+'\')"></a>'+'<a class="fas fa-file-download" style="list-style-type: none;margin-left: 120px;color: black;" aria-hidden="true" href=/welcome/getfile/' + filename + ' ></a></td>'+
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
	// DO GET
		
	
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
//
//function getAllfiles(data){
//
//	alert(JSON.stringify(data));
//	files[]
//	
//	var fileIdUnique = [];
//	$.each(files, function(i, el){
//	    if($.inArray(el, fileIdUnique) === -1) fileIdUnique.push(el);
//	});
//	attributes = [];
//	fileNameArray = [];
//	
//	
//	$.each(fileIdUnique, function( index, value ){
//		
//		
//	console.log("value-->"+value);
//	attributes["fileName"] = value.fileName;
//	
//	var jObject={} 
//	for (i in attributes ){
//		jObject[i] = attributes[i]
//	}
//	
//
//	fileNameArray.push(jObject);
//	console.log(fileNameArray);
//	
//	
//});
//console.log("supplier Name-->"+JSON.stringify(fileNameArray));
//
//
//supplier(fileNameArray);
//
//
///*var dataTable= $('#Suplier').DataTable({		
//	              "paging":false,
//	              "ordering":false,
//	              "searching": false,
//	              "bInfo" : false,
//});*/
//
//
//	function supplier(fileNameArray){
//		
//		console.log("supplier Name inside-->"+fileNameArray);			
//		console.log("supplier Name length-->"+fileNameArray.length);			
//		
//		
//		
//		$("#fileListTable tbody").empty();
//		var tbody = $('#fileListTable:last');
//		var i=1;
//		
//		var fileName="";
//		
//		$.each(fileNameArray, function(key, value){
//		    $.each(value, function(key, value){
//		        console.log(key+"----key, value-->"+value);
//		    });
//		});
//			
//		$.each(fileNameArray, function(key, value)
//		{
//			$.each(value, function(key, value){
//			        console.log(key+"----key, value-->"+value);
//			        
//			        if(key === "supplierName") 
//			        	fileName = value;
//			});
//			
//			var fileId = "fileId"+i;	
//			
//				
//			
//			tbody.append(
//					
//					'<tr>'+
//					'<td> <span name="'+fileId+'" id ="'+fileId+'" value="'+fileId+'" mandatory="true"><span/> </td>'+
//					'<td> <button id="editDelFromtable"  type="button"  class="btn btn-danger btn-xs marrgt69 delete delFromtable"  style="margin-left:2px"> <span data-toggle="modal"><i class="fa  fa-trash-o fa-1x"></i></span></button> </td>'+
//					'</tr>'
//			);
//			i++;
//			
//		});
//			
//	
//		}
//
//
//	
//	
//	
//}

/*
$.fn.serializeObject = function(){
var o = {};
var a = this.serializeArray();
$.each(a, function() {
    if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
    } else {
        o[this.name] = this.value || '';
    }
});
return o;
};

function nonSSLCheck(){

	if($('#nonssl').val() == 'N'){
		$('#certPath').val('');
		$('#certPath').prop("disabled",true);
		$('#password').val('');
		$('#password').prop("disabled",true);
		$('#cipherSuite').val('');
		$('#cipherSuite').prop("disabled",true);
		$('#channel').val('KLFS.NONSSL.SVRCONN');
	}else{
		$('#certPath').prop("disabled",false);
		$('#password').prop("disabled",false);
		$('#cipherSuite').prop("disabled",false);
	}
}

function sSLCheck(){

	if($('#ssl').val() == 'Y'){
		$('#certPath').val('/opt/IBM/WebSphere8/AppServer/java_1.7_64/jre/lib/security/cacerts');
		$('#certPath').prop("disabled",false);
		$('#cipherSuite').val('SSL_RSA_WITH_3DES_EDE_CBC_SHA');
		$('#cipherSuite').prop("disabled",false);
		$('#channel').val('KLFS.SSL.SVRCONN');
	}
	
}



function sendMQData(){
console.log("Eneterd");
var jsonString = JSON.stringify($('#addRiskRatingForm').serializeObject());
console.log(jsonString);
$.ajax({
    type: "POST",
    data : jsonString,
	url : "/leasing/rpt/getMqData",
    contentType: "application/json",
    success : function(response) {
    	console.log(JSON.stringify(response));
			$('.responseXMl').val(response.responseXml);
			$('.exceptions').val(response.exceptions);
			console.log("success");
		},
	error : function() {
			console.log("failure");
		}
   });
}
*/
//
//$("#alreadyUser").click(
//		function() {
//			
//			$.ajax({
//			    type: "GET",
//				url : "/welcome/signIn",
//			    success : function() {
////			    	window.location.reload("http://localhost:8080/welcome/signIn");
//						console.log("success");
//					},
//				error : function() {
//						console.log("failure");
//					}
//			   });
//			
//			
//		});

//
//function alreadyUser(){
//	console.log("Entered in already user function");
//	$.ajax({
//	    type: "GET",
//		url : "/welcome/signIn",
//	    success : function() {
//				console.log("success");
//			},
//		error : function() {
//				console.log("failure");
//			}
//	   });
//	}

//
//$('a').click(function(event) { 
//    event.preventDefault(); 
//    $.ajax({
//    	type: "GET",
//        url: $(this).attr('href'),
//        success: function(response) {
//            alert(response);
//        }
//    });
//    return false; 
//});
//


/*

function sendMQData() {
		  var values = $('form.addRiskRatingForm').serialize();
		  attributes = {};
		  values.replace(/([^&]+)=([^&]*)/g, function (match, name, value) {
				attributes[name] = value;
			});
		  attributes.certPath = unescape(decodeURIComponent(attributes.certPath));
		  attributes.requestXml = unescape(decodeURIComponent(attributes.requestXml));
		  console.log("form values"+JSON.stringify(attributes));
		  $.ajax({
				type : "POST",
				url : "/leasing/risk/getMqData",
				contentType: "application/json",
				data : JSON.stringify(attributes),
				success : function(response) {
					$('#responseXMl').val(response.responseXml);
					console.log("success");
				},
				error : function() {
					console.log("failure");
				}
			});
		  
		  
		  
		  }
	  */
	  
