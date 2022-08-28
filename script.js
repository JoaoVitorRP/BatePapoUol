//Login

let Username;
let ServerUsername;
let LoadingScreen;

function checkUsername() {
  LoadingScreen = document.querySelector(".loading");

  LoadingScreen.classList.remove("hidden");

  const InputBox = document.querySelector("input");

  Username = InputBox.value;

  //Sets the username in the server form:
  ServerUsername = { name: Username };

  const UsernamePost = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    ServerUsername
  );

  UsernamePost.then(() => {
    const LoginScreen = document.querySelector(".login");

    LoginScreen.classList.add("hidden");

    LoadingScreen.classList.add("hidden");

    getMessages();

    updateSite();
  });

  UsernamePost.catch(() => {
    LoadingScreen.classList.add("hidden");

    const ErrorText = document.querySelector("h2");

    if (Username !== "") {
      ErrorText.innerHTML = "Já há um usuário online com este nome";
    } else if (Username === "") {
      ErrorText.innerHTML = "O campo não pode estar vazio";
    }
  });
}

//Update Messages
function updateSite() {
  setInterval(getMessages, 3000);

  setInterval(updateStatus, 5000);
}

//Update Status
function updateStatus() {
  axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    ServerUsername
  );
}

//Load Messages
function getMessages() {
  const MessagePromise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );

  MessagePromise.then(loadMessages);
}

function loadMessages(Response) {
  //Variable for running through the data contained in the promise according to their index:
  let SelectedIndex = 0;

  let ChatBox = document.querySelector(".chat ul");

  ChatBox.innerHTML = ``;

  //Adds the messages in the chat:
  while (SelectedIndex < Response.data.length) {
    const MessageType = Response.data[SelectedIndex].type;

    const MessageTime = Response.data[SelectedIndex].time;

    const MessageSender = Response.data[SelectedIndex].from;

    const MessageReceiver = Response.data[SelectedIndex].to;

    const MessageText = Response.data[SelectedIndex].text;

    //Text that goes after the sender:
    let AfterSender = ``;

    if (MessageType === "status") {
      AfterSender = `${MessageText}`;
    } else if (MessageType === "message") {
      AfterSender = `para <strong>${MessageReceiver}</strong>: ${MessageText}`;
    } else if (
      MessageType == "private_message" &&
      MessageReceiver === Username
    ) {
      AfterSender = `reservadamente para <strong>${MessageReceiver}</strong>: ${MessageText}`;
    }

    //Updates the chat with the new messages only if they are not private or private meant for the user:
    if (
      MessageType !== "private_message" ||
      (MessageType === "private_message" && MessageReceiver === Username)
    ) {
      ChatBox.innerHTML += `
            <li class="${MessageType}">
                <h1>
                    <span>(${MessageTime})</span> <strong>${MessageSender}</strong> ${AfterSender}
                </h1>
            </li>`;
    }

    SelectedIndex++;
  }

  window.scrollTo(0, document.body.scrollHeight);
}

//Send Message
document.querySelector('.menu input').onkeydown = function(event) {
  if (event.key === 'Enter'){
    sendMessage();
  }
};

function sendMessage() {
  const Input = document.querySelector(".menu input");

  const Message = {
    from: Username,
    to: "Todos",
    text: Input.value,
    type: "message",
  };

  const MessagePost = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    Message
  );

  MessagePost.then(getMessages);
  MessagePost.then((Input.value = ""));

  MessagePost.catch(() => window.location.reload());
}