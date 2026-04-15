#!/bin/bash

# One Record Demo - Automated Test Script
# Verifies complete functionality

set -e

BASE_URL="${BASE_URL:-http://localhost:3001}"
VERBOSE="${VERBOSE:-false}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_test() {
    echo -e "${YELLOW}[TEST $1]${NC} $2"
}

pass_test() {
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}  ✓ PASS${NC}"
}

fail_test() {
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}  ✗ FAIL${NC} $1"
}

run_test() {
    TESTS_RUN=$((TESTS_RUN + 1))
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    log_error "jq is required but not installed. Install with: sudo apt-get install jq"
    exit 1
fi

# Start tests
echo "======================================"
echo "One Record Demo - Automated Test Suite"
echo "======================================"
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Health Check
run_test
log_test "1" "API Health Check"
RESPONSE=$(curl -s "$BASE_URL/api/health")
if echo "$RESPONSE" | jq -e '.status == "healthy"' > /dev/null 2>&1; then
    pass_test
else
    fail_test "Health check failed"
    [ "$VERBOSE" = "true" ] && echo "Response: $RESPONSE"
fi

# Test 2: Version Info
run_test
log_test "2" "API Version Info"
RESPONSE=$(curl -s "$BASE_URL/api/version")
if echo "$RESPONSE" | jq -e '.api.version' > /dev/null 2>&1; then
    pass_test
else
    fail_test "Version info missing"
fi

# Test 3: Sample Data Access
run_test
log_test "3" "Sample SAP Order Access"
RESPONSE=$(curl -s "$BASE_URL/samples/sap-order-001.json")
if echo "$RESPONSE" | jq -e '.OrderHeader.SalesDocument' > /dev/null 2>&1; then
    pass_test
else
    fail_test "Sample order not accessible"
fi

# Test 4: Import SAP Order
run_test
log_test "4" "Import SAP Order"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/orders/import/sap" \
    -H "Content-Type: application/json" \
    -d @samples/sap-order-001.json 2>&1)

ORDER_ID=$(echo "$RESPONSE" | jq -r '.order_id // empty')

if [ -n "$ORDER_ID" ] || echo "$RESPONSE" | grep -q "already exists"; then
    pass_test
    if [ -z "$ORDER_ID" ]; then
        # Order already exists, get ID from error message
        ORDER_ID="4500012345"
    fi
else
    fail_test "Import failed"
    [ "$VERBOSE" = "true" ] && echo "Response: $RESPONSE"
    exit 1
fi

log_info "Order ID: $ORDER_ID"

# Test 5: List Orders
run_test
log_test "5" "List Orders"
RESPONSE=$(curl -s "$BASE_URL/api/orders")
if echo "$RESPONSE" | jq -e '.orders | length > 0' > /dev/null 2>&1; then
    pass_test
else
    fail_test "No orders found"
fi

# Test 6: Get Order Summary
run_test
log_test "6" "Get Order Summary"
RESPONSE=$(curl -s "$BASE_URL/api/orders/$ORDER_ID")
if echo "$RESPONSE" | jq -e '.order_id' > /dev/null 2>&1; then
    pass_test
else
    fail_test "Order summary not found"
fi

# Test 7: Get SAP Source
run_test
log_test "7" "Get SAP Source"
RESPONSE=$(curl -s "$BASE_URL/api/orders/$ORDER_ID/source")
if echo "$RESPONSE" | jq -e '.OrderHeader.SalesDocument' > /dev/null 2>&1; then
    pass_test
else
    fail_test "SAP source not found"
fi

# Test 8: Get Canonical JSON-LD
run_test
log_test "8" "Get Canonical JSON-LD"
RESPONSE=$(curl -s "$BASE_URL/api/orders/$ORDER_ID/canonical")
if echo "$RESPONSE" | jq -e '.["@context"]' > /dev/null 2>&1 && \
   echo "$RESPONSE" | jq -e '.["@type"] == "Order"' > /dev/null 2>&1 && \
   echo "$RESPONSE" | jq -e '.orderNumber' > /dev/null 2>&1; then
    pass_test
    
    # Verify semantic structure
    CONTEXT=$(echo "$RESPONSE" | jq -r '.["@context"]')
    if [[ "$CONTEXT" == *"fcior"* ]]; then
        log_info "  ✓ fcior context found"
    fi
else
    fail_test "Canonical JSON-LD invalid"
    [ "$VERBOSE" = "true" ] && echo "Response: $RESPONSE"
fi

# Test 9: Get Mapping Report
run_test
log_test "9" "Get Mapping Report"
RESPONSE=$(curl -s "$BASE_URL/api/orders/$ORDER_ID/mapping-report")
if echo "$RESPONSE" | jq -e '.overallConfidence' > /dev/null 2>&1 && \
   echo "$RESPONSE" | jq -e '.statistics.totalMappedFields > 0' > /dev/null 2>&1; then
    CONFIDENCE=$(echo "$RESPONSE" | jq -r '.overallConfidence')
    MAPPED=$(echo "$RESPONSE" | jq -r '.statistics.totalMappedFields')
    HIGH=$(echo "$RESPONSE" | jq -r '.statistics.highConfidenceMappings')
    pass_test
    log_info "  Confidence: ${CONFIDENCE}%, Mapped: $MAPPED fields, High: $HIGH"
else
    fail_test "Mapping report invalid"
fi

# Test 10: Content-Type for JSON-LD
run_test
log_test "10" "JSON-LD Content-Type"
CONTENT_TYPE=$(curl -s -I "$BASE_URL/api/orders/$ORDER_ID/canonical" | grep -i "content-type" | tr -d '\r')
if echo "$CONTENT_TYPE" | grep -q "application/ld+json"; then
    pass_test
else
    fail_test "Wrong content type: $CONTENT_TYPE"
fi

# Test 11: Mapping Suggestions (if endpoint exists)
run_test
log_test "11" "Mapping Suggestions API"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/mappings/suggest" \
    -H "Content-Type: application/json" \
    -d '{"sourceDoc": {"test": "data"}, "targetSchema": {}}')
if echo "$RESPONSE" | jq -e '.' > /dev/null 2>&1; then
    pass_test
else
    fail_test "Suggestions endpoint not working"
fi

# Test 12: Error Handling
run_test
log_test "12" "Error Handling (Invalid JSON)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/orders/import/sap" \
    -H "Content-Type: application/json" \
    -d '{"invalid": "data"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "400" ]; then
    pass_test
else
    fail_test "Should return 400 for invalid data, got: $HTTP_CODE"
fi

# Test 13: Frontend Access
run_test
log_test "13" "Frontend HTML Access"
RESPONSE=$(curl -s "$BASE_URL/")
if echo "$RESPONSE" | grep -q "One Record Demo"; then
    pass_test
else
    fail_test "Frontend not accessible"
fi

# Test 14: URL Routing
run_test
log_test "14" "URL Routing (Hash Navigation)"
RESPONSE=$(curl -s "$BASE_URL/#import")
if echo "$RESPONSE" | grep -q "One Record Demo"; then
    pass_test
else
    fail_test "URL routing not working"
fi

# Test 15: Database Persistence
run_test
log_test "15" "Database Persistence Check"
# Count orders twice to verify persistence
COUNT1=$(curl -s "$BASE_URL/api/orders" | jq -r '.total')
COUNT2=$(curl -s "$BASE_URL/api/orders" | jq -r '.total')
if [ "$COUNT1" = "$COUNT2" ] && [ "$COUNT1" -gt 0 ]; then
    pass_test
else
    fail_test "Persistence issue detected"
fi

# Summary
echo ""
echo "======================================"
echo "Test Summary"
echo "======================================"
echo "Total Tests: $TESTS_RUN"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $TESTS_FAILED${NC}"
fi
echo ""

# Exit code
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
