## AWS X-Ray [cdk8s](cdk8s.io/) construct

[![NPM Version](https://img.shields.io/npm/v/cdk8s-xray.svg)](https://npmjs.org/package/cdk8s-xray) 


**Cluster Prerequisites**

 Attach [AWSXrayDaemonWriteAccess](https://docs.aws.amazon.com/xray/latest/devguide/security_iam_id-based-policy-examples.html) to worker node instance profile

    `aws iam attach-role-policy --role-name $ROLE_NAME --policy-arn arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess`

### Installation and Usage

Install `cdk8s-xray` construct: `npm install cdk8s-xray` and add below to chart

``` nodejs
import { XRayApp, DaemonProtocol, IChartConfig } from 'cdk8s-xray'

// inside your chart:
let config: IChartConfig = {
    image: "rnzdocker1/eks-workshop-x-ray-daemon:dbada4c77e6ae10ecf5a7b1c5864aa6522d9fb02",
    ns: "default",
    daemon: {
        daemonProtocol: DaemonProtocol.UDP,
        port: 2000,
        logLevel: "prod"
    }
}

new XRayApp(this, 'prod', config);
```

### Features

### Release Notes:
Initial Release, Contributions welcome

### License:
Apache-2.0