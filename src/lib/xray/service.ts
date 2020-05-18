import { Construct } from 'constructs';
import { Service } from '../../imports/k8s';
import { appConfig } from '../shared/appconfig';

export class XRService extends Construct {

    constructor(scope: Construct, name: string) {
        super(scope, name)

        this.CreateService(this);
    }

    CreateService(scope: Construct): Service {

        return new Service(scope, "xray-service", {
            metadata: {
                labels: {
                    "name": "xray-service"
                }
            },
            spec: {
                selector: {
                    "app": "xray-daemon"
                },
                clusterIP: "None",
                ports: [
                    {
                        name: "incoming",
                        port: appConfig.daemonSettings.UDPPort,
                        protocol: "UDP"
                    }
                ]
            }
        });
    }
}