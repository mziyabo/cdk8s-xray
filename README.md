## AWS X-Ray [cdk8s](cdk8s.io/) construct
Provides a cdk8s Construct to synthesize [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) api-resources on Amazon EKS clusters

![Build](https://github.com/mziyabo/cdk8s-xray/workflows/Build/badge.svg?branch=master) 
[![NPM Version](https://img.shields.io/npm/v/cdk8s-xray.svg)](https://npmjs.org/package/cdk8s-xray) 


### Installation and Usage

Install `cdk8s-xray` construct from `npm` or `yarn`: 

```
npm install -s cdk8s-xray
```

Usage:

``` typescript
import { XRayApp, DaemonProtocol, XRayConfig } from 'cdk8s-xray'

// inside your chart:
let config: XRayConfig = {
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

### Features:
- Adapted from the [EKS Workshop X-Ray](https://eksworkshop.com/intermediate/245_x-ray/x-ray-daemon/). A few `cdk8s` quirks make the generated manifest different though:

    <details>
    <summary>manifest.k8s.yaml</summary>
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    metadata:
    name: xray-prod-clusterrolebinding-xray-daemon-b962136e
    roleRef:
    apiGroup: rbac.authorization.k8s.io
    kind: ClusterRole
    name: cluster-admin
    subjects:
    - kind: ServiceAccount
        name: xray-daemon
        namespace: default
    ---
    apiVersion: v1
    kind: Service
    metadata:
    name: xray-service
    spec:
    clusterIP: None
    ports:
        - name: incoming
        port: 2000
        protocol: UDP
    selector:
        app: xray-daemon
        cdk8s/chart: xray
    ---
    apiVersion: v1
    kind: ServiceAccount
    metadata:
    labels:
        app: xray-daemon
        cdk8s/chart: xray
    name: xray-daemon
    namespace: default
    ---
    apiVersion: apps/v1
    kind: DaemonSet
    metadata:
    name: xray-prod-daemonset-xray-daemon-fcac88af
    spec:
    selector:
        matchLabels:
        app: xray-daemon
        cdk8s/chart: xray
    template:
        metadata:
        labels:
            app: xray-daemon
            cdk8s/chart: xray
        spec:
        containers:
            - command:
                - /usr/bin/xray
                - -c
                - /aws/xray/config.yaml
            image: rnzdocker1/eks-workshop-x-ray-daemon:dbada4c77e6ae10ecf5a7b1c5864aa6522d9fb02
            imagePullPolicy: Always
            name: xray-daemon
            ports:
                - containerPort: 2000
                hostPort: 2000
                name: xray-ingest
                protocol: UDP
            resources:
                limits:
                memory: 24Mi
            volumeMounts:
                - mountPath: /aws/xray
                name: config-volume
                readOnly: true
        hostNetwork: true
        volumes:
            - configMap:
                name: xray-config
            name: config-volume
    updateStrategy:
        type: RollingUpdate
    ---
    apiVersion: v1
    data:
    config.yaml: >-
        # Maximum buffer size in MB (minimum 3). Choose 0 to use 1% of host memory. 

        TotalBufferSizeMB: 0

        # Maximum number of concurrent calls to AWS X-Ray to upload segment documents.

        Concurrency: 8

        # Send segments to AWS X-Ray service in a specific region

        Region: ""

        # Change the X-Ray service endpoint to which the daemon sends segment documents.

        Endpoint: ""

        Socket:
        # Change the address and port on which the daemon listens for UDP packets containing segment documents.
        # Make sure we listen on all IP's by default for the k8s setup
        UDPAddress: 0.0.0.0:2000
        Logging:
        LogRotation: true
        # Change the log level, from most verbose to least: dev, debug, info, warn, error, prod (default).
        LogLevel: prod
        # Output logs to the specified file path.
        LogPath: ""
        # Turn on local mode to skip EC2 instance metadata check.

        LocalMode: false

        # Amazon Resource Name (ARN) of the AWS resource running the daemon.

        ResourceARN: ""

        # Assume an IAM role to upload segments to a different account.

        RoleARN: ""

        # Disable TLS certificate verification.

        NoVerifySSL: false

        # Upload segments to AWS X-Ray through a proxy.

        ProxyAddress: ""

        # Daemon configuration file format version.

        Version: 1
    kind: ConfigMap
    metadata:
    name: xray-config

    </details>

### Release Notes:
Initial Release, Contributions welcome

### License:
Apache-2.0