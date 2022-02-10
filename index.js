const core = require("@actions/core");
const github = require("@actions/github");
const { inc } = require("semver");

try {
  const version = core.getInput("version");
  const tags = [
    "major",
    "minor",
    "patch",
    "premajor",
    "preminor",
    "prepatch",
    "prerelease",
  ];
  let nextVersion = version;

  const labels = github.context.payload.pull_request.labels.map(
    (el) => el.name
  );

  for (const tag of tags) {
    if (labels.includes(tag)) {
      nextVersion = inc(nextVersion, tag);
    }
  }

  if (nextVersion === version) {
    throw new Error("semantic version tag label not found");
  }

  core.setOutput("next-version", nextVersion);
} catch (error) {
  core.setFailed(error.message);
}
