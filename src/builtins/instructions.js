import instructionsWeb from "./instructionsWeb.js";
import instructionsNode from "./instructionsNode.js";
function instructions() {

  if (typeof window === "undefined") {
    console.log('instructions for node use ')
    return instructionsNode();
  }else {
    console.log('instructions for web')
    return instructionsWeb();
  }
  
}
export default instructions;