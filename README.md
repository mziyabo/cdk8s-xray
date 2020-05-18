## AWS XRay chart built with [cdk8s](cdk8s.io/)
cdk8s defined chart for AWS XRay, a service for tracing and code instrumentation.

### Installation

**Prerequisites**

- EKS NodeGroup requires [AWSXrayDaemonWriteAccess](https://docs.aws.amazon.com/xray/latest/devguide/security_iam_id-based-policy-examples.html)

    `aws iam attach-role-policy --role-name $ROLE_NAME --policy-arn arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess`


To build and deploy the XRay chart:

``` PowerShell
npm run compile
npm run synth
kubectl apply -f ./dist/*.k8s.yaml
```

### Features

**Resources**

|resource|
---------
|Service Account|
|Service|
|Deployment|
|ConfigMap|
|ClusterRoleBinding|

### Release Notes:

### License:
Apache-2.0
