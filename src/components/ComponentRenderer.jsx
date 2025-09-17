import MainHeader from "./custom/MainHeader";
import Navbar from "./global/Navbar"; 
import CategoryFeed from "./custom/CategoryFeed";
import CrewHeader from "./custom/CrewHeader";
import CrewMembers from "./custom/CrewMembers";

const componentMap = {
  "structure.main-header": MainHeader,
  "structure.category-feed": CategoryFeed,
  "structure.crew-header": CrewHeader,
  "structure.crew-members": CrewMembers,
  // Add other component mappings here
};


export default function ComponentRenderer({ component }) {
    const Component = componentMap[component.__component];
    if (!Component) {
        console.warn(`No component found for ${component.__component}`);
        return null; // or some fallback UI
    }
    return <Component data={component} />;
    }