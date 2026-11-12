const topics = [
  {
    topicNumber: 1,
    title: 'Python Foundations: Values, Collections & Control Flow',
    slug: 'python-foundations-values-collections-control-flow',
    summary: 'Work with variables, strings, numbers, booleans, lists, dictionaries, conditions, and loops by building a small cloud-resource inventory.',
    difficulty: 'Beginner',
    estimatedMinutes: 30,
    keyTakeaway: 'Choose a data type that matches the information, then use clear conditions and loops to transform collections safely.'
  },
  {
    topicNumber: 2,
    title: 'Functions, Modules, Exceptions & JSON Files',
    slug: 'python-functions-modules-exceptions-json',
    summary: 'Break programs into reusable functions, import modules, handle expected failures, and read or write structured JSON data.',
    difficulty: 'Beginner',
    estimatedMinutes: 35,
    keyTakeaway: 'Small functions with explicit inputs, outputs, and errors are easier to test and reuse in automation.'
  },
  {
    topicNumber: 3,
    title: 'Virtual Environments, HTTP APIs & Automated Testing',
    slug: 'python-venvs-http-apis-pytest',
    summary: 'Isolate dependencies, call a JSON API, validate input, and write pytest tests that check both normal and invalid behavior.',
    difficulty: 'Intermediate',
    estimatedMinutes: 40,
    keyTakeaway: 'Reproducible environments and automated tests make Python tools dependable in a developer laptop and CI pipeline.'
  },
  {
    topicNumber: 4,
    title: 'Python on AWS: boto3, Lambda & Secure CI/CD',
    slug: 'python-aws-boto3-lambda-cicd',
    summary: 'Connect Python code to AWS using boto3 and Lambda, package an API with AWS SAM, and deploy from GitHub Actions using short-lived OIDC credentials.',
    difficulty: 'Intermediate',
    estimatedMinutes: 45,
    keyTakeaway: 'Keep credentials out of code: use a narrowly scoped IAM role, GitHub OIDC, automated tests, and explicit deployment cleanup.'
  }
];

const concepts = {
  [topics[0].slug]: [
    ['Variable', 'A readable name bound to a value; Python infers the value type at runtime.'],
    ['List', 'An ordered, changeable collection useful for processing several items.'],
    ['Dictionary', 'A mapping of keys to values, useful for representing a resource record.'],
    ['Condition', 'An if/elif/else expression selects a code path based on a boolean test.'],
    ['Loop', 'A for loop processes each item in an iterable; a while loop repeats while a condition remains true.']
  ],
  [topics[1].slug]: [
    ['Function', 'A reusable block defined with def. Parameters are inputs; return sends a result to the caller.'],
    ['Module', 'A Python file that can be imported so related functions and constants can be reused.'],
    ['Exception', 'An object describing an error. Catch only errors the program can handle meaningfully.'],
    ['JSON', 'A text format for nested objects and arrays; Python’s json module converts it to and from Python values.']
  ],
  [topics[2].slug]: [
    ['Virtual environment', 'An isolated Python installation for one project, created with python -m venv .venv.'],
    ['Dependency', 'A package an application needs; record it so another machine or CI runner can recreate the environment.'],
    ['HTTP API', 'A contract using methods, status codes, headers, and request/response bodies.'],
    ['pytest', 'A Python test runner that discovers test files and reports assertion failures.'],
    ['Mock', 'A controlled substitute for an external system, allowing tests without real network calls.']
  ],
  [topics[3].slug]: [
    ['boto3', 'The AWS SDK for Python; it makes signed AWS API requests using the configured credential chain.'],
    ['Lambda handler', 'The function AWS invokes with an event and context; its response follows the trigger contract.'],
    ['IAM execution role', 'The identity Lambda assumes at runtime, scoped to only the actions and resources it needs.'],
    ['GitHub OIDC', 'A trust relationship that exchanges a workflow identity token for short-lived AWS role credentials.'],
    ['Infrastructure as Code', 'A declarative template describing resources and permissions for reviewable, repeatable deployments.']
  ]
};

const explanations = [
  'Python programs work with values. Strings store text, numbers store quantities, booleans represent true or false, and collections group related data. Conditions choose what to do and loops repeat work. A resource inventory can be represented as a list of dictionaries and filtered by environment.',
  'As a script grows, divide it into named functions that each do one job. Put reusable functions in modules, handle expected errors near the operation that can fail, and use JSON when data needs to be saved or exchanged with another program.',
  'A virtual environment gives each project its own installed packages. HTTP APIs let programs exchange requests and JSON responses. Tests check expected behavior and should also cover invalid input and failures.',
  'boto3 is the AWS SDK for Python. Lambda runs a function in response to an event. A CI/CD workflow can test and package code, then deploy it with an AWS role assumed through GitHub OIDC rather than a stored access key.'
];

const internals = [
  'Python executes statements in order. A for loop asks an iterable for its next item until exhausted. Indentation defines statement blocks, so consistent four-space indentation is part of the program structure.',
  'Calling a function creates a local scope for its parameters and variables. Imports load a module once per interpreter process. A try/except block intercepts matching exceptions; unrelated errors should remain visible.',
  'Tests should isolate the behavior under test from AWS, databases, and public networks. Keep input parsing and business rules in callable functions, mock external boundaries, and run the same test command locally and in CI.',
  'The pipeline checks out a commit, installs dependencies, runs tests, and packages an artifact. AWS STS validates the GitHub OIDC trust and returns temporary credentials. Lambda receives a separate execution role for runtime API calls.'
];

