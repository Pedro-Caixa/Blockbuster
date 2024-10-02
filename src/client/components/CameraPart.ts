import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";

interface Attributes {
	MaxZoom: number;
    MinZoom: number;
    CurrentZoom: number;
}

@Component({
    defaults: {
        MaxZoom: 0,
        MinZoom: 0,
        CurrentZoom: 0
    },
    tag: "CameraPart",
})

export class CameraPart extends BaseComponent<Attributes> implements OnStart {
    private CurrentCamera = Workspace.CurrentCamera ?? undefined;
    onStart(): void {
        if (this.instance.IsA("BasePart")) {
            const CameraId= this.instance.GetAttribute("CameraId") as number | undefined;
            if (CameraId) {
                const CameraPart = this.instance as BasePart;
                const partPos = CameraPart.Position;
                const partSize = CameraPart.Size;
                const partBottomPos = partPos.add(new Vector3(0, -partSize.Y / 2, 0));

                if (this.CurrentCamera) {
                    this.CurrentCamera.CameraType = Enum.CameraType.Scriptable;
                    this.CurrentCamera.CFrame = CameraPart.CFrame;
                } else {
                    error("CurrentCamera is undefined, cannot set camera position.");
                }
            } else {
                error("CameraId is not defined")
            }
        }
    }
}