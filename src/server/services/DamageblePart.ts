import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";

interface Attributes {
    MaxHp: number;
    CurrentHp: number;
}

@Component({
    defaults: {
        MaxHp: 100,
        CurrentHp: 100,
    },
    tag: "DamageblePart",
})

export class DamageblePart extends BaseComponent<Attributes> implements OnStart {
    onStart(): void {
        if (this.instance.IsA("BasePart")) {
            const MaxHp = this.instance.GetAttribute("MaxHp") as number | undefined;
            if (MaxHp) {
                const DamageblePart = this.instance as BasePart;
            } else {
                error("MaxHp is not defined")
            }
        }
    }

    getMaxHp(): number {
        return this.attributes.MaxHp;
    }

    setMaxHp(value: number): void {
        this.attributes.MaxHp = value;
    }

    getCurrentHp(): number {
        return this.attributes.CurrentHp;
    }

    setCurrentHp(value: number): void {
        this.attributes.CurrentHp = value;
    }

    takeDamage(amountOfDamage: number): void {
        const newHp = this.attributes.CurrentHp - amountOfDamage;
        this.attributes.CurrentHp = math.max(newHp, 0); 
    }
}