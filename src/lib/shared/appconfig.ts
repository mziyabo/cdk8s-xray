

export interface IConfig {
    
    namespace: string,
    app: {
        name: string
    },
    resource: {
        serviceAccount: string,
        configMap: string
    },
    daemonSettings: {
        UDPPort: number,
        TCPPort?: number
    }
}


export let appConfig: IConfig = {

    namespace: "default",
    app: {
        name: "xray-daemon"
    },
    resource: {
        configMap: "xray-config",
        serviceAccount: "xray-daemon"
    },
    daemonSettings: {
        UDPPort: 2000
    }
}