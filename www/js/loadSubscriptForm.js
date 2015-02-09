function sendSubscript(){
      sessionStorage['plate']=document.getElementsByName("plate")[0].value;
      sessionStorage['mail']=document.getElementsByName("mail")[0].value;
      sessionStorage['password1']=document.getElementsByName("password1")[0].value;
      sessionStorage['password2']=document.getElementsByName("password2")[0].value;
      if (sessionStorage['password1']==sessionStorage['password2']){
		window.location="#subscribed";
	}
	else{
		window.location="#subscription";
	}

 }
