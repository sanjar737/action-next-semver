const core = require("@actions/core");
const github = require("@actions/github");
const { inc } = require("semver");

try {
  const githubToken = core.getInput("github-token", { required: true });
  const semver = core.getInput("semver");
  const octokit = github.getOctokit(githubToken);
  const tags = [
    "major",
    "minor",
    "patch",
    "premajor",
    "preminor",
    "prepatch",
    "prerelease",
  ];
  let selectedTag = null;

  const labels = github.context.payload.pull_request.labels.map(
    (el) => el.name
  );

  for (const tag of tags) {
    if (labels.includes(tag)) {
      selectedTag = tag;
      break;
    }
  }

  if (!selectedTag) {
    throw new Error("semver label not found");
  }

  const nextSemver = inc(semver, selectedTag);

  if (!nextSemver) {
    throw new Error("failed to get next semver");
  }

  octokit.rest.pulls.update({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.payload.pull_request.number,
    title: `Release v${nextSemver}`,
  });

  core.setOutput("next-semver", version);
} catch (error) {
  core.setFailed(error.message);
}
