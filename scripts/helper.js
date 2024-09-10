function toggleChat() {
    var chatBox = document.getElementById('chat-box');
    var chatButton = document.getElementById('chat-button');
    var displayStatus = chatBox.style.display;
    
    if(displayStatus === 'none') {
      chatBox.style.display = 'block';
      chatButton.style.display = 'none';
    } else {
      chatBox.style.display = 'none';
      chatButton.style.display = 'inline';
    }
  }

  function sendMessage() {
  const userInput = document.getElementById('user-input');
  const message = userInput.value.trim();

  if (message !== '') {
    const chatBoxContent = document.getElementById('chat-box-content');
    const userMessage = document.createElement('div');
    userMessage.classList.add('user-message');
    userMessage.textContent = message;
    chatBoxContent.appendChild(userMessage);
    chatBoxContent.scrollTop = chatBoxContent.scrollHeight; // Scroll to the bottom

    userInput.value = '';

    fetch('http://localhost:8000/chat/invoke', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "input": {
          "message": message
        },
        "config": {},
        "kwargs": {}
      })
  })  
    .then(response => response.json())
    .then(data => {
      const botMessage = document.createElement('div');
      botMessage.classList.add('bot-message');
      botMessage.textContent = data.output.content;
      chatBoxContent.appendChild(botMessage);
      chatBoxContent.scrollTop = chatBoxContent.scrollHeight; // Scroll to the bottom
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}
