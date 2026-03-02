(function registerTelemetry(global) {
  const demo = (global.DemiurgeDemo = global.DemiurgeDemo || {});
  const telemetry = (demo.telemetry = demo.telemetry || { sharedLoads: 0 });

  telemetry.sharedLoads += 1;

  if (typeof demo.setText === "function") {
    demo.setText("telemetry-loads", telemetry.sharedLoads);
  }

  if (typeof demo.log === "function") {
    demo.log("shared script loaded: demo-telemetry.js");
  }
})(window);

