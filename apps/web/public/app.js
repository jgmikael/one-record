/**
 * One Record Demo - Frontend Application with URL Routing
 */

const API_BASE = window.location.origin.includes('localhost:3001') 
    ? 'http://localhost:3001/api'
    : '/api';

// State
let currentOrders = [];
let currentOrder = null;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeImport();
    initializeOrders();
    initializeViewer();
    initializeComparison();
    
    // Handle URL routing
    handleRouting();
    window.addEventListener('popstate', handleRouting);
    
    // Load orders on start
    loadOrders();
});

// URL Routing
function handleRouting() {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.slice(1);
    
    // Route based on hash
    if (hash) {
        const [view, ...args] = hash.split('/');
        
        switch (view) {
            case 'import':
                switchTab('import');
                if (params.get('sample') === 'true') {
                    loadSampleOrder();
                }
                break;
                
            case 'orders':
                switchTab('orders');
                if (args[0]) {
                    viewOrder(args[0]);
                }
                break;
                
            case 'viewer':
                switchTab('viewer');
                if (args[0]) {
                    document.getElementById('order-select').value = args[0];
                    const viewType = params.get('view') || 'canonical';
                    if (viewType === 'source') viewSource();
                    else if (viewType === 'report') viewReport();
                    else viewCanonical();
                }
                break;
                
            case 'comparison':
                switchTab('comparison');
                if (args[0]) {
                    document.getElementById('comparison-order-select').value = args[0];
                    loadComparison();
                }
                break;
                
            case 'about':
                switchTab('about');
                break;
                
            default:
                switchTab('import');
        }
    } else {
        switchTab('import');
    }
}

function updateURL(path) {
    window.history.pushState({}, '', path);
}

// Tab Management
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
            updateURL(`#${tabName}`);
        });
    });
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
    if (activeTab) activeTab.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const activeContent = document.getElementById(`${tabName}-tab`);
    if (activeContent) activeContent.classList.add('active');

    // Refresh data if needed
    if (tabName === 'orders') {
        loadOrders();
    }
}

// Import Tab
function initializeImport() {
    document.getElementById('load-sample-btn').addEventListener('click', () => {
        loadSampleOrder();
        updateURL('#import?sample=true');
    });
    document.getElementById('import-btn').addEventListener('click', importOrder);
}

async function loadSampleOrder() {
    try {
        const response = await fetch('/samples/sap-order-001.json');
        const sample = await response.json();
        document.getElementById('sap-input').value = JSON.stringify(sample, null, 2);
        showMessage('Sample SAP order loaded', 'success');
    } catch (error) {
        showMessage('Failed to load sample: ' + error.message, 'error');
    }
}

async function importOrder() {
    const input = document.getElementById('sap-input').value.trim();
    if (!input) {
        showMessage('Please enter SAP order JSON', 'error');
        return;
    }

    try {
        const sapOrder = JSON.parse(input);
        const response = await fetch(`${API_BASE}/orders/import/sap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sapOrder)
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('import-result').classList.remove('hidden');
            document.getElementById('import-result-content').textContent = 
                JSON.stringify(result, null, 2);
            showMessage(`Order ${result.order_id} imported successfully!`, 'success');
            loadOrders();
            
            // Navigate to the imported order
            setTimeout(() => {
                updateURL(`#viewer/${result.order_id}?view=canonical`);
                handleRouting();
            }, 1500);
        } else {
            showMessage('Import failed: ' + result.message, 'error');
        }
    } catch (error) {
        showMessage('Import error: ' + error.message, 'error');
    }
}

// Orders Tab
function initializeOrders() {
    document.getElementById('refresh-orders-btn').addEventListener('click', loadOrders);
}

