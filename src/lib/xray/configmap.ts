import { Construct } from 'constructs';
import { ConfigMap } from '../../imports/k8s';
import { XRayConfig } from '../../xrayapp'

export class ConfigMapConstruct extends Construct {
    config: XRayConfig;

    constructor(scope: Construct, name: string, config: XRayConfig) {
        super(scope, name)

        this.config = config;
    }

    CreateConfigMap() {

        const regex = new RegExp("\n{2,}", 'gi');
        let daemonfile = [
            "# Maximum buffer size in MB (minimum 3). Choose 0 to use 1% of host memory. ",
            "TotalBufferSizeMB: 0",
            "# Maximum number of concurrent calls to AWS X-Ray to upload segment documents.",
            "Concurrency: 8",
            "# Send segments to AWS X-Ray service in a specific region",
            "Region: \"\"",
            "# Change the X-Ray service endpoint to which the daemon sends segment documents.",
            "Endpoint: \"\"",
            "Socket:",
            "  # Change the address and port on which the daemon listens for UDP packets containing segment documents.",
            "  # Make sure we listen on all IP's by default for the k8s setup",
            `  UDPAddress: 0.0.0.0:${this.config.daemon.port}`,
            "Logging:",
            "  LogRotation: true",
            "  # Change the log level, from most verbose to least: dev, debug, info, warn, error, prod (default).",
            `  LogLevel: ${this.config.daemon.logLevel}`,
            "  # Output logs to the specified file path.",
            "  LogPath: \"\"",
            "# Turn on local mode to skip EC2 instance metadata check.",
            "LocalMode: false",
            "# Amazon Resource Name (ARN) of the AWS resource running the daemon.",
            "ResourceARN: \"\"",
            "# Assume an IAM role to upload segments to a different account.",
            "RoleARN: \"\"",
            "# Disable TLS certificate verification.",
            "NoVerifySSL: false",
            "# Upload segments to AWS X-Ray through a proxy.",
            "ProxyAddress: \"\"",
            "# Daemon configuration file format version.",
            "Version: 1"
        ].join("\n").replace(regex, "\n");

        new ConfigMap(this, "xray-config", {
            metadata: {
                name: "xray-config"
            },
            data: {
                "config.yaml": daemonfile
            }
        });
    }
}