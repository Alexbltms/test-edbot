/**
 * Chat Widget Bundle - Vanilla JavaScript
 * Ce script crée un widget de chat injectable dans n'importe quelle page
 */
(function() {
  'use strict';

  // Configuration du widget
  const CONFIG = {
    buttonSize: '60px',
    buttonColor: '#0066CC',
    buttonHoverColor: '#0052A3',
    chatWidth: '380px',
    chatHeight: '600px',
    zIndex: 9999
  };

  // Styles CSS du widget
  const styles = `
    /* Bouton de chat flottant */
    .chat-widget-button {
      position: fixed
      ;
      bottom: 20px;
      right: 20px;
      width: ${CONFIG.buttonSize};
      height: ${CONFIG.buttonSize};
      border-radius: 50%;
      background-color: ${CONFIG.buttonColor};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: ${CONFIG.zIndex};
    }

    .chat-widget-button:hover {
      background-color: ${CONFIG.buttonHoverColor};
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      transform: scale(1.05);
    }

    .chat-widget-button svg {
      width: 28px;
      height: 28px;
      fill: white;
    }

    /* Badge de notification */
    .chat-widget-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: #FF4444;
      color: white;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      font-family: Arial, sans-serif;
    }

    /* Fenêtre de chat */
    .chat-widget-window {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: ${CONFIG.chatWidth};
      height: ${CONFIG.chatHeight};
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: ${CONFIG.zIndex};
      transition: all 0.3s ease;
    }

    .chat-widget-window.open {
      display: flex;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* En-tête du chat */
    .chat-widget-header {
      background-color: ${CONFIG.buttonColor};
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: Arial, sans-serif;
    }

    .chat-widget-header-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .chat-widget-header-status {
      font-size: 12px;
      opacity: 0.9;
      margin: 4px 0 0 0;
    }

    .chat-widget-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 24px;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s;
    }

    .chat-widget-close:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    /* Corps du chat - Messages */
    .chat-widget-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background-color: #F5F5F5;
      font-family: Arial, sans-serif;
    }

    .chat-message {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
    }

    .chat-message.user {
      align-items: flex-end;
    }

    .chat-message.bot {
      align-items: flex-start;
    }

    .chat-message-bubble {
      max-width: 75%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .chat-message.user .chat-message-bubble {
      background-color: ${CONFIG.buttonColor};
      color: white;
      border-bottom-right-radius: 4px;
    }

    .chat-message.bot .chat-message-bubble {
      background-color: white;
      color: #333;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .chat-message-time {
      font-size: 11px;
      color: #999;
      margin-top: 4px;
      padding: 0 4px;
    }

    /* Indicateur de saisie */
    .chat-typing-indicator {
      display: none;
      align-items: center;
      padding: 12px 16px;
      background-color: white;
      border-radius: 18px;
      max-width: 60px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .chat-typing-indicator.active {
      display: flex;
    }

    .chat-typing-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #999;
      margin: 0 2px;
      animation: typing 1.4s infinite;
    }

    .chat-typing-dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .chat-typing-dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.7;
      }
      30% {
        transform: translateY(-10px);
        opacity: 1;
      }
    }

    /* Zone de saisie */
    .chat-widget-input-area {
      padding: 16px;
      background-color: white;
      border-top: 1px solid #E0E0E0;
      display: flex;
      gap: 10px;
    }

    .chat-widget-input {
      flex: 1;
      border: 1px solid #DDD;
      border-radius: 24px;
      padding: 12px 16px;
      font-size: 14px;
      font-family: Arial, sans-serif;
      outline: none;
      transition: border-color 0.2s;
    }

    .chat-widget-input:focus {
      border-color: ${CONFIG.buttonColor};
    }

    .chat-widget-send {
      background-color: ${CONFIG.buttonColor};
      border: none;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .chat-widget-send:hover {
      background-color: ${CONFIG.buttonHoverColor};
    }

    .chat-widget-send:disabled {
      background-color: #CCC;
      cursor: not-allowed;
    }

    .chat-widget-send svg {
      width: 20px;
      height: 20px;
      fill: white;
    }

    /* Scrollbar personnalisée */
    .chat-widget-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-widget-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .chat-widget-messages::-webkit-scrollbar-thumb {
      background: #CCC;
      border-radius: 3px;
    }

    .chat-widget-messages::-webkit-scrollbar-thumb:hover {
      background: #999;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .chat-widget-window {
        width: calc(100vw - 20px);
        height: calc(100vh - 120px);
        right: 10px;
        bottom: 90px;
      }

      .chat-widget-button {
        right: 10px;
        bottom: 10px;
      }
    }
  `;

  // Classe principale du widget
  class ChatWidget {
    constructor() {
      this.isOpen = false;
      this.messages = [];
      this.init();
    }

    init() {
      // Injecter les styles
      this.injectStyles();
      
      // Créer les éléments DOM
      this.createButton();
      this.createChatWindow();
      
      // Ajouter un message de bienvenue
      this.addBotMessage("Bonjour ! Comment puis-je vous aider aujourd'hui ?");
    }

    injectStyles() {
      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
    }

    createButton() {
      const button = document.createElement('button');
      button.className = 'chat-widget-button';
      button.setAttribute('aria-label', 'Ouvrir le chat');
      button.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          <circle cx="12" cy="11" r="1"/>
          <circle cx="8" cy="11" r="1"/>
          <circle cx="16" cy="11" r="1"/>
        </svg>
      `;
      
      button.addEventListener('click', () => this.toggleChat());
      
      document.body.appendChild(button);
      this.buttonElement = button;
    }

    createChatWindow() {
      const chatWindow = document.createElement('div');
      chatWindow.className = 'chat-widget-window';
      
      chatWindow.innerHTML = `
        <div class="chat-widget-header">
          <div>
            <div class="chat-widget-header-title">Assistant Chat</div>
            <div class="chat-widget-header-status">En ligne</div>
          </div>
          <button class="chat-widget-close" aria-label="Fermer le chat">×</button>
        </div>
        
        <div class="chat-widget-messages">
          <div class="chat-typing-indicator">
            <div class="chat-typing-dot"></div>
            <div class="chat-typing-dot"></div>
            <div class="chat-typing-dot"></div>
          </div>
        </div>
        
        <div class="chat-widget-input-area">
          <input 
            type="text" 
            class="chat-widget-input" 
            placeholder="Écrivez votre message..."
            aria-label="Message"
          />
          <button class="chat-widget-send" aria-label="Envoyer">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      `;
      
      document.body.appendChild(chatWindow);
      this.chatWindow = chatWindow;
      
      // Récupérer les éléments
      this.messagesContainer = chatWindow.querySelector('.chat-widget-messages');
      this.inputField = chatWindow.querySelector('.chat-widget-input');
      this.sendButton = chatWindow.querySelector('.chat-widget-send');
      this.closeButton = chatWindow.querySelector('.chat-widget-close');
      this.typingIndicator = chatWindow.querySelector('.chat-typing-indicator');
      
      // Ajouter les événements
      this.closeButton.addEventListener('click', () => this.toggleChat());
      this.sendButton.addEventListener('click', () => this.sendMessage());
      this.inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }

    toggleChat() {
      this.isOpen = !this.isOpen;
      
      if (this.isOpen) {
        this.chatWindow.classList.add('open');
        this.inputField.focus();
      } else {
        this.chatWindow.classList.remove('open');
      }
    }

    sendMessage() {
      const text = this.inputField.value.trim();
      
      if (!text) return;
      
      // Ajouter le message de l'utilisateur
      this.addUserMessage(text);
      
      // Vider le champ de saisie
      this.inputField.value = '';
      
      // Simuler une réponse du bot
      this.showTypingIndicator();
      
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addBotMessage(this.generateBotResponse(text));
      }, 1000 + Math.random() * 1000);
    }

    addUserMessage(text) {
      this.addMessage(text, 'user');
    }

    addBotMessage(text) {
      this.addMessage(text, 'bot');
    }

    addMessage(text, sender) {
      const messageElement = document.createElement('div');
      messageElement.className = `chat-message ${sender}`;
      
      const now = new Date();
      const time = now.getHours().toString().padStart(2, '0') + ':' + 
                   now.getMinutes().toString().padStart(2, '0');
      
      messageElement.innerHTML = `
        <div class="chat-message-bubble">${this.escapeHtml(text)}</div>
        <div class="chat-message-time">${time}</div>
      `;
      
      // Insérer avant l'indicateur de saisie
      this.messagesContainer.insertBefore(messageElement, this.typingIndicator);
      
      // Scroller vers le bas
      this.scrollToBottom();
      
      // Sauvegarder le message
      this.messages.push({ text, sender, time });
    }

    showTypingIndicator() {
      this.typingIndicator.classList.add('active');
      this.scrollToBottom();
    }

    hideTypingIndicator() {
      this.typingIndicator.classList.remove('active');
    }

    scrollToBottom() {
      setTimeout(() => {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }, 100);
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    generateBotResponse(userMessage) {
      // Réponses automatiques simples (à remplacer par une vraie API)
      const responses = [
        "Je comprends votre question. Pouvez-vous me donner plus de détails ?",
        "C'est une bonne question ! Laissez-moi vous aider.",
        "Merci pour votre message. Je vais faire de mon mieux pour vous assister.",
        "Intéressant ! Pouvez-vous préciser votre demande ?",
        "Je suis là pour vous aider. Que puis-je faire pour vous ?"
      ];
      
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut')) {
        return "Bonjour ! Ravi de vous parler. Comment puis-je vous aider ?";
      }
      
      if (lowerMessage.includes('merci')) {
        return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.";
      }
      
      if (lowerMessage.includes('aide') || lowerMessage.includes('help')) {
        return "Bien sûr, je suis là pour vous aider. Posez-moi vos questions !";
      }
      
      // Réponse aléatoire par défaut
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Initialiser le widget quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.chatWidget = new ChatWidget();
    });
  } else {
    window.chatWidget = new ChatWidget();
  }

})();
