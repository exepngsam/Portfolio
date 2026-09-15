/*=============== CHATBOT LOGIC ===============*/
document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');

    // Toggle Chatbot Visibility
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.add('show-chatbot');
        chatbotToggle.style.transform = 'scale(0)';
    });

    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('show-chatbot');
        chatbotToggle.style.transform = 'scale(1)';
    });

    // Send Message
    const handleSend = () => {
        const text = chatbotInput.value.trim();
        if (!text) return;

        // Add user message to UI
        addMessage(text, 'user');
        chatbotInput.value = '';

        // Show loading
        const loadingId = addLoading();

        // Simulate network delay for "AI thinking"
        setTimeout(() => {
            removeLoading(loadingId);
            const aiResponse = getLocalAIResponse(text.toLowerCase());
            addMessage(aiResponse, 'ai');
        }, 800 + Math.random() * 1000); // 0.8s to 1.8s delay
    };

    // Advanced Rule-Based Local AI
    function getLocalAIResponse(input) {
        // Normalization
        input = input.replace(/[^\w\s]/gi, '').toLowerCase();

        // Greetings
        if (input.match(/\b(hi|hello|hey|greetings|sup)\b/)) {
            return "Hello there! I'm Soumyajit's local AI assistant. I can answer questions about his skills, projects, and background. What would you like to know?";
        } 
        
        // About Soumyajit
        else if (input.match(/\b(who is soumyajit|tell me about soumyajit|about him|who is he|background)\b/)) {
            return "Soumyajit Jena is a passionate developer, designer, and AI/ML enthusiast. He loves building intelligent systems, crafting beautiful user interfaces, and solving complex problems with code.";
        }
        
        // Skills / Tech Stack
        else if (input.match(/\b(skill|skills|tech|technologies|know|language|languages|stack)\b/)) {
            return "Soumyajit is highly skilled in **Python, Machine Learning, Data Science**, and frontend technologies like **HTML, CSS, and JavaScript**. He is always eager to learn new tools and frameworks!";
        } 
        
        // Projects / Portfolio
        else if (input.match(/\b(project|projects|work|portfolio|built|made)\b/)) {
            return "He has worked on several awesome projects involving AI, Machine Learning, and web development. You can check them out in the **Work** section above to see live demos and code repositories!";
        } 
        
        // Contact / Hire
        else if (input.match(/\b(contact|hire|email|reach|message|talk to him)\b/)) {
            return "You can reach out to him via the **Contact Form** at the bottom of the page! You can also connect with him on **LinkedIn** or check out his code on **GitHub**.";
        } 
        
        // About the AI itself
        else if (input.match(/\b(who are you|what are you|are you real|how do you work)\b/)) {
            return "I am a lightweight, purely local conversational bot built with JavaScript. I don't use any external APIs, which makes me super fast and privacy-friendly! My sole purpose is to guide you through this awesome portfolio.";
        } 
        
        // Jokes / Easter Eggs
        else if (input.match(/\b(joke|funny)\b/)) {
            return "Why do programmers prefer dark mode? Because light attracts bugs! 🐛";
        }

        // Fallback
        else {
            return "That's a great question! While I'm just a local bot and might not have the answer to everything, Soumyajit would love to chat with you about it. Feel free to use the contact form to reach out to him directly!";
        }
    }

    chatbotSend.addEventListener('click', handleSend);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });

    // Helper functions
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chatbot-message', sender);
        
        // Simple markdown parsing for bold and line breaks
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedText = formattedText.replace(/\n/g, '<br>');
        
        msgDiv.innerHTML = formattedText;
        chatbotMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function addLoading() {
        const id = 'loading-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chatbot-message', 'ai', 'loading');
        msgDiv.id = id;
        msgDiv.innerHTML = '<span></span><span></span><span></span>';
        chatbotMessages.appendChild(msgDiv);
        scrollToBottom();
        return id;
    }

    function removeLoading(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});
