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
	Damage?: number;
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
	Damage?: number;
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
		Damage: 0,
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
					this.loadAttributes(entityData);

					if (!entityData.isFriendly && entityData.Damage !== undefined) {
						this.attributes.Damage = entityData.Damage;
					}
				} else {
					error(`Entity data for ${entityName} not found in Entities JSON.`);
				}
			} else {
				error("EntityName is not defined, no attribution was made.");
			}
		} else {
			error("Entity component must be attached to a Part or BasePart instance.");
		}
	}

	private loadAttributes(entityData: EntityData): void {
		this.attributes.EntityDescription = entityData.EntityDescription;
		this.attributes.EntityHealth = entityData.EntityHealth;
		this.attributes.EntityMaxHealth = entityData.EntityMaxHealth;
		this.attributes.EntityLevel = entityData.EntityLevel;
		this.attributes.EntityExperience = entityData.EntityExperience;
		this.attributes.EntityMaxExperience = entityData.EntityMaxExperience;
		this.attributes.isFriendly = entityData.isFriendly;
	}

	private setAttribute<T extends keyof Attributes>(key: T, value: Attributes[T]): void {
		this.attributes[key] = value;
	}

	public getEntityHealth(): number {
		return this.attributes.EntityHealth;
	}

	public setEntityHealth(health: number): void {
		this.setAttribute("EntityHealth", math.min(health, this.attributes.EntityMaxHealth));
		if (this.attributes.EntityHealth <= 0) {
			this.deathFunction();
		}
	}

	public getDamage(): number {
		return this.attributes.Damage ?? 0;
	}

	public setDamage(damage: number): void {
		this.setAttribute("Damage", damage);
	}

	public getEntityMaxHealth(): number {
		return this.attributes.EntityMaxHealth;
	}

	public setEntityMaxHealth(maxHealth: number): void {
		this.setAttribute("EntityMaxHealth", maxHealth);
	}

	public getEntityLevel(): number {
		return this.attributes.EntityLevel;
	}

	public setEntityLevel(level: number): void {
		this.setAttribute("EntityLevel", level);
	}

	public getEntityExperience(): number {
		return this.attributes.EntityExperience;
	}

	public setEntityExperience(experience: number): void {
		this.setAttribute("EntityExperience", math.min(experience, this.attributes.EntityMaxExperience));
	}

	public getEntityMaxExperience(): number {
		return this.attributes.EntityMaxExperience;
	}

	public setEntityMaxExperience(maxExperience: number): void {
		this.setAttribute("EntityMaxExperience", maxExperience);
	}

	public getEntityData(): Attributes {
		return this.attributes;
	}

	private deathFunction(): void {
		print(`${this.attributes.EntityName} has died.`);
		this.instance.Destroy();
		this.destroy();
	}
}