async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders`);
        const data = await response.json();
        currentOrders = data.orders || [];
        renderOrdersList(currentOrders);
        updateOrderSelects(currentOrders);
    } catch (error) {
        showMessage('Failed to load orders: ' + error.message, 'error');
    }
}

function renderOrdersList(orders) {
    const container = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <p>No orders imported yet.</p>
            <p><a href="#import?sample=true">Click here to load and import a sample order</a></p>
        `;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card" onclick="viewOrder('${order.order_id}')">
            <h3>Order ${order.order_id}</h3>
            <div class="order-meta">
                <span>Imported: ${new Date(order.import_timestamp).toLocaleString()}</span>
                <span class="status ${order.processing_status}">${order.processing_status}</span>
            </div>
            <div class="order-actions">
                <a href="#viewer/${order.order_id}?view=source" onclick="event.stopPropagation()">View Source</a>
                <a href="#viewer/${order.order_id}?view=canonical" onclick="event.stopPropagation()">View Canonical</a>
                <a href="#viewer/${order.order_id}?view=report" onclick="event.stopPropagation()">View Report</a>
                <a href="#comparison/${order.order_id}" onclick="event.stopPropagation()">Compare</a>
            </div>
        </div>
    `).join('');
}

function updateOrderSelects(orders) {
    const selects = [
        document.getElementById('order-select'),
        document.getElementById('comparison-order-select')
    ];

    selects.forEach(select => {
        select.innerHTML = '<option value="">-- Select an order --</option>' +
            orders.map(o => `<option value="${o.order_id}">${o.order_id}</option>`).join('');
    });
}

function viewOrder(orderId) {
    updateURL(`#viewer/${orderId}?view=canonical`);
    handleRouting();
}

// Viewer Tab
function initializeViewer() {
    document.getElementById('view-source-btn').addEventListener('click', () => {
        const orderId = document.getElementById('order-select').value;
        if (orderId) {
            updateURL(`#viewer/${orderId}?view=source`);
            viewSource();
        }
    });
    
    document.getElementById('view-canonical-btn').addEventListener('click', () => {
        const orderId = document.getElementById('order-select').value;
        if (orderId) {
            updateURL(`#viewer/${orderId}?view=canonical`);
            viewCanonical();
        }
    });
    
    document.getElementById('view-report-btn').addEventListener('click', () => {
        const orderId = document.getElementById('order-select').value;
        if (orderId) {
            updateURL(`#viewer/${orderId}?view=report`);
            viewReport();
        }
    });
    
    document.getElementById('order-select').addEventListener('change', (e) => {
        if (e.target.value) {
            updateURL(`#viewer/${e.target.value}?view=canonical`);
            viewCanonical();
        }
    });
}

async function viewSource() {
    const orderId = document.getElementById('order-select').value;
    if (!orderId) {
        showMessage('Please select an order', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}/source`);
        const data = await response.json();
        renderViewer('SAP Source', data);
    } catch (error) {
        showMessage('Failed to load source: ' + error.message, 'error');
    }
}

async function viewCanonical() {
    const orderId = document.getElementById('order-select').value;
    if (!orderId) {
        showMessage('Please select an order', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}/canonical`);
        const data = await response.json();
        renderViewer('Canonical JSON-LD', data, true);
    } catch (error) {
        showMessage('Failed to load canonical: ' + error.message, 'error');
    }
}

