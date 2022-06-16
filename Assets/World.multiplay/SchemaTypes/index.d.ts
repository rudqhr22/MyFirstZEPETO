declare module "ZEPETO.Multiplay.Schema" {

	import { Schema, MapSchema, ArraySchema } from "@colyseus/schema"; 


	interface State extends Schema {
		players: MapSchema<Player>;
	}
	class Vector extends Schema {
		x: number;
		y: number;
		z: number;
	}
	class Transform extends Schema {
		pos: Vector;
		rot: Vector;
	}
	class Player extends Schema {
		id: string;
		hash : string;
		userId: string;
		transform: Transform;
		state: number;
	}
}