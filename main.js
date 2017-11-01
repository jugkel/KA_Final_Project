

		var accessToken = "9b9d26cd88db4e04b95d011945d48623";
		var baseUrl = "https://api.api.ai/v1/";
		var conversation = [];

		$(document).ready(function() {
			$("#input").keypress(function(event) {
				var text = $(this).val();
				if (event.which == 13) {
					event.preventDefault();
					allConversation(text);
					setTimeout(send, 1000);
				}
			});
			$("#rec").click(function(event) {
				switchRecognition();
			});
			$('#chat-circle').click(function(){
				$('.introduction').addClass('hidden');
				$('.input_area').toggle( 1000 );
			});
		});

		var recognition;

		function startRecognition() {
			recognition = new webkitSpeechRecognition();
			recognition.onstart = function(event) {
				updateRec();
			};
			recognition.onresult = function(event) {
				var text = "";
			    for (var i = event.resultIndex; i < event.results.length; ++i) {
			    	text += event.results[i][0].transcript;
			    }
			    setInput(text);
				stopRecognition();
			};
			recognition.onend = function() {
				stopRecognition();
			};
			recognition.lang = "en-US";
			recognition.start();
		}

		function stopRecognition() {
			if (recognition) {
				recognition.stop();
				recognition = null;
			}
			updateRec();
		}

		function switchRecognition() {
			if (recognition) {
				stopRecognition();
			} else {
				startRecognition();
			}
		}

		function setInput(text) {
			$("#input").val(text);
			send();

		}

		function updateRec() {
			$("#rec").text(recognition ? "Stop" : ">");
		}


		function send() {
			var text = $("#input").val();
			$('#input').val('');

			$.ajax({
				type: "POST",
				url: baseUrl + "query?v=20150910",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + accessToken
				},
				data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
				success: function(data) {
					// setResponse(JSON.stringify(data, undefined, 2));
					allConversation(data.result.fulfillment.speech);
					//$("#response").text(data.result.fulfillment.speech);
				},
				error: function() {
					setResponse("Internal Server Error");
				}
			});
			setResponse("....");
		}

		function allConversation(convo){
			
			conversation.push(convo);
			$("#response").text(conversation.join('\n'));
		};

		function setResponse(val) {
			$("#response").text(val);
		}
