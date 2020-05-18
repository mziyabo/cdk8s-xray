import { Construct } from 'constructs';
import { ClusterRoleBinding } from '../../imports/k8s';

export class XRClusterRoleBinding extends Construct {

    constructor(scope: Construct, name: string) {
        super(scope, name)

        this.CreateClusterRoleBinding(this);
    }

    CreateClusterRoleBinding(scope: Construct): ClusterRoleBinding {

        return new ClusterRoleBinding(scope, "xray-daemon", {
            roleRef: {
                apiGroup: "rbac.authorization.k8s.io",
                kind: "ClusterRole",
                name: "cluster-admin"
            },
            subjects: [{
                kind: "ServiceAccount",
                name: "xray-daemon",
                namespace: "default"
            }]
        });
    }
}