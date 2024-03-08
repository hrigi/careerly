/*
====== Websocket implementation ======
const systemWebSocketConnection = new WebSocket("wss://url", "messageCommandMode");
const msg = {
    type: "message",
    text: msg,
    cli_id: systemVariables.client_id
};
systemWebSocketConnection.send(JSON.stringify(msg));
systemWebSocketConnection.onmessage = (event) => {
    console.log(event.data);
}
*/

class SystemVariables {
    constructor() {
        this.name = null;
        this.client_id = this.makeID();
        this.chatHeight = $(".chatArea").height();
        this.conversations = [];
        this.systemLogs = [];
        this.courses = [];
        this.course = null;
    }

    makeID() {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 15; i++)
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    }
}

class ChatBot { 
    constructor() {
        this.systemVariables = new SystemVariables();
        this.inputMode();
        this.initialiseChatBotBackgroundServices();
    }

    initialiseChatBotBackgroundServices = () => {
        this.windowResize();
        window.addEventListener('resize', this.windowResize);
        document.querySelector(".more").addEventListener("click", () => {
            document.querySelector(".more_onScreen").classList.remove("hidden");
            document.querySelector(".more_container").classList.remove("hidden");
        });

        document.querySelector(".option").addEventListener("click", (e) => {
            switch (e.currentTarget.getAttribute("data-rel")) {
                case "close_more":
                    this.systemVariables.systemLogs.push("More Menu Closed");
                    document.querySelector(".more_onScreen").classList.add("hidden");
                    document.querySelector(".more_container").classList.add("hidden");
                    break;
                case "dwn":
                    var doc = new jsPDF();
                    var elementHTML = `<h1>Chatbot - Conversation History</h1><br><h3>Export on ${new Date().toLocaleDateString()}</h3><br>`;
                    this.systemVariables.conversations.forEach(element => {
                        elementHTML += `<b>${(element[0] == "Bot") ? 'Bot' : this.systemVariables.name}</b>: ${element[1]}<br>`;
                    });
                    doc.fromHTML(elementHTML, 15, 15);
                    doc.save(`nuvie.in - Conversation on ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()} at ${new Date().getHours()}:${new Date().getMinutes()}.pdf`);
                default:
                    break;
            }
        });
    }

    greetingsGenerator = () => {
        let greet = "";
        if (new Date().getHours() < 12) {
            greet = "Morning";
        }
        else if (new Date().getHours() < 15) {
            greet = "Afternoon";
        }
        else {
            greet = "Evening";
        }
        const messages = [`Hey there, ${this.systemVariables.name}`, `Good ${greet}, ${this.systemVariables.name}`, `Hello ${this.systemVariables.name}`];
        return messages[parseInt((Math.random() * 100).toFixed()) % messages.length];
    };

    windowResize = () => {
        ($(window).width() < 720) ? $(".chatArea").height(this.systemVariables.chatHeight - $(".messagePanel").height() - 1) : $(".chatArea").height(this.systemVariables.chatHeight);
    };

    messagePanel = (panelData) => {
        let id = [this.systemVariables.makeID()];
        document.querySelector(".messagePanel").innerHTML = `<div class="inputPanel" id="${id[0]}"></div>`;
        panelData.forEach((elem) => {
            id.push(this.systemVariables.makeID());
            document.querySelector(".inputPanel").innerHTML += `<button class="selectableItem" id="${id[id.length - 1]}" value="${elem}">${elem}</button>`;
        });
        this.systemVariables.systemLogs.push("Message panel created");
        $(".selectableItem").off().on('click', (e) => {
            document.querySelector("#chat-window").innerHTML += `<div class="headsupmsg"><span>You selected ${e.currentTarget.getAttribute("value")}</span></div>`;
            this.systemVariables.systemLogs.push(`${$(e.currentTarget).prop("value")} selected`);
            this.networkListener($(e.currentTarget).prop("value"), false);
        });
        return id;
    }

    commentAppender = (msg, isBot) => {
        let timer = 0;
        const appendComment = (msg, isBot) => {
            this.systemVariables.conversations.push([`${(isBot) ? "Bot" : this.systemVariables.name}`, msg]);
            this.systemVariables.systemLogs.push(["Comment Input Detected", msg, `Message Creator: ${(isBot) ? "Bot" : "User"}`]);
            const msgTemplate = `<div class="comment ${(isBot) ? 'bot' : 'me'}"><p class="bubble">${msg}</p></div>`;
            $("#chat-window").append(msgTemplate);
            document.querySelector(".chatArea").scrollTo(0, document.querySelector(".chatArea").scrollHeight);
        };

        try {
            msg.forEach((element) => {
                setTimeout(() => { appendComment(element, isBot); }, timer);
                timer += 300;
            });
        }
        catch {
            appendComment(msg, isBot);
        }
    }

