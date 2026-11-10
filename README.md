# Demo Web Shop E2E Suite

Playwright regression suite covering the 20 most critical user flows on
[demowebshop.tricentis.com](https://demowebshop.tricentis.com/), wired up so a
Tosca Cloud test case can trigger it and get the Playwright results back into the
Tosca Cloud runs viewer.

| Folder | Flows |
| --- | --- |
| `tests/account/` | register, log in, invalid login, log out, edit account info, add address, newsletter, order history |
| `tests/shopping/` | browse category, search, view product, add to cart (list and detail page), update quantity, remove from cart, coupon code, compare products, product review |
| `tests/checkout/` | guest checkout, registered-user checkout |

Page objects live in `pages/`, shared fixtures and test data in `fixtures/`.

## Setup

Requires Node.js 18+ (only for running locally; the Tosca Cloud flow runs everything
on GitHub Actions).

```bash
npm install
npx playwright install chromium
```

## Running

```bash
npm test              # headless
npm run test:headed   # headed
npm run test:ui       # Playwright UI mode
npm run report        # open the last HTML report
```

Tests run against the live `https://demowebshop.tricentis.com` site — each
run registers fresh, unique accounts and places real orders, so no shared
test data or setup step is required.

## Intentional demo failures

Every run deliberately fails 1–5 randomly chosen tests, so the results in Tosca Cloud
always contain failure evidence (screenshots, video, trace) to look at.
[`global-setup.ts`](global-setup.ts) picks the tests and logs them at the start of the run:

```
[demo-chaos] Intentionally failing 3 test(s) this run:
```

The selected tests still run all their real steps, then fail with
`Injected demo failure: "<test title>" was randomly selected by demo-chaos …`.
Any failure without that message is a real one.

To turn it off, remove the `globalSetup` line from
[`playwright.config.ts`](playwright.config.ts), and delete the `.demo-chaos.json` a previous
local run may have left behind (the fixture still reads it if it exists).

## Running from Tosca Cloud

### How it works

1. Add the Run GitHub Workflow module to your test case.
2. The Run GitHub Workflow module triggers the GitHub Actions workflow
   [`.github/workflows/playwright-tosca.yml`](.github/workflows/playwright-tosca.yml).
3. The Playwright test cases will get executed.
4. [`upload.mjs`](upload.mjs) posts the JUnit results and the Playwright blob report zip to Tosca Cloud.
5. The run shows up in the Tosca Cloud runs viewer.

There's **nothing to install on the execution agent** — no GitHub CLI, no `gh auth login`,
no Node.js, no checkout of this repo. The GitHub personal access token entered in the
Run GitHub Workflow module is all it needs.

### Prerequisites

1. **Tosca Cloud API client** — a client id / client secret pair with the `tta` scope,
   used by `upload.mjs` (see below).
2. **Workspace id** — the workspace (also called space) to upload results to. It's visible
   in the URL when you open the workspace in Tosca Cloud. To target your tenant's
   **Default workspace**, use the literal string `default`, not the display name shown in the UI.
3. **GitHub personal access token** — a
   [fine-grained token](https://github.com/settings/personal-access-tokens/new) scoped to
   your copy of this repo with the **Actions: Read and write** repository permission.

#### Getting a client id and client secret

The upload authenticates with an OAuth2 `client_credentials` grant: no browser session,
no personal login, no token to copy or refresh by hand. The workflow exchanges the
client id and secret for a short-lived access token on every run.

1. Open your tenant's Identity API swagger page, replacing `<your-tenant>` and
   `<your-environment>` with your own values:
   `https://<your-tenant>.<your-environment>.tricentis.com/_identity/apiDocs/swagger/index.html`
2. Click **Authorize** in the top right. In the dialog, check the **Scopes** checkbox for
   `tta` before authorizing, then sign in with your Tosca Cloud account.
3. Expand and call **Get all applications** (`GET /_identity/api/v1/applications`) via
   "Try it out" → "Execute". In the response, find the application you want to use — for
   most tenants this is the built-in service account, whose `id` field is literally the
   string `Tricentis_Cloud_API` (not a generated GUID). If you registered a custom client
   instead, copy its own `id`. Either way, that value is your **client id**.
4. Expand and call **List application secrets**
   (`GET /_identity/api/v1/applications/{id}/secrets`), pasting the `id` from the
   previous step into the `id` parameter. Execute it and copy the returned `clientSecret`
   value — this is your **client secret**.

> Treat the client secret like a password. Store it as a GitHub Actions secret, never in a
> committed file.

### Setup

1. **Fork or copy this repo** into your own GitHub account or organization. The workflow
   runs on `ubuntu-stepsecurity-x64`, a runner that's only available inside the Tricentis
   GitHub enterprise. Anywhere else, change `runs-on` in
   [`.github/workflows/playwright-tosca.yml`](.github/workflows/playwright-tosca.yml) to a
   runner you can use, e.g. `ubuntu-latest`, or the run waits for a runner that never picks it up.
2. **Add repository secrets** under **Settings → Secrets and variables → Actions → Secrets**:
   - `TOSCA_CLOUD_CLIENT_ID` — the client id from above
   - `TOSCA_CLOUD_CLIENT_SECRET` — the client secret from above
3. **Add repository variables** under **Settings → Secrets and variables → Actions → Variables**:
   - `TOSCA_BASE_URL` — your Tosca Cloud base URL without a trailing slash,
     e.g. `https://<your-tenant>.my.tricentis.com`
   - `TOSCA_SPACE` — the workspace id, or `default`
4. **Add the Run GitHub Workflow module to a test case.** In Tosca Cloud, add **Run GitHub Workflow**
   (under **Standard objects → Automation tools modules → GitHub**) to a test case and fill in:
   - the repository path, e.g. `<your-org>/<your-repo>`
   - the workflow file name: `playwright-tosca.yml`
   - your GitHub personal access token
5. **Run the test case.** The workflow run appears under your repo's **Actions** tab, and
   once it finishes, the Playwright results show up in the Tosca Cloud runs viewer.

The workflow only runs on demand (`workflow_dispatch`). You can also start it by hand from
the **Actions** tab, and optionally override `tosca_base_url` / `tosca_space` for that run.

### Uploading a local run

`upload.mjs` works outside GitHub Actions too. After a local `npm test`, publish the
results to Tosca Cloud with:

```bash
node upload.mjs --base "https://<your-tenant>.my.tricentis.com" --space "<workspace-id>" --clientId "<client-id>" --clientSecret "<client-secret>" --junit results.xml --zip blob-report/report.zip
```

### Troubleshooting

| Error | Cause & fix |
| --- | --- |
| Run GitHub Workflow fails with 401 | The personal access token is wrong or expired. Create a new one and update it in the module. |
| Run GitHub Workflow fails with 403 or 404 | The token can't access the repo or lacks the **Actions: Read and write** permission. Check its resource owner, its repository access, and whether it's still pending approval by your organization. Also check the repository and workflow file name in the module. |
| Workflow run stays queued, or is canceled before any step runs | The runner in `runs-on` isn't available to your repo or is blocked by your organization's policy. See Setup step 1. |
| Upload step fails with `Missing required arguments` | The secrets or variables aren't set, or aren't set as repository-level Actions secrets and variables. See Setup steps 2 and 3. |
| Nothing shows up in the runs viewer | Check that the `TOSCA_BASE_URL` / `TOSCA_SPACE` variables match the tenant and workspace you're looking at. Also check the upload step in the GitHub Actions run log: a 401 usually means the client id/secret is wrong or missing the `tta` scope; a 404 usually means Playwright run uploads aren't enabled for that workspace yet. |

## Contributions

This repository doesn't accept external contributions: please don't open issues or pull
requests. You're welcome to fork it and adapt it under the terms of the license.
To report a security vulnerability, see [`SECURITY.md`](SECURITY.md).

## License

[Apache License 2.0](LICENSE)
