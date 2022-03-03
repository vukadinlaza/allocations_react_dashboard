/* eslint-disable @typescript-eslint/no-var-requires */
// Load the AWS SDK
const AWS = require('aws-sdk');
const fs = require('fs/promises');

const region = 'us-east-1';
const secretName =
  'arn:aws:secretsmanager:us-east-1:046746691294:secret:allocations_react_dashboard/development-cqi5Vj';

const client = new AWS.SecretsManager({
  region,
});

(async () => {
  const { SecretString } = await client.getSecretValue({ SecretId: secretName }).promise();
  const secret = JSON.parse(SecretString);

  fs.writeFile(
    './.env.local',
    Object.entries(secret)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n'),
  );
})();
