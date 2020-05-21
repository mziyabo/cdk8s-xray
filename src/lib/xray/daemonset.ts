import { Construct } from 'constructs';
import { DaemonSet, Container } from '../../imports/k8s';
import { IChartConfig, DaemonProtocol } from '../../xrayapp';

export class DaemonSetConstruct extends Construct {
    config: IChartConfig;

    constructor(scope: Construct, name: string, config: IChartConfig) {
        super(scope, name)

        this.config = config;
    }

    CreateDaemonSet(): DaemonSet {

        let appLabel = {
            "app": "xray-daemon",
            "cdk8s/chart": "xray"
        };

        let daemonContainer: Container = {
            name: "xray-daemon",
            image: this.config.image,
            imagePullPolicy: "Always",
            command: ["/usr/bin/xray", "-c", "/aws/xray/config.yaml"],
            resources: {
                limits: {
                    memory: "24Mi"
                }
            },
            ports: [{
                name: "xray-ingest",
                containerPort: this.config.daemon.port,
                hostPort: this.config.daemon.port,
                protocol: DaemonProtocol[this.config.daemon.daemonProtocol]
            }],
            volumeMounts: [{
                name: "config-volume",
                mountPath: "/aws/xray",
                readOnly: true
            }]
        };

        return new DaemonSet(this, "xray-daemon", {
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