			
			var userName, message;
			
			function pageStart(){
				console.log("pageStart works!");
			}
			
			function Q1(){	
				setup_ajax2();
				console.log("Q1 works!");
				
				var x = document.getElementById('ParentDiv');
				var x1 = document.getElementById('pageStart');
				x1.type = "hidden";
				
				//to creat new div
				var newDivQ1 = document.createElement("div");
				var newTextQ1 = document.createTextNode("Q1.What is your name?");
				newDivQ1.appendChild(newTextQ1);
				newDivQ1.id = 'DivQ1';
				newDivQ1.className = 'bodyDiv';
				x.appendChild(newDivQ1);
				
				//to creat new div for AJAX
				var newDivQ1AJAX = document.createElement("div");
				var newTextQ1AJAX = document.createTextNode("FYI... ");
				newDivQ1AJAX.appendChild(newTextQ1AJAX);
				newDivQ1AJAX.id = 'DivQ1AJAX';
				newDivQ1AJAX.className = 'AJAXDiv';
				x.appendChild(newDivQ1AJAX);
				
				//to creat new input
				var newInputQ1 = document.createElement("input");
				newInputQ1.type = "text";
				newInputQ1.name = "nameQ1";
				newInputQ1.value = "Type here..";
				newInputQ1.id = 'InputQ1';
				// newInput.className = "css-class-name"; 
				x.appendChild(newInputQ1); 
				
				//to creat new submit
				var newSubmitQ1 = document.createElement("input");
				// var newSubmitTextQ1 = document.createTextNode("Submit");
				// newSubmitQ1.appendChild(newSubmitTextQ1);
				newSubmitQ1.type = "submit";
				newSubmitQ1.name = "submitQ1";
				newSubmitQ1.id = 'SubmitQ1';
				newSubmitQ1.className = 'tryAgain';
				newSubmitQ1.onclick = Q2;
				// newInput.className = "css-class-name"; 
				x.appendChild(newSubmitQ1); 
			}
			
			function Q2() {
				//to get changed user name
				var _userName = document.getElementById("InputQ1").value;
				console.log(_userName);
				userName = _userName.toUpperCase();
				
		    console.log("Q2 works!");
		   
		    var x = document.getElementById('ParentDiv');
		    var x1 = document.getElementById('DivQ1');
		    var x2 = document.getElementById('InputQ1');
		    var x3 = document.getElementById('SubmitQ1');
		    var x4 = document.getElementById('DivQ1AJAX');
				//to remove Q1
    		x1.style.display = 'none';
    		x2.type = 'hidden';
    		x3.type = 'hidden';
    		x4.style.display = 'none'
    		
  			//to make hidden input for db
    		var hiddenInputQ1 = document.createElement("input");
				hiddenInputQ1.type = "hidden";
				hiddenInputQ1.name = "hiddenInputQ1";
				hiddenInputQ1.id = "hiddenInputQ1";
				hiddenInputQ1.value = userName;
				x.appendChild(hiddenInputQ1);
				
				//to creat new div
				var newDivQ2 = document.createElement("div");
				var newTextQ2 = document.createTextNode('Q2.Okay, hey ' + userName + ". Do you feel this class is easy?");
				newDivQ2.appendChild(newTextQ2);
				newDivQ2.id = 'DivQ2';
				newDivQ2.className = 'bodyDiv';
				x.appendChild(newDivQ2);
				
				//to creat yes submit
				var newSubmitYesQ2 = document.createElement("input");
				newSubmitYesQ2.type = "submit";
				newSubmitYesQ2.name = "SubmitYesQ2";
				newSubmitYesQ2.id = 'SubmitYesQ2';
				newSubmitYesQ2.value = 'Yes';
				newSubmitYesQ2.className = 'tryAgain';
				newSubmitYesQ2.onclick = skitQ3;
				// newInput.className = "css-class-name"; 
				x.appendChild(newSubmitYesQ2); 
				
				//to creat no submit
				var newSubmitNoQ2 = document.createElement("input");
				newSubmitNoQ2.type = "submit";
				newSubmitNoQ2.name = "SubmitNoQ2";
				newSubmitNoQ2.id = 'SubmitNoQ2';
				newSubmitNoQ2.value = 'No';
				newSubmitNoQ2.className = 'tryAgain';
				newSubmitNoQ2.onclick = Q3A;
				// newInput.className = "css-class-name"; 
				x.appendChild(newSubmitNoQ2); 

			}
			
			function skitQ3(){
				alert("huh......"); 
				Q3B();
			}
			
			function Q3A(){
				console.log("Q3 works!");
		    
		    var x = document.getElementById('ParentDiv');
		    var x1 = document.getElementById('DivQ2');
		    var x2 = document.getElementById('SubmitYesQ2');
		    var x3 = document.getElementById('SubmitNoQ2');
				//to remove Q2
    		x1.style.display = 'none';
    		x2.type = 'hidden';
    		x3.type = 'hidden';
    		
    		//to make hidden input for db
    		var hiddenInputQ2 = document.createElement("input");
				hiddenInputQ2.type = "hidden";
				hiddenInputQ2.name = "hiddenInputQ2";
				hiddenInputQ2.id = "hiddenInputQ2";
				hiddenInputQ2.value = "Likewise my thought, " + userName + " feels this class is not easy. Of course...";
				x.appendChild(hiddenInputQ2); 
				
    		//to creat new div
				var newDivQ3 = document.createElement("div");
				var newTextQ3 = document.createTextNode("Q3.Do you think 7 weeks are enough to learn HTML/CSS/JAVASCRIPT/NODE.js???????");
				newDivQ3.appendChild(newTextQ3);
				newDivQ3.id = 'DivQ3';
				newDivQ3.className = 'bodyDiv';
				x.appendChild(newDivQ3);
				
				//to creat yes submit
				var newSubmitYesQ3 = document.createElement("input");
				newSubmitYesQ3.type = "submit";
				newSubmitYesQ3.name = "SubmitYesQ3";
				newSubmitYesQ3.id = 'SubmitYesQ3';
				newSubmitYesQ3.value = 'Yes';
				newSubmitYesQ3.className = 'tryAgain';
				newSubmitYesQ3.onclick = skitQ4;
				// newInput.className = "css-class-name"; 
				x.appendChild(newSubmitYesQ3); 
				
				//to creat no submit
				var newSubmitNoQ3 = document.createElement("input");
				newSubmitNoQ3.type = "submit";
				newSubmitNoQ3.name = "SubmitNoQ3";
				newSubmitNoQ3.id = 'SubmitNoQ3';
				newSubmitNoQ3.value = 'No';
				newSubmitNoQ3.className = 'tryAgain';
				newSubmitNoQ3.onclick = Q4A;
				// newInput.className = "css-class-name"; 
				x.appendChild(newSubmitNoQ3); 
			}
			
			function Q3B(){
				console.log("Q3 works!");
		    
		    var x = document.getElementById('ParentDiv');
		    var x1 = document.getElementById('DivQ2');
		    var x2 = document.getElementById('SubmitYesQ2');
		    var x3 = document.getElementById('SubmitNoQ2');
				//to remove Q2
    		x1.style.display = 'none';
    		x2.type = 'hidden';
    		x3.type = 'hidden';
    		
    		//to make hidden input for db
  			var hiddenInputQ2 = document.createElement("input");
				hiddenInputQ2.type = "hidden";
				hiddenInputQ2.name = "hiddenInputQ2";
				hiddenInputQ2.id = "hiddenInputQ2";
				hiddenInputQ2.value = "But, I know you might be Shawn....";
				x.appendChild(hiddenInputQ2); 
				
    		//to creat new div
				var newDivQ3 = document.createElement("div");
				var newTextQ3 = document.createTextNode("Q3.Do you think 7 weeks are enough \n to learn HTML/CSS/JAVASCRIPT/NODE.js???????");
				newDivQ3.appendChild(newTextQ3);
				newDivQ3.id = 'DivQ3';
				newDivQ3.className = 'bodyDiv';
				x.appendChild(newDivQ3);
				
				//to creat yes submit
				var newSubmitYesQ3 = document.createElement("input");
				newSubmitYesQ3.type = "submit";
				newSubmitYesQ3.name = "SubmitYesQ3";
				newSubmitYesQ3.id = 'SubmitYesQ3';
				newSubmitYesQ3.value = 'Yes';
				newSubmitYesQ3.className = 'tryAgain';
				newSubmitYesQ3.onclick = skitQ4;
				// newInput.className = "css-class-name"; 
				x.appendChild(newSubmitYesQ3); 
				
				//to creat no submit
				var newSubmitNoQ3 = document.createElement("input");
				newSubmitNoQ3.type = "submit";
				newSubmitNoQ3.name = "SubmitNoQ3";
				newSubmitNoQ3.id = 'SubmitNoQ3';
				newSubmitNoQ3.value = 'No';
				newSubmitNoQ3.className = 'tryAgain';
				newSubmitNoQ3.onclick = Q4A;
				// newInput.className = "css-class-name"; 
				x.appendChild(newSubmitNoQ3); 
			}
			
			function skitQ4(){
				alert("You must be Shawn... \n\nIf not, \nhuh...... who are you........"); 
				Q4B();
			}
			
	/* -- AJAX time! from here -- */
	var interval = null;	

	function call_ajax1()
	{
		loadJSON('/data',ajax_return1);
	}

	function ajax_return1(_response)
	{
		var response = _response;
		if(response !== null){
			for (var i = 0; i < response.length; i++) {
				var random = Math.round(Math.random(i) * (response.length - 1));
				console.log("random value is : " + random);
				console.log("response.length is : " + response.length);
				document.getElementById("DivQ4AJAX").innerHTML = "FYI, Someone said, " + response[random].Q5B;
			}
		}
	}
	function setup_ajax1()
	{				
		interval = setInterval(call_ajax1,2500);
		console.log("AJAX works!");
	}
	function call_ajax2()
	{
		loadJSON('/data',ajax_return2);
	}

	function ajax_return2(_response)
	{
		var response = _response;
		if(response !== null){
			for (var i = 0; i < response.length; i++) {
				var random = Math.round(Math.random(i) * (response.length - 1));
				console.log("random value is : " + random);
				console.log("response.length is : " + response.length);
				document.getElementById("DivQ1AJAX").innerHTML = "FYI, " + response[random].Q2 + " already did this.";
			}
		}
	}
	function setup_ajax2()
	{				
		interval = setInterval(call_ajax2,2500);
		console.log("AJAX works!");
	}
	/* -- AJAX time! from here -- */
			
			function Q4A(){
				// Register setup_ajax with the onload event of the window (when it is done loading)..	
				setup_ajax1();
			
				console.log('Q4 works!');
				
				var x = document.getElementById('ParentDiv');
		    var x1 = document.getElementById('DivQ3');
		    var x2 = document.getElementById('SubmitYesQ3');
		    var x3 = document.getElementById('SubmitNoQ3');
				//to remove Q3
    		x1.style.display = 'none';
    		x2.type = 'hidden';
    		x3.type = 'hidden';
    		
    		//to make hidden input for db
    		var hiddenInputQ3 = document.createElement("input");
				hiddenInputQ3.type = "hidden";
				hiddenInputQ3.name = "hiddenInputQ3";
				hiddenInputQ3.id = "hiddenInputQ3";
				hiddenInputQ3.value = "also, " + userName + " thinks this class should be more than 7 weeks. So do I.";
				x.appendChild(hiddenInputQ3); 
    		
    		//to creat new div
				var newDivQ4 = document.createElement("div");
				var newTextQ4 = document.createTextNode("Q4.Say something to Shawn.");
				newDivQ4.appendChild(newTextQ4);
				newDivQ4.id = 'DivQ4';
				newDivQ4.className = 'bodyDiv';
				x.appendChild(newDivQ4);
				
				//to creat new div for AJAX
				var newDivQ4AJAX = document.createElement("div");
				var newTextQ4AJAX = document.createTextNode("FYI, Someone said... ");
				newDivQ4AJAX.appendChild(newTextQ4AJAX);
				newDivQ4AJAX.id = 'DivQ4AJAX';
				newDivQ4AJAX.className = 'AJAXDiv';
				x.appendChild(newDivQ4AJAX);
				
				//to create div for line break
				var newDivQ4G = document.createElement("div");
				x.appendChild(newDivQ4G);
				
				//to creat new textarea
				var newTextareaQ4 = document.createElement("textarea");
				newTextareaQ4.type = "text";
				newTextareaQ4.name = "nameQ4";
				newTextareaQ4.value = "Type here..";
				newTextareaQ4.id = 'TextareaQ4';
				newDivQ4G.appendChild(newTextareaQ4); 
				
				//to creat new submit
				var newSubmitQ4 = document.createElement("input");
				newSubmitQ4.type = "submit";
				newSubmitQ4.name = "submitQ4";
				newSubmitQ4.id = 'SubmitQ4';
				newSubmitQ4.value = 'Submit';
				newSubmitQ4.className = 'tryAgain';
				newSubmitQ4.onclick = Q5A;
				// newInput.className = "css-class-name"; 
				x.appendChild(newSubmitQ4); 
			}
				
			function Q4B(){
					// Register setup_ajax with the onload event of the window (when it is done loading)..	
					setup_ajax1();
					console.log('Q4 works!');
					
					var x = document.getElementById('ParentDiv');
			    var x1 = document.getElementById('DivQ3');
			    var x2 = document.getElementById('SubmitYesQ3');
			    var x3 = document.getElementById('SubmitNoQ3');
			    
					//to remove Q3
	    		x1.style.display = "none";
	    		x2.type = "hidden";
	    		x3.type = "hidden";
	    		
	    		
	    		//to make hidden input for db
	    		var hiddenInputQ3 = document.createElement("input");
					hiddenInputQ3.type = "hidden";
					hiddenInputQ3.name = "hiddenInputQ3";
					hiddenInputQ3.id = "hiddenInputQ3";
					hiddenInputQ3.value = "I'm 100% sure you must be Shawn!";
					x.appendChild(hiddenInputQ3); 
	    		
	    		//to creat new div
					var newDivQ4 = document.createElement("div");
					var newTextQ4 = document.createTextNode("Q4.Say something to Shawn.");
					newDivQ4.appendChild(newTextQ4);
					newDivQ4.id = "DivQ4";
					newDivQ4.className = "bodyDiv";
					x.appendChild(newDivQ4);
					
					//to creat new div for AJAX
				var newDivQ4AJAX = document.createElement("div");
				var newTextQ4AJAX = document.createTextNode("Someone said... ");
				newDivQ4AJAX.appendChild(newTextQ4AJAX);
				newDivQ4AJAX.id = 'DivQ4AJAX';
				newDivQ4AJAX.className = 'AJAXDiv';
				x.appendChild(newDivQ4AJAX);
					
					//to create div for line break
					var newDivQ4G = document.createElement("div");
					x.appendChild(newDivQ4G);
					
					//to creat new textarea
					var newTextareaQ4 = document.createElement("textarea");
					newTextareaQ4.type = "text";
					newTextareaQ4.name = "nameQ4";
					newTextareaQ4.value = "Type here..";
					newTextareaQ4.id = "TextareaQ4";
					newDivQ4G.appendChild(newTextareaQ4); 
					
					//to creat new submit
					var newSubmitQ4 = document.createElement("input");
					newSubmitQ4.type = "submit";
					newSubmitQ4.name = "submitQ4";
					newSubmitQ4.id = "submitQ4";
					newSubmitQ4.value = "Submit";
					newSubmitQ4.className = "tryAgain";
					newSubmitQ4.onclick = Q5B;
					// newInput.className = "css-class-name"; 
					x.appendChild(newSubmitQ4); 
			}
				
			function Q5A(){
				console.log('Q5 works!');
				
				//to get changed message
				var _message = document.getElementById("TextareaQ4").value;
				console.log(_message);
				message = _message.toUpperCase();
				
				var x = document.getElementById('ParentDiv');
		    var x1 = document.getElementById('DivQ4');
		    var x2 = document.getElementById('TextareaQ4');
		    var x3 = document.getElementById('SubmitQ4');
		    var x4 = document.getElementById('DivQ4AJAX');
				//to remove Q4
    		x1.style.display = 'none';
    		x2.style.display = 'none';
    		x3.type = 'hidden';
    		x4.style.display = 'none';
    		
    		//to make hidden input for db
    		var hiddenInputQ4 = document.createElement("input");
				hiddenInputQ4.type = "hidden";
				hiddenInputQ4.name = "hiddenInputQ4";
				hiddenInputQ4.id = "hiddenInputQ4";
				hiddenInputQ4.value = " Shawn, this is message from " + userName + ". ";
				x.appendChild(hiddenInputQ4); 
				
				//to make hidden input for db (for stress)
    		var hiddenInputQ4B = document.createElement("input");
				hiddenInputQ4B.type = "hidden";
				hiddenInputQ4B.name = "hiddenInputQ4B";
				hiddenInputQ4B.id = "hiddenInputQ4B";
				hiddenInputQ4B.value = "\"" + message + "\"";
				x.appendChild(hiddenInputQ4B); 
    		
    		//to creat new div
				var newDivQ5 = document.createElement("div");
				var newTextQ5 = document.createTextNode("Q5.Do you want to share this survey to Shawn?");
				newDivQ5.appendChild(newTextQ5);
				newDivQ5.id = 'DivQ5';
				newDivQ5.className = 'bodyDiv';
				x.appendChild(newDivQ5);
				
				//to creat yes submit
				var newSubmitYesQ5 = document.createElement("input");
				newSubmitYesQ5.type = "submit";
				newSubmitYesQ5.name = "SubmitYesQ5";
				newSubmitYesQ5.id = 'SubmitYesQ5';
				newSubmitYesQ5.value = 'Yes';
				newSubmitYesQ5.className = 'tryAgain';
				newSubmitYesQ5.onclick = renderCommentAa;
				// newInput.className = "css-class-name"; 
				x.appendChild(newSubmitYesQ5); 
				
				//to creat no submit
				var newSubmitNoQ5 = document.createElement("input");
				newSubmitNoQ5.type = "submit";
				newSubmitNoQ5.name = "SubmitNoQ5";
				newSubmitNoQ5.id = 'SubmitNoQ5';
				newSubmitNoQ5.value = 'No';
				newSubmitNoQ5.className = 'tryAgain';
				newSubmitNoQ5.onclick = renderCommentAb;
				// newInput.className = "css-class-name"; 
				x.appendChild(newSubmitNoQ5); 
			}
			
			function Q5B(){
				console.log('Q5 works!');
				
				//to get changed message
				var _message = document.getElementById("TextareaQ4").value;
				console.log(_message);
				message = _message.toUpperCase();
				
				var x = document.getElementById('ParentDiv');
                var x1 = document.getElementById('DivQ4');
                var x2 = document.getElementById('TextareaQ4');
                var x3 = document.getElementById('submitQ4');
                var x4 = document.getElementById('DivQ4AJAX');
				//to remove Q4
                x1.style.display = 'none';
                x2.style.display = 'none';
                x3.type = 'hidden';
                x4.style.display = 'none';
    		
    		//to make hidden input for db
    		var hiddenInputQ4 = document.createElement("input");
				hiddenInputQ4.type = "hidden";
				hiddenInputQ4.name = "hiddenInputQ4";
				hiddenInputQ4.id = "hiddenInputQ4";
				hiddenInputQ4.value = 'Shawn, are you trying to message to yourself? Anyway, this is a message from Shawn. ';
				x.appendChild(hiddenInputQ4); 
				
				//to make hidden input for db (for stress)
    		var hiddenInputQ4B = document.createElement("input");
				hiddenInputQ4B.type = "hidden";
				hiddenInputQ4B.name = "hiddenInputQ4B";
				hiddenInputQ4B.id = "hiddenInputQ4B";
				hiddenInputQ4B.value = "\"" + message + "\"";
				x.appendChild(hiddenInputQ4B); 
    		
    		//to creat new div
				var newDivQ5 = document.createElement("div");
				var newTextQ5 = document.createTextNode("Q5.Do you want to share this survey to Class?");
				newDivQ5.appendChild(newTextQ5);
				newDivQ5.id = 'DivQ5';
				newDivQ5.className = 'bodyDiv';
				x.appendChild(newDivQ5);
				
				//to creat yes submit
				var newSubmitYesQ5 = document.createElement("input");
				newSubmitYesQ5.type = "submit";
				newSubmitYesQ5.name = "SubmitYesQ5";
				newSubmitYesQ5.id = 'SubmitYesQ5';
				newSubmitYesQ5.value = 'Yes';
				newSubmitYesQ5.className = 'tryAgain';
				newSubmitYesQ5.onclick = renderCommentAa;
				// newInput.className = "css-class-name"; 
				x.appendChild(newSubmitYesQ5); 
				
				//to creat no submit
				var newSubmitNoQ5 = document.createElement("input");
				newSubmitNoQ5.type = "submit";
				newSubmitNoQ5.name = "SubmitNoQ5";
				newSubmitNoQ5.id = 'SubmitNoQ5';
				newSubmitNoQ5.value = 'No';
				newSubmitNoQ5.className = 'tryAgain';
				newSubmitNoQ5.onclick = renderCommentAc;
				// newInput.className = "css-class-name"; 
				x.appendChild(newSubmitNoQ5);
			}
			
			function renderCommentAa(){
				var x = document.getElementById('ParentDiv');
				
				//to make hidden input for db
    		var hiddenInputQ5 = document.createElement("input");
				hiddenInputQ5.type = "hidden";
				hiddenInputQ5.name = "hiddenInputQ5";
				hiddenInputQ5.id = "hiddenInputQ5";
				hiddenInputQ5.value = userName + ' wants you to know this :)';
				x.appendChild(hiddenInputQ5); 
	
    		var newFormQ5 = document.createElement("form");
				newFormQ5.id = 'ParentBtn';
				newFormQ5.method = 'POST';
				newFormQ5.action = '/savecommentA';
				newFormQ5.appendChild(x);
			}
			
			function renderCommentAb(){
				var x = document.getElementById('ParentDiv');
				
				//to make hidden input for db
    		var hiddenInputQ5 = document.createElement("input");
				hiddenInputQ5.type = "hidden";
				hiddenInputQ5.name = "hiddenInputQ5";
				hiddenInputQ5.id = "hiddenInputQ5";
				hiddenInputQ5.value = ' But, ' + userName + ' does not want you to know this :b';
				x.appendChild(hiddenInputQ5); 
	
    		var newFormQ5 = document.createElement("form");
				newFormQ5.id = 'ParentBtn';
				newFormQ5.method = 'POST';
				newFormQ5.action = '/savecommentA';
				newFormQ5.appendChild(x);
			}
			
			function renderCommentAc(){
				var x = document.getElementById('ParentDiv');
				
				//to make hidden input for db
    		var hiddenInputQ5 = document.createElement("input");
				hiddenInputQ5.type = "hidden";
				hiddenInputQ5.name = "hiddenInputQ5";
				hiddenInputQ5.id = "hiddenInputQ5";
				hiddenInputQ5.value = ' But, Shawn does not want class to know this :p';
				x.appendChild(hiddenInputQ5); 
	
    		var newFormQ5 = document.createElement("form");
				newFormQ5.id = 'ParentBtnAc';
				newFormQ5.method = 'POST';
				newFormQ5.action = '/savecommentA';
				newFormQ5.appendChild(x);
			}
			
			function goReplace(str) {
				location.replace(str);
			}
		
			window.addEventListener('load', pageStart);

			//p5.js requires setup
			function setup(){}
