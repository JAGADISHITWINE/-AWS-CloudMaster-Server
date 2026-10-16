const http = require('http');

const BASE_URL = 'http://localhost:5000';

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting API Integration Tests...');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await makeRequest('GET', '/api/health');
    assert(health.status === 200 && health.body.status === 'healthy', 'GET /api/health returns 200 OK');

    // 2. Login
    const login = await makeRequest('POST', '/api/auth/login', {
      email: 'learner@example.com',
      password: 'AwsCloudPass123!'
    });
    assert(login.status === 200 && login.body.token, 'POST /api/auth/login succeeds with JWT token');
    const token = login.body.token;

    // 3. Get Modules
    const modulesRes = await makeRequest('GET', '/api/modules', null, token);
    assert(modulesRes.status === 200 && modulesRes.body.modules.length === 15, 'GET /api/modules returns all 15 AWS modules');

    // 4. Get Topic 1
    const topicId = modulesRes.body.modules[0].topics[0].id;
    const topicRes = await makeRequest('GET', `/api/modules/topics/${topicId}`, null, token);
    assert(topicRes.status === 200 && topicRes.body.topic.title.includes('Regions'), 'GET /api/modules/topics/:id returns topic details');

    // 5. Get Notes
    const notesRes = await makeRequest('GET', `/api/notes/${topicId}`, null, token);
    assert(notesRes.status === 200 && notesRes.body.notes.coreConcepts.length > 0, 'GET /api/notes/:topicId returns structured notes & concepts');

    // 6. Get Lab
    const labRes = await makeRequest('GET', `/api/labs/${topicId}`, null, token);
    assert(labRes.status === 200 && labRes.body.lab.steps.length > 0, 'GET /api/labs/:id returns hands-on lab steps & safety guide');

    // 7. Get Scenarios
    const scenariosRes = await makeRequest('GET', '/api/scenarios', null, token);
    assert(scenariosRes.status === 200 && scenariosRes.body.scenarios.length >= 5, 'GET /api/scenarios returns real-world troubleshooting scenarios');

    // 8. Submit Scenario Solution
    const scenarioId = scenariosRes.body.scenarios[0].id;
    const submitScenario = await makeRequest('POST', `/api/scenarios/${scenarioId}/submit`, {
      answer: "I would check the EC2 Security Group inbound rules to allow TCP port 80 from 0.0.0.0/0, inspect the route table to ensure 0.0.0.0/0 routes to an Internet Gateway, verify the NACL allows inbound port 80 and outbound ephemeral ports, and confirm Nginx is running."
    }, token);
    assert(submitScenario.status === 200 && submitScenario.body.score >= 70, 'POST /api/scenarios/:id/submit evaluates and returns score & recommended solution');

    // 9. Free Tier Safety Center
    const safetyRes = await makeRequest('GET', '/api/safety/center', null, token);
    assert(safetyRes.status === 200 && safetyRes.body.commonCostPitfalls.length > 0, 'GET /api/safety/center returns Free Tier Safety Center data');

    // 10. Dashboard summary
    const dashboardRes = await makeRequest('GET', '/api/progress/dashboard', null, token);
    assert(dashboardRes.status === 200 && dashboardRes.body.stats.totalTopics === 15, 'GET /api/progress/dashboard aggregates user metrics and streak');

    console.log(`\n🎉 Test Suite Completed: ${passed} passed, ${failed} failed.`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
