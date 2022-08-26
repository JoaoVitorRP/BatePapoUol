//Login

function checkUsername(){

    //Selects the input box:
    const InputBox = document.querySelector('input');

    //Selects the username inside the box and sets it in the server form:
    const Username = {"name": InputBox.value};

    //Sends the username to the server:
    const UsernamePost = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", Username);

    //If success:
    UsernamePost.then(startChat);

    //If fail:
    UsernamePost.catch(errorCodes);

}

function startChat(){

    //Selects the LoginScreen and hides it:
    const LoginScreen = document.querySelector('.login');
    LoginScreen.classList.add('hidden');

    //Continues to load messages:
    getMessages();

    //Starts the update interval:
    interval();

}

//Load Messages
function getMessages() {

    //Sends a request to get the messages from the server:
  const MessagePromise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

  //If successful:
  MessagePromise.then(loadMessages);
  
}

function interval(){
    //Repeats this function every 3s to keep the chat updated:
    setInterval(getMessages, 3000);
}

function loadMessages(Response){

    //Variable for running through the data contained in the promise according to their index:
    let SelectedIndex = 0;

    //Selects the list containing the messages:
    let ChatBox = document.querySelector('.chat ul')

    //Clears the chat so it doesn't overaccumulate messages when updated:
    ChatBox.innerHTML = ``;

    //Adds the messages in the chat:
    while (SelectedIndex < Response.data.length){

        //Selects the type of the message:
        const MessageType = Response.data[SelectedIndex].type;

        //Selects the time of the message:
        const MessageTime = Response.data[SelectedIndex].time;

        //Selects the sender:
        const MessageSender = Response.data[SelectedIndex].from;

        //Selects the receiver:
        const MessageReceiver = Response.data[SelectedIndex].to;

        //Selects the text:
        const MessageText = Response.data[SelectedIndex].text;

        //Text that goes after the sender:
        let AfterSender = ``;

        //Adds the 'li' elements inside the list according to their type:
        if (MessageType == 'status'){

            AfterSender = `${MessageText}`

        }else if (MessageType == 'message'){

            AfterSender = `para <strong>${MessageReceiver}</strong>: ${MessageText}`

        }else if (MessageType == 'private_message'){

            AfterSender = `reservadamente para <strong>${MessageReceiver}</strong>: ${MessageText}`

        }

        //Updates the chat with the new messages:
        ChatBox.innerHTML += `
            <li class="${MessageType}">
                <h1>
                    <span>(${MessageTime})</span> <strong>${MessageSender}</strong> ${AfterSender}
                </h1>
            </li>`

        SelectedIndex++
    }
    
    //Scrolls to the bottom automatically:
    window.scrollTo(0, document.body.scrollHeight);

}

//Error Codes:

function errorCodes(error){
    const errorCode = error.response.status;
    if (errorCode === 400){
        const ErrorText = document.querySelector('h2');
        ErrorText.innerHTML = 'Já há um usuário online com este nome';
    }
}