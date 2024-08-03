# s3-with-versioning
Pulumi infrastructure as code for create an aws s3 bucket with versioning

### Create a s3 bucket
1. create a configs.yaml file with required values in the repository root
2. execute `pulumi install --local` in terminal
3. execute `pulumi install` in terminal
4. execute `export PULUMI_CONFIG_PASSPHRASE=<your passphrase>` in terminal
5. execute `export AWS_REGION=<required aws region>` in terminal
6. execute `pulumi stack init <stack name>` in terminal
7. execute `pulumi preview --json` in terminal (optional)
8. execute `pulumi up --yes` in terminal

### Destroy created s3 bucket
1. execute `export PULUMI_CONFIG_PASSPHRASE=<your passphrase>` in terminal
2. execute `export AWS_REGION=<required aws region>` in terminal
3. execute `pulumi destroy --yes` in terminal

### Configs.yaml file format
```yaml
BUCKET_NAME: <name of the bucket>
PUBLIC_ACCESS_BLOCK: <need to block public access>
NEWER_NON_CURRENT_VERSION: <newer non-current version count to retain>
NON_CURRENT_DAYS: <expiration days of other non-current versions>
TAGS: <map of tags as key value pairs>
```

### Example configs.yaml file
```yaml
BUCKET_NAME: "test-s3"
PUBLIC_ACCESS_BLOCK: "true"
NEWER_NON_CURRENT_VERSION: 3
NON_CURRENT_DAYS: 1
TAGS:
    Name: "test-instance"
    Type: "private"
    Version: "v1.0.0"
```
