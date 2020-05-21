import { Construct } from 'constructs';
import { Service } from '../../imports/k8s';
import { IChartConfig, DaemonProtocol } from '../../xrayapp'

export class ServiceConstruct extends Construct {
    config: IChartConfig;

    constructor(scope: Construct, name: string, config: IChartConfig) {
        super(scope, name)

        this.config = config;
    }

    CreateService(): Service {

        return new Service(this, "xray-service", {
            metadata: {
                name: "xray-service"
            },
            spec: {
                selector: {
                    "app": "xray-daemon",
                    "cdk8s/chart": "xray"
                },
                clusterIP: "None",
                ports: [
                    {
                        name: "incoming",
                        port: this.config.daemon.port,
                        protocol: DaemonProtocol[this.config.daemon.daemonProtocol]
                    }
                ]
            }
        });
    }
}