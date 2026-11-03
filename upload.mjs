#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';

const USAGE = `
Usage:
  node upload.mjs --base <url> --space <id> --clientId <id> --clientSecret <secret> --junit <path> --zip <path>

Arguments:
  --base          Tosca Cloud base URL, no trailing slash
                  e.g. https://<tenant>.my.tricentis.com
  --space         Space (workspace) id, or "default" for the tenant's Default workspace
                  e.g. default
  --clientId      API client id (client_credentials grant)
  --clientSecret  API client secret
  --junit         Path to the JUnit XML file produced by Playwright
                  e.g. results.xml
  --zip           Path to the blob reporter zip produced by Playwright
                  e.g. blob-report/report.zip
`;

const { values } = parseArgs({
  options: {
    base:         { type: 'string' },
    space:        { type: 'string' },
    clientId:     { type: 'string' },
    clientSecret: { type: 'string' },
    junit:        { type: 'string' },
    zip:          { type: 'string' },
  },
});

const missing = ['base', 'space', 'clientId', 'clientSecret', 'junit', 'zip'].filter((k) => !values[k]);
if (missing.length > 0) {
  console.error(`Missing required arguments: ${missing.join(', ')}`);
  console.error(USAGE);
  process.exit(1);
}

async function getAccessToken(base, clientId, clientSecret) {
  const authorityResp = await fetch(`${base}/oidc/authority`);
  if (!authorityResp.ok) {
    throw new Error(`GET ${base}/oidc/authority failed: ${authorityResp.status} ${authorityResp.statusText}`);
  }
  const authorityRaw = await authorityResp.text();
  const authority = (() => {
    try {
      const parsed = JSON.parse(authorityRaw);
      return typeof parsed === 'string' ? parsed : parsed.authority;
    } catch {
      return authorityRaw.trim();
    }
  })();

  const discoveryResp = await fetch(`${authority.replace(/\/$/, '')}/.well-known/openid-configuration`);
  if (!discoveryResp.ok) {
    throw new Error(`OIDC discovery failed: ${discoveryResp.status} ${discoveryResp.statusText}`);
  }
  const { token_endpoint } = await discoveryResp.json();

  const tokenResp = await fetch(token_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'tta',
    }),
  });
  if (!tokenResp.ok) {
    const body = await tokenResp.text().catch(() => '(no body)');
    throw new Error(`Token request failed: ${tokenResp.status} ${tokenResp.statusText}\n${body}`);
  }
  const { access_token } = await tokenResp.json();
  return access_token;
}

function stripJUnitXml(xml) {
  let out = xml.replace(/<system-(?:out|err)>[\s\S]*?<\/system-(?:out|err)>/g, '');

  // The backend only reads the "message" attribute on <failure>/<error> (falling back to the element's
  // text only when that attribute is missing), so the CDATA stack traces, call logs, and attachment
  // markers are dead weight, and Playwright's call-log lines embed literal HTML that trips the WAF.
  out = out.replace(/<(failure|error)\b([^>]*)>([\s\S]*?)<\/\1>/g, (_match, tag, attrs, body) => {
    const hasMessage = /\bmessage\s*=\s*(?:"[^"]*[^"\s][^"]*"|'[^']*[^'\s][^']*')/.test(attrs);
    if (hasMessage) return `<${tag}${attrs}></${tag}>`;

    const text = body.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
    const firstLine = text.split('\n').map((l) => l.trim()).find((l) => l.length > 0) || '';
    const escaped = firstLine
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .slice(0, 200);
    return `<${tag}${attrs} message="${escaped}"></${tag}>`;
  });

  return out;
}

const base  = values.base.replace(/\/$/, '');
const space = values.space.replace(/ /g, '_');
const url   = `${base}/${space}/_playlists/api/v2/runInfo/external`;

console.log('Step 1/3  Requesting access token…');
const token = await getAccessToken(base, values.clientId, values.clientSecret);

console.log('Step 2/3  Creating run info…');

const rawJunitXml = await readFile(values.junit, 'utf8');
const junitXml = stripJUnitXml(rawJunitXml);
console.log(`          stripped junit body from ${rawJunitXml.length} to ${junitXml.length} bytes (attachments, stack traces, and call logs aren't read by the backend, and the report viewer reads the zip instead)`);

const createResp = await fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/xml',
  },
  body: junitXml,
});

if (!createResp.ok) {
  const body = await createResp.text().catch(() => '(no body)');
  console.error(`POST ${url} failed: ${createResp.status} ${createResp.statusText}`);
  console.error(body);
  process.exit(1);
}

const { runInfoId, uploadUrl } = await createResp.json();
console.log(`          runInfoId = ${runInfoId}`);

console.log('Step 3/3  Uploading report zip…');

const { size } = await stat(values.zip);
const putResp = await fetch(uploadUrl, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/zip',
    'x-ms-blob-type': 'BlockBlob',
    'Content-Length': String(size),
  },
  body: createReadStream(values.zip),
  duplex: 'half',
});

if (!putResp.ok) {
  const body = await putResp.text().catch(() => '(no body)');
  console.error(`PUT upload failed: ${putResp.status} ${putResp.statusText}`);
  console.error(body);
  process.exit(1);
}

console.log(`\nDone! Open your runs list:`);
console.log(`  ${base}/_portal/space/${space}/runs`);