    inputMode = (disable = false) => {
        this.systemVariables.systemLogs.push("Input Mode Selected");
        if (disable) {
            document.querySelector(".messagePanel").innerHTML = `<div class="textBasedInput"><input type="text" autocomplete='off' spellcheck='false' autocorrect='off' id="textInput" placeholder="Conversation Closed by user" disabled></div>`;
            return
        }
        document.querySelector(".messagePanel").innerHTML = `<div class="textBasedInput"><input type="text" autocomplete='off' spellcheck='false' autocorrect='off' id="textInput" placeholder="Type your message"><button class="btnSend">Send</button></div>`;
        document.querySelector(".btnSend").removeEventListener("click", this.userSend);
        document.querySelector(".btnSend").addEventListener("click", this.userSend);
        document.removeEventListener("keypress", (e) => {});
        document.addEventListener('keypress', (e) => {
            if (e.key == "Enter" && document.querySelector("#textInput").value != "") {
                const msg = $('#textInput').prop('value');
                if (msg != "")
                    this.commentAppender(msg, false);
                this.networkListener(msg, true);
                $('#textInput').prop({ 'value': '' });
            }
        });
    }

    networkListener(e, isMsg) {
        const msgMode = (isMsg) ? "message" : "value";
        this.systemVariables.systemLogs.push(["Network activity initiated", `${isMsg} mode selected`, "Awaiting result"]);
        $("#chat-window").append(`<span class="comment bot loaderType"><p class="bubble"><svg class="Chat-dots" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g class="Chat-dots"><circle class="Chat-dot1" cx="1" cy="20" r="3"></circle><circle class="Chat-dot2" cx="12" cy="20" r="3"></circle><circle class="Chat-dot3" cx="24" cy="20" r="3"></circle></g></svg></p></span>`);;
        this.callback(this.question, {type: msgMode, text: e});
    }

    requestInformation = (question, {type, responses}) => {
        setTimeout(() => { $(".loaderType").remove(); }, 200);
        this.question = question;
        if (type === "message") {
            this.commentAppender(question, true);
            this.inputMode(false);
        } else {
            this.commentAppender(question, true);
            this.messagePanel(responses);
        }
    }

    listener = (callback) => {
        this.callback = callback;
    }

    updateUserProfile = (name) => {
        this.systemVariables.name = name;
        this.commentAppender(this.greetingsGenerator(), true);
    }

    endSession = () => {
        setTimeout(() => { $(".loaderType").remove(); }, 200);
        this.commentAppender("Hope I helped!", true);
        this.inputMode(true);
    }

    sendUpdate = (msg) => {
        setTimeout(() => { $(".loaderType").remove(); }, 200);
        this.commentAppender(msg, true);
    }
}

const urlParams = new URLSearchParams(window.location.search);
const courses = urlParams.get('courses');
const course = courses.split(",");

chatbot = new ChatBot();
chatbot.requestInformation("What is your name?", {type: "message", responses: []});

chatbot.listener((question, response) => {
    const bestColleges = () => {
        chatbot.sendUpdate("Alright! I can help you with that. Please wait for a moment.");
        chatbot.requestInformation("Please choose a course to find college", {type: "options", responses: course});
    }

    const basicRequirements = () => {   
        chatbot.sendUpdate("Alright! I can help you with that. Please wait for a moment.");
        chatbot.requestInformation("Please choose a course", {type: "options", responses: course});
    }

    if (course.includes(response.text)) {
        if (question === "Please choose a course to find college") {
            chatbot.sendUpdate(`Alright! I can help you with finding a college for ${response.text}. Please wait for a moment.`);
            chatbot.requestInformation("Please wait for a moment.", {type: "message", responses: []});
        } else {
            chatbot.sendUpdate(`Alright! I can help you with the basic requirements for ${response.text}. Please wait for a moment.`);
            chatbot.requestInformation("Please wait for a moment.", {type: "message", responses: []});
        }
        return;
    }

    switch (question) {
        case "What is your name?":
            chatbot.updateUserProfile(response.text);
            chatbot.requestInformation("Do you have any queries?", {type: "options", responses: ["I want to learn", "No. I'm good!"]});
            break;
        case "Do you have any queries?":
            if (response.text === "I want to learn") {
                chatbot.requestInformation("What do you want to learn?", {type: "options", responses: ["Suggest best colleges in the country", "Understand basic requirements for the course", "Exit Chat"]});
            } else {
                chatbot.endSession();
            } 
            break;
        case "What do you want to learn?":
            switch (response.text) {
                case "Suggest best colleges in the country":
                    bestColleges();
                    break;
                case "Understand basic requirements for the course":
                    basicRequirements();
                    break;
                case "Exit Chat":
                    chatbot.endSession();
                    break;
                default:
                    chatbot.sendUpdate("I'm sorry, But I can't help you with that!");
                    chatbot.requestInformation("Do you have any queries?", {type: "options", responses: ["I want to learn", "No. I'm good!"]});
            }
            break;
        default:
            chatbot.sendUpdate("I'm sorry, But I can't help you with that!");
            chatbot.requestInformation("Do you have any queries?", {type: "options", responses: ["I want to learn", "No. I'm good!"]});
    }
})
