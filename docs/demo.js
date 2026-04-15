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
function loadSample() {
    const textarea = document.getElementById('sap-input');
    textarea.value = JSON.stringify(SAMPLE_SAP_ORDER, null, 2);
    showMessage('Sample SAP order loaded successfully! Click "Transform" to convert.', 'success');
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
    
    // Show welcome message
    setTimeout(() => {
        showMessage(
            '👋 Welcome! Click "Load Sample SAP Order" to try the transformation, or paste your own SAP order JSON.',
            'success'
        );
    }, 500);
});