const notes = Object.fromEntries(topics.map((topic, index) => [topic.slug, {
  simpleExplanation: explanations[index],
  coreConceptsJson: JSON.stringify(concepts[topic.slug].map(([term, definition]) => ({ term, definition }))),
  internalsExplanation: internals[index],
  cliExamplesJson: JSON.stringify([
    { command: index === 3 ? 'sam validate && sam build' : 'python --version', explanation: index === 3 ? 'Validate and package a SAM project locally without deploying AWS resources.' : 'Check the interpreter before running the exercise.' },
    { command: 'python -m pytest -q', explanation: 'Run the project test suite when tests have been added.' }
  ]),
  bestPracticesJson: JSON.stringify([
    'Use descriptive names and small functions with clear inputs and outputs.',
    'Keep dependencies isolated and test expected, invalid, and failure cases.',
    'Keep secrets out of source code and logs.'
  ]),
  securityNotes: index === 3 ? 'Never commit AWS keys. Restrict GitHub OIDC trust to the expected repository and branch, scope IAM permissions to required resources, and use temporary credentials.' : 'Do not put passwords, API keys, or AWS credentials in source code. Treat external input as untrusted.',
  costImplications: index === 3 ? 'The local test path is free. AWS deployment can create billable API Gateway, Lambda, DynamoDB, logs, or data-transfer usage. Set a budget and delete the stack when finished.' : 'These exercises run locally and do not create AWS resources.',
  commonMistakesJson: JSON.stringify([
    'Catching every exception and hiding the original problem.',
    'Testing cloud integrations with production credentials instead of mocks or a dedicated sandbox.'
  ]),
  quickRevisionJson: JSON.stringify([
    topic.keyTakeaway,
    'Run the same tests locally and in CI before deployment.',
    'Use temporary credentials and least-privilege access for cloud automation.'
  ])
}]));

const labs = Object.fromEntries(topics.map((topic, index) => [topic.slug, {
  title: `Python Lab ${index + 1}: ${topic.title}`,
  level: topic.difficulty,
  estimatedMinutes: 25 + index * 5,
  freeTierEligible: true,
  costRiskLevel: 'LOW',
  paidAlternativeWarning: index === 3 ? 'Local simulation is free. Optional AWS deployment may create billable resources; review costs and cleanup first.' : null,
  prerequisites: index === 0 ? 'Python 3.10+ and a terminal.' : 'Python 3.10+, a terminal, and the previous Python lesson.',
  requiredPermissions: index === 3 ? 'No permissions for local work. For optional deployment, use a dedicated IAM role scoped to project resources.' : 'None. Local exercise only.',
  cleanupGuide: index === 3 ? 'Delete the project CloudFormation stack and verify API Gateway, Lambda, DynamoDB, and log groups are removed.' : 'No cloud resources are created; remove the local exercise directory when finished.',
  safeSimulationScript: `echo "Python learning lab ${index + 1}: ${topic.title}"\necho "Local simulation only; no cloud resources are created."`,
  steps: [{
    stepNumber: 1,
    title: ['Create a resource inventory', 'Split logic into a function', 'Create an isolated test environment', 'Review the AWS deployment boundary'][index],
    description: [
      'Represent two cloud resources as dictionaries in a list and filter the list to show only development resources.',
      'Write a function that reads JSON and handles a missing file with a clear, predictable result.',
      'Create a virtual environment and add a pytest test for expected and invalid input.',
      'Review the project template and identify the Lambda runtime role, deployment role, and resources that may incur cost.'
    ][index],
    consoleInstruction: index === 3 ? 'Review project files locally. Configure AWS only for an optional deployment, use a dedicated role, and verify your budget before deploying.' : 'Open a terminal in a new exercise folder and create the Python file using your editor.',
    cliCommand: [
      `python - <<'PY'\nresources = [{"name": "api", "environment": "dev"}, {"name": "db", "environment": "prod"}]\nprint([item["name"] for item in resources if item["environment"] == "dev"])\nPY`,
      `python - <<'PY'\nimport json\nfrom pathlib import Path\n\ndef load_json(path):\n    try:\n        return json.loads(Path(path).read_text())\n    except FileNotFoundError:\n        return []\n\nprint(load_json("resources.json"))\nPY`,
      'python -m venv .venv && source .venv/bin/activate && python -m pip install pytest && python -m pytest -q',
      'python -m pytest -q && sam validate && sam build'
    ][index],
    expectedOutput: index === 0 ? 'api' : index === 1 ? '[]' : 'Tests pass; SAM validates and builds locally without deploying AWS resources.',
    verificationTip: index === 3 ? 'Do not run sam deploy until the account, role, and potential costs are understood.' : 'Change one input and verify the result or test changes as expected.',
    troubleshooting: 'Check python --version, confirm the exercise directory, and read the complete error message before changing code.'
  }]
}]));

const pythonModule = {
  moduleNumber: 25,
  title: 'Python for Cloud & DevOps Engineering',
  slug: 'python-for-cloud-devops',
  description: 'Learn Python from the ground up, then use it to test, automate, and deploy a small AWS service through a secure CI/CD workflow.',
  icon: 'code',
  level: 'Beginner',
  topics
};

module.exports = { modules: [pythonModule], notes, labs };