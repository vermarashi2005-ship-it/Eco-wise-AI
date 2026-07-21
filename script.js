const WEBHOOK_URL = "https://rv5.app.n8n.cloud/webhook/3d12e474-a7cf-4b30-9372-7e0e6174eb27/chat";

const chatBox = document.getElementById("chatBox");

async function sendMessage() {

    const input = document.getElementById("userInput");

    const message = input.value.trim();

    if(message === "") return;

    chatBox.innerHTML += `
        <div class="user">${message}</div>
    `;

    input.value = "";

    chatBox.innerHTML += `
        <div class="bot" id="loading">
            <div class="loading"></div>
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    try{

        const response = await fetch(WEBHOOK_URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                action:"sendMessage",
                chatInput:message
            })
        });

        const data = await response.json();

        document.getElementById("loading").remove();

        const reply =
            data.output ||
            data.response ||
            data.text ||
            data.message ||
            "No response received.";

        chatBox.innerHTML += `
            <div class="bot">${reply.replace(/\n/g,"<br>")}</div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;

    }

    catch(error){

        document.getElementById("loading").remove();

        chatBox.innerHTML += `
            <div class="bot">
                ❌ Unable to connect to EcoWise AI.
            </div>
        `;

    }

}

document.getElementById("userInput")
.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        sendMessage();

    }

});
