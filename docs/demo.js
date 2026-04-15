/**
 * One Record Demo - UI Logic
 */

// Tab management
function showTab(tabName) {
    // Hide all tab contents
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Update tab buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const activeButton = Array.from(buttons).find(btn => 
        btn.textContent.toLowerCase().includes(tabName.substring(0, 3))
    );
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Load sample order
function loadSample(sampleNumber = 1) {
    const textarea = document.getElementById('sap-input');
    let sampleData;
    let sampleName;
    
    if (sampleNumber === 2) {
        sampleData = SAMPLE_SAP_ORDER_002;
        sampleName = 'Sample #2: Electronics (UK Buyer - Electric Bikes)';
    } else {
        sampleData = SAMPLE_SAP_ORDER;
        sampleName = 'Sample #1: Construction (Finnish - Concrete & Rebar)';
    }
    
    textarea.value = JSON.stringify(sampleData, null, 2);
    showMessage(`${sampleName} loaded successfully! Click "Transform" to convert.`, 'success');
    
    // Update URL to reflect sample selection
    const url = new URL(window.location);
    url.searchParams.set('sample', sampleNumber);
    window.history.replaceState({}, '', url);
}

// Clear all
function clearAll() {
    document.getElementById('sap-input').value = '';
    document.getElementById('canonical-output').value = '';
    document.getElementById('stats-area').classList.add('hidden');
    clearMessage();
}

// Transform order
function transformOrder() {
    const input = document.getElementById('sap-input').value.trim();
    
    if (!input) {
        showMessage('Please enter SAP order JSON or click "Load Sample" first.', 'error');
        return;
    }

    try {
        // Parse input
        const sapOrder = JSON.parse(input);
        
        // Transform using the engine
        const result = oneRecordEngine.transform(sapOrder);
        
        if (result.success) {
            // Display canonical output
            document.getElementById('canonical-output').value = 
                JSON.stringify(result.canonical, null, 2);
            
            // Show stats
            displayStats(result.stats);
            
            showMessage(
                `✅ Transformation successful! ${result.stats.fieldsMapped} fields mapped with ${result.stats.avgConfidence}% confidence.`,
                'success'
            );
        } else {
            showMessage(`Transformation failed: ${result.error}`, 'error');
        }
        
    } catch (error) {
        showMessage(`Invalid JSON: ${error.message}`, 'error');
    }
}

// Display statistics
function displayStats(stats) {
    document.getElementById('stat-fields').textContent = stats.fieldsMapped;
    document.getElementById('stat-confidence').textContent = `${stats.avgConfidence}%`;
    document.getElementById('stat-line-items').textContent = stats.lineItems;
    document.getElementById('stats-area').classList.remove('hidden');
}

// Show message
function showMessage(text, type) {
    const messageArea = document.getElementById('message-area');
    messageArea.innerHTML = `<div class="message ${type}">${text}</div>`;
}

// Clear message
function clearMessage() {
    const messageArea = document.getElementById('message-area');
    messageArea.innerHTML = '';
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('One Record Demo initialized');
    
    // Check URL parameters for auto-loading sample
    const urlParams = new URLSearchParams(window.location.search);
    const sampleParam = urlParams.get('sample');
    
    if (sampleParam) {
        const sampleNumber = parseInt(sampleParam, 10);
        if (sampleNumber === 1 || sampleNumber === 2) {
            loadSample(sampleNumber);
            return; // Skip welcome message if auto-loading
        }
    }
    
    // Show welcome message
    setTimeout(() => {
        showMessage(
            '👋 Welcome! Choose a sample order to try the transformation, or paste your own SAP order JSON.',
            'success'
        );
    }, 500);
});
