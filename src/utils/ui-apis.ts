//* All exported functions from this file are callable from the sandbox backend

const selectionChanged = () => {
  console.log("[UI] Selection Changed!");
};

const defaultExports = { selectionChanged };

export type UIAPIs = typeof defaultExports;
export default defaultExports;
