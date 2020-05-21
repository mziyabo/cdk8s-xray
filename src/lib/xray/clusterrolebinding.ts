import { Construct } from 'constructs';
import { ClusterRoleBinding } from '../../imports/k8s';
import { IChartConfig } from '../../xrayapp'

export class ClusterRoleBindingConstruct extends Construct {

    config: IChartConfig;

    constructor(scope: Construct, name: string, config: IChartConfig) {
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