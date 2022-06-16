import { Sandbox, SandboxOptions, SandboxPlayer } from "ZEPETO.Multiplay";
import { DataStorage } from "ZEPETO.Multiplay.DataStorage";
import { Player, Transform, Vector } from "ZEPETO.Multiplay.Schema";

export default class extends Sandbox
{
    //player: Player;
    //storage: DataStorage;

    constructor()
    {
        super();
        //this.player;// = new Player();
        //this.storage;// = new Player();
    }


    onCreate(options: SandboxOptions)
    {
        this.onMessage("onChangedTransform", (client, message) => {
            const player = this.state.players.get(client.sessionId);

            const transform = new Transform();
            transform.pos = new Vector();
            transform.pos.x = message.position.x;
            transform.pos.y = message.position.x;
            transform.pos.z = message.position.x;

            transform.rot = new Vector();
            transform.rot.x = message.rotation.x;
            transform.rot.y = message.rotation.y;
            transform.rot.z = message.rotation.z;

            player.transform = transform;
        });

        this.onMessage("onChangedState", (client, message) => {
            const player = this.state.players.get(client.sessionId);
            player.state = message.state;
        });
    }

    async onJoin(client: SandboxPlayer)
    {
        const player = new Player();
        player.id = client.sessionId;

        if (client.hashCode) {
            player.hash = client.hashCode;
        }
        if (client.userId) {
            player.userId = client.userId;
        }



        const transform = new Transform();
        transform.pos.x = this.state.players.size;
        transform.pos.y = 0;
        transform.pos.z = 0;

        transform.rot = new Vector();
        transform.rot.x = 0;
        transform.rot.y = 0;
        transform.rot.z = 0;

        player.transform = transform;


        const storage = client.loadDataStorage();

        let visitCnt = await storage.get("VisitCount") as number;
        if(visitCnt == null) visitCnt = 0;

        await storage.set("VisitCount" , ++visitCnt);

        this.state.players.set(client.sessionId, player);
    }

    onLeave(client: SandboxPlayer, consented?: boolean)
    {
        this.state.players.delete(client.sessionId);
    }
}