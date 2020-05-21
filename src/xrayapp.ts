import { Construct } from "constructs";
import { ClusterRoleBindingConstruct } from './lib/xray/clusterrolebinding';
import { ConfigMapConstruct } from './lib/xray/configmap';
import { DaemonSetConstruct } from './lib/xray/daemonset';
import { ServiceConstruct } from './lib/xray/service';
import { ServiceAccountConstruct } from './lib/xray/serviceaccount';

export interface IChartConfig {

    /**
     * Namespace to deploy chart resources into
     */
    ns: string,

    /**
     * Image to use for AWS X-Ray Daemon
     */
    image: string

    /**
     * AWS X-Ray Daemon Settings
     */
    daemon: DaemonSettings
}

export interface DaemonSettings {

    /**
     * Protocol to use for AWS X-Ray Daemon
     */
    readonly daemonProtocol: DaemonProtocol,

    /**
     * Port number for AWS X-Ray Daemon
     */
    readonly port: number,

    /**
     * Log level for AWS X-Ray Daemon
     */
    readonly logLevel?: string

}

export enum DaemonProtocol {
    "UDP",
    "TCP"
}

export class XRayApp extends Construct {


    constructor(scope: Construct, name: string, config: IChartConfig) {
        super(scope, name);

        new ConfigMapConstruct(this, "configmap", config).CreateConfigMap();
        new ClusterRoleBindingConstruct(this, "clusterrolebinding", config).CreateClusterRoleBinding();
        new ServiceConstruct(this, "service", config).CreateService();
        new ServiceAccountConstruct(this, "serviceaccount", config).CreateServiceAccount();
        new DaemonSetConstruct(this, "daemonset", config).CreateDaemonSet();
    }
}