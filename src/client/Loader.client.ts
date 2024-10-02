import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { CameraPart } from "./components/CameraPart";

const ComponentFolder = Dependency<Components>();
task.wait(1);
ComponentFolder.addComponent<CameraPart>(game);