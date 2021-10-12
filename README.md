# Marc-presentation

A simple react app

The project consist only of a single AWS CloudFormation script. It is meant to:

- set up a S3 Bucket and CloudFront distribution.
- set up a pipeline for building and deploying react app updates to the S3 bucket. The pipeline invalidates the CloudFront cache after copy to S3.

Prerequisites (shared resources):

- HostedZone: [sandbox|dev|test|prod].bibs.aws.unit.no
- Create a CodeStarConnection that allows CodePipeline to get events from and read the GitHub repository

  The user creating the connection must have permission to create "apps" i GitHub

- Alert stack with SNS Topic (name: alert-topic)
- ACM certificate stack created in us-east-1 (name: acm-cert-marcpresentation)
- SSM Parameter Store Parameters:
  - /marcpresentation/cloudFrontCertificateArn = [certificate Arn from above]
  - /hostedzone/name = [sandbox|dev|test|prod].bibs.aws.unit.no
  - /hostedzone/id = [hosted zone id]
  - /marcpresentation/domainName = marcpresentation.[sandbox|dev|test|prod].bibs.aws.unit.no
  - /github-connection = (CodeStarConnections ARN from above)

Bootstrap:

- Create the following CloudFormation stack manually using the AWS Web Console, CLI or API:
  - Stack for pipeline/CICD. This will bootstrap the app stack (template.yml)
    - Template: pipeline.yml
    - Name: marcpresentation-cloudfront-and-pipeline
    - Parameters:
      - GitBranch=develop|master|main
      - GitRepo=BIBSYSDEV/marc-presentation
      - PipelineApprovalAction=[Yes|No] (No for non-prod?)
      - (Optional) PipelineApprovalEmail=[email address]

# Environment variables

The following environment variables are used in this project
`REACT_APP_ALMA_API_URL=https://api.sandbox.bibs.aws.unit.no/alma`
`REACT_APP_AUTHORITY_API_URL=https://api.sandbox.bibs.aws.unit.no/authority`

## Available Scripts

In the project directory, you can run:

### `npm start`

### `npm run start:development`

### `npm run start:production`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

