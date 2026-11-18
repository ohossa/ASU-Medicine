import { getR2Client, getR2Json, getR2BucketName } from '../server/r2-client.js';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

async function verifyR2() {
  const r2 = getR2Client();
  if (!r2) throw new Error('R2 not configured');

  const bucket = getR2BucketName();
  console.log('Listing objects in R2 bucket:', bucket);

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: 'users/',
  });

  const response = await r2.send(command);
  const count = response.KeyCount || 0;
  console.log(`✅ Total student progress files in Cloudflare R2: ${count}`);

  if (response.Contents && response.Contents.length > 0) {
    const sampleKey = response.Contents[0].Key!;
    console.log(`Sample key: ${sampleKey}`);
    const sampleData = await getR2Json(sampleKey);
    console.log('Sample progress data keys:', Object.keys(sampleData.data || {}));
    console.log('Sample year preference:', sampleData.data?.asu_portal_year);
  }
}

verifyR2().catch(console.error);
