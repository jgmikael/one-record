/**
 * One Record Demo - Frontend Application
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
    loadOrders();
});

// Tab Management
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Refresh data if needed
    if (tabName === 'orders') {
        loadOrders();
    }
}

// Import Tab
function initializeImport() {
    document.getElementById('load-sample-btn').addEventListener('click', loadSampleOrder);
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
        container.innerHTML = '<p>No orders imported yet. Go to the Import tab to add one.</p>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card" onclick="viewOrder('${order.order_id}')">
            <h3>Order ${order.order_id}</h3>
            <div class="order-meta">
                <span>Imported: ${new Date(order.import_timestamp).toLocaleString()}</span>
                <span class="status ${order.processing_status}">${order.processing_status}</span>
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
    switchTab('viewer');
    document.getElementById('order-select').value = orderId;
    viewCanonical();
}

// Viewer Tab
function initializeViewer() {
    document.getElementById('view-source-btn').addEventListener('click', viewSource);
    document.getElementById('view-canonical-btn').addEventListener('click', viewCanonical);
    document.getElementById('view-report-btn').addEventListener('click', viewReport);
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
        renderViewer('Canonical JSON-LD', data);
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

function renderViewer(title, data) {
    const container = document.getElementById('viewer-content');
    container.innerHTML = `
        <h3>${title}</h3>
        <pre class="code-viewer">${JSON.stringify(data, null, 2)}</pre>
    `;
}

function renderMappingReport(report) {
    const container = document.getElementById('viewer-content');
    
    const html = `
        <h3>Mapping Report</h3>
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
                <div class="stat-value">${report.statistics.totalUnmappedFields}</div>
                <div class="stat-label">Unmapped Fields</div>
            </div>
        </div>
        <h4 style="margin-top: 30px;">Full Report</h4>
        <pre class="code-viewer">${JSON.stringify(report, null, 2)}</pre>
    `;
    
    container.innerHTML = html;
}

// Comparison Tab
function initializeComparison() {
    document.getElementById('load-comparison-btn').addEventListener('click', loadComparison);
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
    // Simple alert for now (could be replaced with a toast notification)
    if (type === 'error') {
        alert('Error: ' + message);
    }
}
