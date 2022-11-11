const core = require("@actions/core");
const { getOctokit } = require("@actions/github");
const { inspect } = require("util");
const { unified } = require('unified');
const remarkParse = require('remark-parse');

async function run() {
  const { token, repository, issue_number } = process.env;
  const oktokit = getOctokit(token);

  const [owner, repo] = repository.split("/");
  const result = await oktokit.rest.issues.get({
    owner,
    repo,
    issue_number
  });

  const data = await unified()
    .use(remarkParse)
    .process(result.data.body)

  core.debug(inspect(data));
}

try {
  void run();
} catch (error) {
  core.setFailed(error.message);
}
