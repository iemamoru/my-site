const chatBoard = document.getElementById("chatBoard");

async function loadMessages() {
    const response = await axios.get('/open-chat/messages');
    const messages = response.data;

    chatBoard.innerHTML = '';
    messages.forEach(msg => {
        const quoted = msg.quoted_content ? `<blockquote>${msg.quoted_content}</blockquote>` : "";
        const reactions = Object.values(msg.reactions || {}).reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {});
        const reactionDisplay = Object.entries(reactions).map(([key, value]) => `${key}: ${value}`).join(", ");

        chatBoard.innerHTML += `
            <div class="card my-3">
                <div class="card-body">
                    <h5 class="card-title">${msg.username}</h5>
                    ${quoted}
                    <p class="card-text" style="color: ${msg.text_color}; font-size: ${msg.text_size};">${msg.content}</p>
                    <small>${new Date(msg.timestamp).toLocaleString()}</small>
                    <div>
                        <button class="btn btn-sm btn-outline-primary" onclick="quoteMessage('${msg.content}')">Quote</button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="reactToMessage('${msg.id}', '👍')">👍</button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="reactToMessage('${msg.id}', '❤️')">❤️</button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="reactToMessage('${msg.id}', '😂')">😂</button>
                        <p>Reactions: ${reactionDisplay}</p>
                    </div>
                </div>
            </div>
        `;
    });
}

async function postMessage() {
    const username = document.getElementById("username").value || "Anonymous";
    const content = document.getElementById("content").value;
    const textColor = document.getElementById("text_color").value;
    const textSize = document.getElementById("text_size").value;
    const quotedContent = document.getElementById("quoted_content").value;

    await axios.post('/open-chat/post', { username, content, text_color: textColor, text_size: textSize, quoted_content: quotedContent });
    loadMessages();
}

function quoteMessage(content) {
    document.getElementById("quoted_content").value = `> ${content}`;
}

async function reactToMessage(id, reaction) {
    await axios.post(`/open-chat/react/${id}`, { reaction });
    loadMessages();
}

document.getElementById("postForm").addEventListener("submit", (e) => {
    e.preventDefault();
    postMessage();
});

loadMessages();
