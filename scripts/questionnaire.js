function toggleChat() {
    var chatBox = document.getElementById('chat-box');
    var displayStatus = chatBox.style.display;
    
    if(displayStatus === 'none') {
      chatBox.style.display = 'block';
    } else {
      chatBox.style.display = 'none';
    }
  }