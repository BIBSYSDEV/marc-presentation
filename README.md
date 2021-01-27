# Marc-presentation
A simple react app

The project consist only of a signle AWS CloudFormation script. It is ment to:
* set up a S3 Bucket and CloudFront distribution.
* set up a pipeline for building and deploying react app updates to the S3 bucket. The pipeline invalidates the CloudFront cache after copy to S3.

Prerequisites (shared resources):
* HostedZone: [sandbox|dev|test|prod].bibs.aws.unit.no
* Create a CodeStarConnection that allows CodePipeline to get events from and read the GitHub repository

  The user creating the connection must have permission to create "apps" i GitHub
* Alert stack with SNS Topic
* ACM certificate created in us-east-1
* SSM Parameter Store Parameters:
  * /marcpresentation/cloudFrontCertificateArn = [certificate Arn from above]
  * /hostedzone/name = [sandbox|dev|test|prod].bibs.aws.unit.no
  * /hostedzone/id = [hosted zone id]
  * /marcpresentation/domainName = marcpresentation.[sandbox|dev|test|prod].bibs.aws.unit.no
  * /alert/topicArn = [SNS Topic ARN]
  * /github-connection = (CodeStarConnections ARN from above)

Bootstrap:
* Create the following CloudFormation stack manually using the AWS Web Console, CLI or API:
  * Stack for pipeline/CICD. This will bootstrap the app stack (template.yml)
    * Template: pipeline.yml
    * Name: marcpresentation-cloudfront-and-pipeline
    * Parameters:
      * GitBranch=develop
      * GitRepo=BIBSYSDEV/marc-presentation
      * PipelineApprovalAction=[Yes|No] (No for non-prod?)
      * (Optional) PipelineApprovalEmail=[email address]


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
