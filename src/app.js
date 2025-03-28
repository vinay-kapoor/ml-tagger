// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    const tagButton = document.getElementById('tagButton');
    const articleInput = document.getElementById('articleInput');
    const tagsOutput = document.getElementById('tagsOutput');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsSection = document.getElementById('resultsSection');
    const errorMessage = document.getElementById('errorMessage');

    console.log('🖥️ ML Tagger client initialized');
    tagButton.addEventListener('click', tagArticle);

    async function tagArticle() {
        const articleText = articleInput.value.trim();
        
        if (!articleText) {
            showError('Please enter some article text to analyze.');
            return;
        }

        console.log(`🖥️ Processing article with ${articleText.length} characters`);
        console.log(`🖥️ Article preview: ${articleText.substring(0, 100)}...`);

        // Show loading state
        tagButton.disabled = true;
        loadingIndicator.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        errorMessage.classList.add('hidden');
        
        try {
            console.log('🖥️ Sending request to server...');
            console.time('Server request');
            
            const requestBody = JSON.stringify({ articleText });
            console.log(`🖥️ Request payload: ${requestBody.substring(0, 100)}...`);
            
            const response = await fetch('/api/tag', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestBody
            });
            
            console.timeEnd('Server request');
            console.log(`🖥️ Server responded with status: ${response.status}`);
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`🖥️ Received tags: ${JSON.stringify(data)}`);
            
            // Display the tags
            displayTags(data.tags);
            resultsSection.classList.remove('hidden');
        } catch (error) {
            console.error('🖥️ Error:', error);
            showError(`Failed to get tags: ${error.message}`);
        } finally {
            // Reset UI state
            tagButton.disabled = false;
            loadingIndicator.classList.add('hidden');
        }
    }

    function displayTags(tagsString) {
        // Clear previous tags
        tagsOutput.innerHTML = '';
        
        if (!tagsString || tagsString === 'No relevant tags') {
            tagsOutput.textContent = 'No relevant tags found for this article.';
            return;
        }
        
        // Split the comma-separated tags and create tag elements
        const tags = tagsString.split(',').map(tag => tag.trim());
        console.log(`🖥️ Displaying ${tags.length} tags: ${tags.join(', ')}`);
        
        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium';
            tagElement.textContent = tag;
            tagsOutput.appendChild(tagElement);
        });
    }

    function showError(message) {
        console.error(`🖥️ Error: ${message}`);
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
});