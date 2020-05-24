import { Construct } from 'constructs';
import { ClusterRoleBinding } from '../../imports/k8s';
import { XRayConfig } from '../../xrayapp'

export class ClusterRoleBindingConstruct extends Construct {
    config: XRayConfig;

    constructor(scope: Construct, name: string, config: XRayConfig) {
        super(scope, name)

        this.config = config;
    }

    CreateClusterRoleBinding(): ClusterRoleBinding {

        return new ClusterRoleBinding(this, "xray-daemon", {
            roleRef: {
                apiGroup: "rbac.authorization.k8s.io",
                kind: "ClusterRole",
                name: "cluster-admin"
            },
            subjects: [{
                kind: "ServiceAccount",
                name: "xray-daemon",
                namespace: this.config.ns
            }]
        });
    }
}