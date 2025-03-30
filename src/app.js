// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const tagButton = document.getElementById('tagButton');
    const articleInput = document.getElementById('articleInput');
    const tagsOutput = document.getElementById('tagsOutput');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsSection = document.getElementById('resultsSection');
    const errorMessage = document.getElementById('errorMessage');

    console.log('🖥️ ML Tagger client initialized');
    
    // Event listeners
    tagButton.addEventListener('click', tagArticle);

    async function tagArticle() {
        const articleText = articleInput.value.trim();
        
        if (!articleText) {
            showError('Please enter some article text to analyze.');
            return;
        }

        // Debug logging
        console.log('------ Tag Request Started ------');
        console.log(`📝 Processing article with ${articleText.length} characters`);
        console.log(`📝 Article preview: ${articleText.substring(0, 100)}...`);

        // Update UI state - loading
        updateUIState(true);
        
        try {
            console.log('🚀 Sending request to API...');
            console.time('API request');
            
            const response = await fetch('/api/tag', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ articleText })
            });
            
            console.timeEnd('API request');
            console.log(`📡 API responded with status: ${response.status}`);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `API error: ${response.status}`);
            }
            
            console.log('📦 Received data:', data);
            
            // Display results
            displayTags(data.tags);
            resultsSection.classList.remove('hidden');
        } catch (error) {
            console.error('❌ Request failed:', error);
            showError(`Failed to get tags: ${error.message}`);
        } finally {
            console.log('------ Tag Request Ended ------');
            updateUIState(false);
        }
    }

    function displayTags(tagsString) {
        // Clear previous tags
        tagsOutput.innerHTML = '';
        
        if (!tagsString || tagsString === 'No relevant tags') {
            tagsOutput.textContent = 'No relevant tags found for this article.';
            return;
        }
        
        // Split and clean tags
        const tags = tagsString.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
            
        console.log(`🏷️ Displaying ${tags.length} tags: ${tags.join(', ')}`);
        
        // Create and append tag elements
        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2';
            tagElement.textContent = tag;
            tagsOutput.appendChild(tagElement);
        });
    }

    function showError(message) {
        console.error(`❌ Error: ${message}`);
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function updateUIState(isLoading) {
        tagButton.disabled = isLoading;
        loadingIndicator.classList.toggle('hidden', !isLoading);
        if (isLoading) {
            resultsSection.classList.add('hidden');
            errorMessage.classList.add('hidden');
        }
    }
});