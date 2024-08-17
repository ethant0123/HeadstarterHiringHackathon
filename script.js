document.getElementById('send-btn').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    getBookRecommendation(userInput);
});

async function getBookRecommendation(query) {
    const chatBox = document.getElementById('chat-box');
    
    // Add user message to chat box
    const userMessage = document.createElement('div');
    userMessage.className = 'bg-blue-100 p-2 rounded-lg mb-2';
    userMessage.innerText = query;
    chatBox.appendChild(userMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Fetch book recommendation
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
        const data = await response.json();
        const book = data.items[0]; // Assuming the first result is the best match

        // Display book recommendation
        const bookTitle = book.volumeInfo.title;
        const bookIsbn = book.volumeInfo.industryIdentifiers.find(id => id.type === "ISBN_13" || id.type === "ISBN_10").identifier;
        
        const botMessage = document.createElement('div');
        botMessage.className = 'bg-green-100 p-2 rounded-lg mb-2';
        botMessage.innerHTML = `I recommend you read <strong>${bookTitle}</strong>!`;
        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Load the Embedded Viewer API
        google.books.load();

        // Initialize the Embedded Viewer API once it's loaded
        google.books.setOnLoadCallback(function() {
            const viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
            viewer.load(`ISBN:${bookIsbn}`, function(success) {
                if (!success) {
                    document.getElementById('viewerCanvas').innerText = 'Failed to load book preview.';
                }
            });
        });

    } catch (error) {
        const botMessage = document.createElement('div');
        botMessage.className = 'bg-red-100 p-2 rounded-lg mb-2';
        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
        console.error('Error fetching book recommendation:', error);
    }

    document.getElementById('user-input').value = ''; // Clear the input field
}
