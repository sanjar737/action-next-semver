const core = require("@actions/core");
const github = require("@actions/github");

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

  console.log(github.context);
  console.log(semver.split("."));

  const labels = github.context.payload.pull_request.labels.map(
    (el) => el.name
  );

  for (const version of versionMap) {
    if (labels.includes(version)) {
      command = version;
      break;
    }
  }
} catch (error) {
  core.setFailed(error.message);
}
