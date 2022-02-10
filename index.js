const core = require("@actions/core");
const github = require("@actions/github");
const { inc } = require("semver");

try {
  const githubToken = core.getInput("github-token", { required: true });
  const semver = core.getInput("semver");
  const octokit = github.getOctokit(githubToken);
  const versionMap = [
    "major",
    "minor",
    "patch",
    "premajor",
    "preminor",
    "prepatch",
    "prerelease",
  ];
  let command = "";

  const labels = github.context.payload.pull_request.labels.map(
    (el) => el.name
  );

  for (const version of versionMap) {
    if (labels.includes(version)) {
      command = version;
      break;
    }
  }

  if (!command) {
    throw new Error("semver label not found");
  }

  const nextSemver = inc(semver, command);

  if (!nextSemver) {
    throw new Error("failed to get next semver");
  }

  octokit.rest.pulls.update({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.payload.pull_request.number,
    title: `Release v${nextSemver}`,
  });
} catch (error) {
  core.setFailed(error.message);
}
