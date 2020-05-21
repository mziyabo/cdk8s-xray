import { Construct } from 'constructs';
import { ServiceAccount } from '../../imports/k8s';
import { IChartConfig } from '../../xrayapp'

export class ServiceAccountConstruct extends Construct {

    config: IChartConfig;

    constructor(scope: Construct, name: string, config: IChartConfig) {
        super(scope, name)
        this.config = config;
    }

    CreateServiceAccount(): ServiceAccount {

        let appLabel = {
            "app": "xray-daemon",
            "cdk8s/chart": "xray"
        };

        return new ServiceAccount(this, "xray-daemon", {
            metadata: {
                name: "xray-daemon",
                labels: appLabel,
                namespace: this.config.ns
            }
        });
    }
}