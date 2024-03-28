import instructionsWeb from "./instructionsWeb.js";
import instructionsNode from "./instructionsNode.js";
function instructions(use) {
  
  let env = use || (typeof window === "undefined" ? "node" : "web")
  if (env === 'node') {
    console.log('instructions for node use ')
    return instructionsNode();
  } else {
    console.log('instructions for web')
    return instructionsWeb();
  }
  
}
export default instructions;