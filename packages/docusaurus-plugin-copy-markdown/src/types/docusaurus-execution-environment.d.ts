declare module "@docusaurus/ExecutionEnvironment" {
  const ExecutionEnvironment: {
    canUseDOM: boolean;
    canUseEventListeners: boolean;
    canUseViewport: boolean;
  };

  export default ExecutionEnvironment;
}
