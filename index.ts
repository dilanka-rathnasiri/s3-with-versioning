import * as aws from "@pulumi/aws";
import {BucketLifecycleConfigurationV2, BucketPublicAccessBlock, BucketV2, BucketVersioningV2} from "@pulumi/aws/s3";
import * as yaml from "js-yaml";
import * as fs from "fs/promises";

const stack = async (): Promise<void> => {
    const f: string = await fs.readFile("configs.yaml", "utf-8");
    const configs: Record<string, any> = yaml.load(f) as Record<string, any>;

    const bucket: BucketV2 = new aws.s3.BucketV2(configs.BUCKET_NAME, {
        bucket: configs.BUCKET_NAME,
        tags: {
            Name: configs.BUCKET_NAME,
            ...configs.TAGS,
        },
    });

    const bucketPublicAccessBlock: BucketPublicAccessBlock = new aws.s3.BucketPublicAccessBlock("bucket-public-access-block", {
        bucket: bucket.id,
        blockPublicAcls: (configs.PUBLIC_ACCESS_BLOCK.toLowerCase() === "true"),
        blockPublicPolicy: (configs.PUBLIC_ACCESS_BLOCK.toLowerCase() === "true"),
        ignorePublicAcls: (configs.PUBLIC_ACCESS_BLOCK.toLowerCase() === "true"),
        restrictPublicBuckets: (configs.PUBLIC_ACCESS_BLOCK.toLowerCase() === "true"),
    }, {dependsOn: [bucket]});

    const bucketVersioning: BucketVersioningV2 = new aws.s3.BucketVersioningV2("bucket-versioning", {
        bucket: bucket.id,
        versioningConfiguration: {
            status: "Enabled",
        },
    }, {dependsOn: [bucket]});

    const bucketLifecycle: BucketLifecycleConfigurationV2 = new aws.s3.BucketLifecycleConfigurationV2("bucket-lifecycle", {
        bucket: bucket.id,
        rules: [{
            id: "expire-non-current-version",
            status: "Enabled",
            noncurrentVersionExpiration: {
                newerNoncurrentVersions: configs.NEWER_NON_CURRENT_VERSION,
            },
        }],
    }, {dependsOn: [bucket]});

    bucket.arn.apply((arn: string) => {
        console.log(arn)
    });
}

stack();
