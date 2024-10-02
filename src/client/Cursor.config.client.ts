import { CollectionService, Players, UserInputService } from "@rbxts/services";

const Mouse = Players.LocalPlayer.GetMouse();
Mouse.Icon = "https://www.roblox.com/asset?id=4813359774";

UserInputService.InputEnded.Connect((inputEnded) => {
    if (inputEnded.UserInputType === Enum.UserInputType.MouseButton1) {
        const target = Mouse.Target; 

        if (target && target.IsA("BasePart")) {
            if (CollectionService.HasTag(target, "IsDamagable")) {
                print("Yes, it is damageable.");
            } else {
                print("No, it isn't damageable.");
            }
        }
    }
});
