import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { HttpService } from "@rbxts/services";
import { Entities } from "shared/Entity.Creation.json";

interface EntityData {
	EntityDescription: string;
	EntityHealth: number;
	EntityMaxHealth: number;
	EntityLevel: number;
	EntityExperience: number;
	EntityMaxExperience: number;
	isFriendly: boolean;
}

interface EntitiesJSON {
	Entities: Record<string, EntityData>;
}

interface Attributes {
	UUID: string;
	EntityId: number;
	EntityName: string;
	EntityDescription: string;
	EntityHealth: number;
	EntityMaxHealth: number;
	EntityLevel: number;
	EntityExperience: number;
	EntityMaxExperience: number;
	isFriendly: boolean;
}

const entitiesData = Entities as unknown as EntitiesJSON;

@Component({
	defaults: {
		UUID: "0",
		EntityId: 0,
		EntityName: "PlaceHolder",
		EntityDescription: "Entity placeholder description, how did you find me?",
		EntityHealth: 0,
		EntityMaxHealth: 0,
		EntityLevel: 0,
		EntityExperience: 0,
		EntityMaxExperience: 0,
		isFriendly: false,
	},
	tag: "Entity",
})
export class Entity extends BaseComponent<Attributes> implements OnStart {
	onStart(): void {
		if (this.instance.IsA("Part") || this.instance.IsA("BasePart")) {
			this.attributes.UUID = HttpService.GenerateGUID(false);
			this.attributes.EntityId = this.instance.GetAttribute("EntityId") as number;
			const entityName = this.instance.GetAttribute("EntityName") as string;
			if (entityName) {
				const entityData = entitiesData.Entities[entityName];
				if (entityData) {
					const keys: (keyof EntityData)[] = [
						"EntityDescription",
						"EntityHealth",
						"EntityMaxHealth",
						"EntityLevel",
						"EntityExperience",
						"EntityMaxExperience",
						"isFriendly",
					];
					for (const key of keys) {
						this.attributes[key] = entityData[key];
					}
				} else {
					error(`Entity data for ${entityName} not found in Entities JSON.`);
				}
			} else {
				error("EntityName is not defined, no attribution was made");
			}
		} else {
			error("Entity component must be attached to a Part or BasePart instance.");
		}
	}
}
