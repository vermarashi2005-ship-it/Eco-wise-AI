const WEBHOOK_URL = "https://rv5.app.n8n.cloud/webhook/3d12e474-a7cf-4b30-9372-7e0e6174eb27/chat";

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const button = document.querySelector("button");

function addMessage(type, message) {

    chatBox.innerHTML += `
        <div class="${type}">
            ${message}
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {

    const message = input.value.trim();

    if (message === "") return;

    addMessage("user", message);

    input.value = "";

    button.disabled = true;
    button.innerHTML = "⏳ Searching...";

    chatBox.innerHTML += `
        <div class="bot" id="loading">

            <div class="loading">

                🌿 EcoWise AI is searching...

            </div>

            <br>

            Finding the best eco-friendly products for you...

        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "sendMessage",
                chatInput: message
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

        addMessage(
            "bot",
            reply.replace(/\n/g, "<br>")
        );

    }

    catch (error) {

        document.getElementById("loading").remove();

        addMessage(
            "bot",
            `
            ⚠️ <b>Unable to connect to EcoWise AI.</b>

            <br><br>

            Please check your internet connection and try again.
            `
        );

    }

    finally {

        button.disabled = false;
        button.innerHTML = "🔍 Search";

        chatBox.scrollTop = chatBox.scrollHeight;

    }

}

input.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        sendMessage();

    }

});
