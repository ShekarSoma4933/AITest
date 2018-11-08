$(document).ready(function() {
	
	$("#alrdyUser").click(function() {
		window.location.replace("/welcome/signIn");
	});
	$("#frgtPwd").click(function() {
		window.location.replace("/welcome/forgetPwd");
	});
	
	$("#signInForm").click(function() {
		window.location.replace("/welcome/uploadFilePage");
	});
	
	$("#btnSubmit").click((event) => {
	    event.preventDefault();
	    doAjax();
	});
	
	
	$('.container').hide();
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
	
	// DO GET
	function ajaxGet(){
		$.ajax({
			type : "GET",
			dataType: "json",	
			url : "/welcome/getAllFiles",
			success: (data) => {
				
				
					$("#listFiles").html("");
					$("#listFiles").append('<ul>');
					$.each(data, (index, filename) => {
						$("#listFiles").append('<li><span style="color:white;font-family: monospace;font-size: 18px;">' + filename + '</span>'+'<a style="cursor:pointer;position:absolute;color:white;padding: 7px 0px;left:120%;" class="fas fa-trash-alt" aria-hidden="true" onclick="deleteFile(\''+filename+'\')"></a>'+'<a class="fas fa-arrow-circle-down" style="margin-left:80px;cursor:pointer;color:white;position: absolute;right: -46%;padding: 12px 16px;margin-top:-5px" aria-hidden="true" href=/welcome/getfile/' + filename + ' >'+'</a>'+'</li>');
						$("#listFiles").append('<hr style="color:white;"/>');
					});
					$("#listFiles").append('</ul>');
			
				
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
			$('.container').show();
			
		},
		error : function() {
			
		}
	});
}



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
	  
