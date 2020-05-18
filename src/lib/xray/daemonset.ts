import { Construct } from 'constructs';
import { DaemonSet, Container } from '../../imports/k8s';

export class XRDaemonSet extends Construct {

    constructor(scope: Construct, name: string) {
        super(scope, name)

        this.CreateDaemonSet(this);
    }

    CreateDaemonSet(scope: Construct): DaemonSet {

        let appLabel = {
            "app": "xray-daemon"
        };

        let daemonContainer: Container = {
            name: "xray-daemon",
            image: "rnzdocker1/eks-workshop-x-ray-daemon:dbada4c77e6ae10ecf5a7b1c5864aa6522d9fb02",
            imagePullPolicy: "Always",
            command: ["/usr/bin/xray", "-c", "/aws/xray/config.yaml"],
            resources: {
                limits: {
                    memory: "24Mi"
                }
            },
            ports: [{
                name: "xray-ingest",
                containerPort: 2000,
                hostPort: 2000,
                protocol: "UDP"
            }],
            volumeMounts: [{
                name: "config-volume",
                mountPath: "/aws/xray",
                readOnly: true
            }]


        };

        return new DaemonSet(scope, "xray-daemon", {
            spec: {
                updateStrategy: {
                    type: "RollingUpdate"
                },
                selector: {
                    matchLabels: appLabel
                },
                template: {
                    metadata: {
                        labels: appLabel
                    },
                    spec: {
                        volumes: [{
                            name: "config-volume",
                            configMap: {
                                name: "xray-config"
                            }
                        }],
                        hostNetwork: true,
                        containers: [daemonContainer]
                    }
                }
            }
        });
    }
}