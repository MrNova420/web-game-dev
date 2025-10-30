#!/bin/bash
# Test all deployment methods for Dynasty of Emberveil

echo "🧪 Testing All Deployment Methods"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_result=0

# Test 1: Build
echo "Test 1: Build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build: PASS${NC}"
else
    echo -e "${RED}❌ Build: FAIL${NC}"
    test_result=1
fi

# Test 2: Check dist files
echo "Test 2: Check dist files..."
if [ -f "dist/index.html" ] && [ -n "$(ls dist/assets/index-*.js 2>/dev/null)" ]; then
    echo -e "${GREEN}✅ Dist files: PASS${NC}"
else
    echo -e "${RED}❌ Dist files: FAIL${NC}"
    test_result=1
fi

# Test 3: Multiplayer server syntax check
echo "Test 3: Multiplayer server syntax..."
if node --check multiplayer-server.js 2>/dev/null; then
    echo -e "${GREEN}✅ Server syntax: PASS${NC}"
else
    echo -e "${RED}❌ Server syntax: FAIL${NC}"
    test_result=1
fi

# Test 4: Deploy script syntax check  
echo "Test 4: Deploy script syntax..."
if node --check deploy-full-game.js 2>/dev/null; then
    echo -e "${GREEN}✅ Deploy syntax: PASS${NC}"
else
    echo -e "${RED}❌ Deploy syntax: FAIL${NC}"
    test_result=1
fi

# Test 5: Dev server (wait longer and check port)
echo "Test 5: Dev server start..."
timeout 8 npm run dev > /tmp/dev_test.log 2>&1 &
DEV_PID=$!
sleep 5  # Give it more time to start
if ps -p $DEV_PID > /dev/null && (curl -s http://localhost:5173 > /dev/null 2>&1 || grep -q "ready in" /tmp/dev_test.log); then
    echo -e "${GREEN}✅ Dev server: PASS${NC}"
    kill $DEV_PID 2>/dev/null
    wait $DEV_PID 2>/dev/null
else
    echo -e "${RED}❌ Dev server: FAIL${NC}"
    kill $DEV_PID 2>/dev/null
    wait $DEV_PID 2>/dev/null
    test_result=1
fi

# Test 6: Multiplayer server start (check port binding)
echo "Test 6: Multiplayer server start..."
timeout 8 node multiplayer-server.js > /tmp/server_test.log 2>&1 &
SERVER_PID=$!
sleep 5  # Give it more time to start
if ps -p $SERVER_PID > /dev/null && (curl -s http://localhost:3000/health > /dev/null 2>&1 || grep -q "Server ready" /tmp/server_test.log); then
    echo -e "${GREEN}✅ Multiplayer server: PASS${NC}"
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
else
    echo -e "${RED}❌ Multiplayer server: FAIL${NC}"
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
    test_result=1
fi

# Summary
echo ""
echo "=================================="
if [ $test_result -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests PASSED!${NC}"
    echo "The game is ready to deploy with any method."
else
    echo -e "${RED}⚠️  Some tests FAILED${NC}"
    echo "Please check the errors above."
fi

exit $test_result
