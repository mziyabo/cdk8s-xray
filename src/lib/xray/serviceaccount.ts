import { Construct } from 'constructs';
import { ServiceAccount } from '../../imports/k8s';
import { XRayConfig } from '../../xrayapp'

export class ServiceAccountConstruct extends Construct {

    config: XRayConfig;

    constructor(scope: Construct, name: string, config: XRayConfig) {
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