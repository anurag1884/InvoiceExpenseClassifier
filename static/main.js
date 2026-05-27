async function fetchWithFallback(urls, request) {
    for (let url of urls) {
        try {
            const response = await fetch(url, request);
            if (!response.ok) {
                continue;
            }
            return response; // Success
        } catch (err) {
            // Continue to the next fallback URL
        }
    }
    throw new Error('All fetch attempts failed');
}

async function evaluateCategory(input) {
    const response = await fetchWithFallback('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: input
        })
    });
    const output = await response.json();
    return output;
}

function updateAnalysis(output) {
    document.getElementById('input-text-id').innerText = output.text;
    document.getElementById('category-id').innerText = output.category;
    document.getElementById('confidence-id').innerText = Math.round(output.confidence * 10000) / 100 + '%';
}

function processInput() {
    const outputContainerElement = document.getElementById('output-container-id'),
          inputTextareaElement = document.getElementById('input-textarea-id');
    const inputText = inputTextareaElement.value.trim();
    if (inputText.length == 0) {
        // outputContainerElement.style.display = 'none';
        outputContainerElement.classList.add('hidden');
        if (inputTextareaElement.classList.contains('focus:border-blue-500')) {
            inputTextareaElement.classList.remove('border-gray-300');
            inputTextareaElement.classList.remove('focus:border-blue-500');
            inputTextareaElement.classList.add('border-red-500');
        }
        inputTextareaElement.focus();
        return;
    }
    evaluateCategory(inputText)
        .then(output => updateAnalysis(output));
    // outputContainerElement.style.display = 'block';
    outputContainerElement.classList.remove('hidden');
    if (inputTextareaElement.classList.contains('border-red-500')) {
        inputTextareaElement.classList.add('border-gray-300');
        inputTextareaElement.classList.add('focus:border-blue-500');
        inputTextareaElement.classList.remove('border-red-500');
    }
}