
const cdk8s = require("cdk8s");
const xrds = require("../out/lib/xray/daemonset");
const xrk8s = require("../out/xrayapp");

config = {
    image: "rnzdocker1/eks-workshop-x-ray-daemon:dbada4c77e6ae10ecf5a7b1c5864aa6522d9fb02",
    namespace: "default",
    chart: {
        name: "xray"
    },
    daemon: {
        daemonProtocol: xrk8s.DaemonProtocol.UDP,
        port: 2000,
        logLevel: "prod"
    }
}

test('Each DaemonSet containers imagePullPolicy is "Always"', () => {
    // GIVEN
    var app = cdk8s.Testing.app();
    var chart = new cdk8s.Chart(app, "cdk8s-xray");
    // WHEN 
    var dsconstruct = new xrds.DaemonSetConstruct(chart, 'ds', config);
    var containers = dsconstruct.CreateDaemonSet(chart).options.spec.template.spec.containers;
    // THEN
    containers.forEach(container => {
        expect(container.imagePullPolicy).toBe("Always");
    });

});

test('DaemonSet containers must have resource limits', () => {
    // GIVEN
    var app = cdk8s.Testing.app();
    var chart = new cdk8s.Chart(app, "cdk8s-xray");
    // WHEN 
    var dsconstruct = new xrds.DaemonSetConstruct(chart, 'ds', config);
    var containers = dsconstruct.CreateDaemonSet(chart).options.spec.template.spec.containers;
    // THEN
    containers.forEach(container => {
        expect(Object.keys(container.resources.limits).length).toBeGreaterThan(0);
    });

});