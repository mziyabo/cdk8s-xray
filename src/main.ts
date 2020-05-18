import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { XRClusterRoleBinding } from './lib/xray/clusterrolebinding';
import { XRConfigMap } from './lib/xray/configmap';
import { XRDaemonSet } from './lib/xray/daemonset';
import { XRService } from './lib/xray/service';
import { XRServiceAccount } from './lib/xray/serviceaccount';

class AWSXRayChart extends Chart {
  constructor(scope: Construct, name: string, ) {
    super(scope, name);

    // define resources here

    new XRClusterRoleBinding(this, "clusterrolebinding");
    new XRConfigMap(this, "configmap");
    new XRDaemonSet(this, "daemonset");
    new XRService(this, "service");
    new XRServiceAccount(this, "serviceaccount");

  }
}

const app = new App();
new AWSXRayChart(app, 'xrayk8s');
app.synth();
