export default function override() {
  if (config.optimization) {
    config.optimization.minimize = false;
    config.optimization.concatenateModules = false;
  }
  return config;
}
