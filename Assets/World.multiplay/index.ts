import { Sandbox, SandboxOptions, SandboxPlayer } from "ZEPETO.Multiplay";
import { DataStorage } from "ZEPETO.Multiplay.DataStorage";
import { Player } from "ZEPETO.Multiplay.Schema";

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
        this.onMessage("onChangedState", (client, message) => {
            const player = this.state.players.get(client.sessionId);
            player.state = message.state;
        });
    }

    onJoin(client: SandboxPlayer)
    {
        console.log("join");
        //this.player = new Player();
        let player = new Player();

        player.id = client.userId;
        player.hash = client.hashCode;
        player.userId = client.userId;


        //this.setPlayer(client);
        this.setStorage(client);
        this.state.players.set(client.sessionId, player);
    }

    onLeave(client: SandboxPlayer, consented?: boolean)
    {
        console.log("leave");

    }

    setPlayer(_ : SandboxPlayer)
    {
        //this.player.id = _.userId;
       // this.player.hash = _.hashCode;
       // this.player.userId = _.userId;
    }

    async setStorage(_ : SandboxPlayer)
    {
        //= client
        //this.storage
        const storage = _.loadDataStorage();

        let visitCnt = await storage.get("VisitCount") as number;
        if(visitCnt == null) visitCnt = 0;

        await storage.set("VisitCount" , ++visitCnt);
    }
}