//Login

let Username;
let ServerUsername;

function checkUsername() {
  //Selects the input box:
  const InputBox = document.querySelector("input");

  //Selects the username inside the box:
  Username = InputBox.value;

  //Sets the username in the server form:
  ServerUsername = { name: Username };

  //Sends the username to the participants server:
  const UsernamePost = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    ServerUsername
  );

  //If success:
  UsernamePost.then(startChat);

  //If fail:
  UsernamePost.catch(errorCodes);
}

//Starts the chat
function startChat() {
  //Selects the LoginScreen and hides it:
  const LoginScreen = document.querySelector(".login");
  LoginScreen.classList.add("hidden");

  //Proceeds to load messages:
  getMessages();

  //Starts the update interval:
  updateSite();
}

//Update Messages
function updateSite() {
  //Repeats this function every 3s to keep the chat updated:
  setInterval(getMessages, 3000);

  //Repeats this function every 5s to keep the user logged in:
  setInterval(updateStatus, 5000);
}

//Update Status
function updateStatus() {
  //Posts the username on the status server:
  axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    ServerUsername
  );
}

//Load Messages
function getMessages() {
  //Sends a request to get the messages from the server:
  const MessagePromise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );

  //If successful:
  MessagePromise.then(loadMessages);
}

function loadMessages(Response) {
  //Variable for running through the data contained in the promise according to their index:
  let SelectedIndex = 0;

  //Selects the list containing the messages:
  let ChatBox = document.querySelector(".chat ul");

  //Clears the chat so it doesn't overaccumulate messages when updated:
  ChatBox.innerHTML = ``;

  //Adds the messages in the chat:
  while (SelectedIndex < Response.data.length) {
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
    if (MessageType == "status") {
      AfterSender = `${MessageText}`;
    } else if (MessageType == "message") {
      AfterSender = `para <strong>${MessageReceiver}</strong>: ${MessageText}`;
    } else if (MessageType == "private_message") {
      AfterSender = `reservadamente para <strong>${MessageReceiver}</strong>: ${MessageText}`;
    }

    //Updates the chat with the new messages:
    ChatBox.innerHTML += `
            <li class="${MessageType}">
                <h1>
                    <span>(${MessageTime})</span> <strong>${MessageSender}</strong> ${AfterSender}
                </h1>
            </li>`;

    SelectedIndex++;
  }

  //Scrolls to the bottom automatically:
  window.scrollTo(0, document.body.scrollHeight);
}

//Send Message
function sendMessage() {
  //Selects the textarea and the text inside of it:
  const TextArea = document.querySelector("textarea");

  //Creates a message element in the server form:
  const Message = {
    from: Username,
    to: "Todos",
    text: TextArea.value,
    type: "message",
  };

  //Sends the message to the server:
  const MessagePost = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    Message
  );

  //If success it executes the 'getMessages' function and clears the textarea:
  MessagePost.then(getMessages);
  MessagePost.then((TextArea.value = ""));

  //If fail:
  MessagePost.catch(reloadPage);
}

//Reloads the page:
function reloadPage() {
  window.location.reload();
}

//Error Codes
function errorCodes(error) {
  //Receives the error object and selects the error status code:
  const errorCode = error.response.status;

  if (errorCode === 400) {
    //Selects the h2 from the login div and updates its innerHMTL to reflect the error given:
    const ErrorText = document.querySelector("h2");
    ErrorText.innerHTML = "Já há um usuário online com este nome";
  }
}
