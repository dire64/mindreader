function toggleChat() {
    var chatBox = document.getElementById('chat-box');
    var displayStatus = chatBox.style.display;
    
    if(displayStatus === 'none') {
      chatBox.style.display = 'block';
    } else {
      chatBox.style.display = 'none';
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

    fetch('http://127.0.0.1:5000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: message })
  })  
    .then(response => response.json())
    .then(data => {
      const botMessage = document.createElement('div');
      botMessage.classList.add('bot-message');
      botMessage.textContent = data.advice;
      chatBoxContent.appendChild(botMessage);
      chatBoxContent.scrollTop = chatBoxContent.scrollHeight; // Scroll to the bottom
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}