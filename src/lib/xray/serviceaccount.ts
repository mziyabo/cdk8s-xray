import { Construct } from 'constructs';
import { ServiceAccount } from '../../imports/k8s';
import { appConfig } from '../shared/appconfig';

export class XRServiceAccount extends Construct {

    constructor(scope: Construct, name: string) {
        super(scope, name)

        this.CreateServiceAccount(scope);
    }

    CreateServiceAccount(scope: Construct): ServiceAccount {

        let appLabel = {
            "app": appConfig.app.name
        };

        return new ServiceAccount(scope, "xray-daemon", {
            metadata: {
                name: "xray-daemon",
                labels: appLabel,
                namespace: appConfig.namespace
            }
        });
    }
}