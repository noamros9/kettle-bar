#!/usr/bin/env node
/* Decision 128: was the tree pushed to main already tested on its PR? Writes tested=true|false to $GITHUB_OUTPUT.
   A squash merge of an up-to-date PR leaves main on the exact tree the PR's Test and deploy run tested; then main
   builds and deploys without running the tests again. Anything else (another tree, a red run, no PR, an API error)
   tests as usual. */
const fs = require('fs');

const decide = ({ tree, prTree, prRunGreen }) => !!tree && tree === prTree && prRunGreen;

const tested = async (api, sha) => {
  try {
    const [pr] = await api(`commits/${sha}/pulls`);
    if (!pr) return false;
    const head = pr.head.sha;
    const [main, prHead, runs] = await Promise.all([api(`commits/${sha}`), api(`commits/${head}`), api(`actions/runs?head_sha=${head}&event=pull_request`)]);
    const prRunGreen = runs.workflow_runs.some((r) => r.name === 'Test and deploy' && r.conclusion === 'success');
    return decide({ tree: main.commit.tree.sha, prTree: prHead.commit.tree.sha, prRunGreen });
  } catch (e) {
    console.log(`tested-tree: ${e.message}; testing as usual`);
    return false;
  }
};

module.exports = { decide, tested };

if (require.main === module) {
  const { GITHUB_REPOSITORY: repo, GITHUB_SHA: sha, GH_TOKEN: token, GITHUB_OUTPUT: out } = process.env;
  const api = async (p) => {
    const res = await fetch(`https://api.github.com/repos/${repo}/${p}`, { headers: { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json' } });
    if (!res.ok) throw new Error(`${p}: HTTP ${res.status}`);
    return res.json();
  };
  tested(api, sha).then((t) => {
    console.log(t ? 'This tree passed on its PR: build and deploy only.' : 'Not tested on a PR: running the tests.');
    fs.appendFileSync(out, `tested=${t}\n`);
  });
}
