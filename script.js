//Load Messages

function getMessages() {
  const MessagePromise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  MessagePromise.then(loadMessages);
}

setInterval(getMessages, 3000);

function loadMessages(Response){
    //Selects the list containing the messages:
    let ChatBox = document.querySelector('.chat ul')
    //Variable for running through the data contained in the promise according to their index:
    let SelectedIndex = 0;

    //Adds the messages in the chat:
    while (SelectedIndex < Response.data.length){

        //Selects the type of the message:
        let MessageType = Response.data[SelectedIndex].type;
        //Selects the time of the message:
        let MessageTime = Response.data[SelectedIndex].time;
        //Selects the sender:
        let MessageSender = Response.data[SelectedIndex].from;
        //Selects the receiver:
        let MessageReceiver = Response.data[SelectedIndex].to;
        //Selects the text:
        let MessageText = Response.data[SelectedIndex].text;


        //Adds the 'li' elements inside the list according to their type:
        if (MessageType == 'status'){
            ChatBox.innerHTML += `
                <li class="status">
                    <h1>
                        <span>(${MessageTime})</span> <strong>${MessageSender}</strong> ${MessageText}
                    </h1>
                </li>`
        }else if (MessageType == 'message'){
            ChatBox.innerHTML += `
                <li class="message">
                    <h1>
                        <span>(${MessageTime})</span> <strong>${MessageSender}</strong> para <strong>${MessageReceiver}</strong>: ${MessageText}
                    </h1>
                </li>`
        }else if (MessageType == 'private_message'){
            ChatBox.innerHTML += `
                <li class="private-message">
                    <h1>
                        <span>(${MessageTime})</span> <strong>${MessageSender}</strong> reservadamente para <strong>${MessageReceiver}</strong>: ${MessageText}
                    </h1>
                </li>`
        }

        SelectedIndex++
    }
    
    //Scrolls to the bottom automatically:
    window.scrollTo(0, document.body.scrollHeight);

}