async function viewReport() {
    const orderId = document.getElementById('order-select').value;
    if (!orderId) {
        showMessage('Please select an order', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}/mapping-report`);
        const report = await response.json();
        renderMappingReport(report);
    } catch (error) {
        showMessage('Failed to load report: ' + error.message, 'error');
    }
}

function renderViewer(title, data, isCanonical = false) {
    const container = document.getElementById('viewer-content');
    
    let additionalInfo = '';
    if (isCanonical && data['@context']) {
        additionalInfo = `
            <div class="semantic-info">
                <h4>Semantic Information</h4>
                <p><strong>Context:</strong> <a href="${data['@context']}" target="_blank">${data['@context']}</a></p>
                <p><strong>Type:</strong> ${data['@type']}</p>
                <p><strong>Resource ID:</strong> ${data['@id']}</p>
                <p><strong>Vocabulary:</strong> fcior (Finnish Construction Industry One Record)</p>
            </div>
        `;
    }
    
    container.innerHTML = `
        <h3>${title}</h3>
        ${additionalInfo}
        <div class="code-viewer-actions">
            <button class="btn btn-secondary" onclick="downloadJSON('${title}', ${JSON.stringify(JSON.stringify(data))})">Download JSON</button>
            <button class="btn btn-secondary" onclick="copyToClipboard(${JSON.stringify(JSON.stringify(data))})">Copy to Clipboard</button>
        </div>
        <pre class="code-viewer">${JSON.stringify(data, null, 2)}</pre>
    `;
}

function renderMappingReport(report) {
    const container = document.getElementById('viewer-content');
    
    const html = `
        <h3>Mapping Report</h3>
        <div class="report-summary">
            <p><strong>Source Document:</strong> ${report.sourceDocumentID}</p>
            <p><strong>Timestamp:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
            <p><strong>Mapping Engine:</strong> v${report.mappingEngineVersion}</p>
            <p><strong>Rules Version:</strong> v${report.mappingRulesVersion}</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${report.overallConfidence}%</div>
                <div class="stat-label">Overall Confidence</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${report.statistics.totalMappedFields}</div>
                <div class="stat-label">Mapped Fields</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${report.statistics.highConfidenceMappings}</div>
                <div class="stat-label">High Confidence</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${report.statistics.mediumConfidenceMappings}</div>
                <div class="stat-label">Medium Confidence</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${report.statistics.totalUnmappedFields}</div>
                <div class="stat-label">Unmapped Fields</div>
            </div>
        </div>
        
        <div class="report-section">
            <h4>Sample Mappings (First 10)</h4>
            <div class="mappings-table">
                ${renderMappingsTable(report.mappings.slice(0, 10))}
            </div>
        </div>
        
        <div class="code-viewer-actions">
            <button class="btn btn-secondary" onclick="downloadJSON('mapping-report', ${JSON.stringify(JSON.stringify(report))})">Download Full Report</button>
        </div>
        
        <details>
            <summary><h4>Full Mapping Report (Click to expand)</h4></summary>
            <pre class="code-viewer">${JSON.stringify(report, null, 2)}</pre>
        </details>
    `;
    
    container.innerHTML = html;
}

function renderMappingsTable(mappings) {
    if (mappings.length === 0) return '<p>No mappings available</p>';
    
    return `
        <table class="mappings-table">
            <thead>
                <tr>
                    <th>Source Path</th>
                    <th>Target Path</th>
                    <th>Confidence</th>
                    <th>Transform</th>
                    <th>Rationale</th>
                </tr>
            </thead>
            <tbody>
                ${mappings.map(m => `
                    <tr>
                        <td><code>${m.sourcePath}</code></td>
                        <td><code>${m.targetPath}</code></td>
                        <td><span class="badge badge-${m.confidence.toLowerCase()}">${m.confidence}</span></td>
                        <td>${m.transformationApplied || '-'}</td>
                        <td>${m.rationale}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Comparison Tab
function initializeComparison() {
    document.getElementById('load-comparison-btn').addEventListener('click', () => {
        const orderId = document.getElementById('comparison-order-select').value;
        if (orderId) {
            updateURL(`#comparison/${orderId}`);
            loadComparison();
        }
    });
    
    document.getElementById('comparison-order-select').addEventListener('change', (e) => {
        if (e.target.value) {
            updateURL(`#comparison/${e.target.value}`);
            loadComparison();
        }
    });
}

async function loadComparison() {
    const orderId = document.getElementById('comparison-order-select').value;
    if (!orderId) {
        showMessage('Please select an order', 'error');
        return;
    }

    try {
        const [source, canonical, report] = await Promise.all([
            fetch(`${API_BASE}/orders/${orderId}/source`).then(r => r.json()),
            fetch(`${API_BASE}/orders/${orderId}/canonical`).then(r => r.json()),
            fetch(`${API_BASE}/orders/${orderId}/mapping-report`).then(r => r.json())
        ]);

        document.getElementById('comparison-source').textContent = 
            JSON.stringify(source, null, 2);
        document.getElementById('comparison-canonical').textContent = 
            JSON.stringify(canonical, null, 2);
        
        document.getElementById('comparison-report').classList.remove('hidden');
        document.getElementById('comparison-stats').innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${report.overallConfidence}%</div>
                    <div class="stat-label">Overall Confidence</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${report.statistics.totalMappedFields}</div>
                    <div class="stat-label">Mapped Fields</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${report.statistics.highConfidenceMappings}</div>
                    <div class="stat-label">High Confidence</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${report.statistics.mediumConfidenceMappings}</div>
                    <div class="stat-label">Medium Confidence</div>
                </div>
            </div>
        `;
    } catch (error) {
        showMessage('Failed to load comparison: ' + error.message, 'error');
    }
}

// Utilities
function showMessage(message, type = 'info') {
    console.log(`[${type.toUpperCase()}]`, message);
    
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function downloadJSON(filename, jsonString) {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage('Copied to clipboard', 'success');
    }).catch(() => {
        showMessage('Failed to copy to clipboard', 'error');
    });
}
