
import { App, Chart } from 'cdk8s';
import { XRayApp, DaemonProtocol, XRayConfig } from "../out/xrayapp";
import { Construct } from "constructs";

class AWSXRayChart extends Chart {
    constructor(scope: Construct, name: string, ) {
        super(scope, name);

        let config: XRayConfig = {
            image: "rnzdocker1/eks-workshop-x-ray-daemon:dbada4c77e6ae10ecf5a7b1c5864aa6522d9fb02",
            ns: "default",
            daemon: {
                daemonProtocol: DaemonProtocol.UDP,
                port: 2000,
                logLevel: "prod"
            }
        }

        new XRayApp(this, 'prod', config)
    }
}

const app = new App();
new AWSXRayChart(app, 'cdk8s-xray');
app.synth();