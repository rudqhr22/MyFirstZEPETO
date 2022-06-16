import { CharacterState, SpawnInfo, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Room, RoomData } from 'ZEPETO.Multiplay';
import *  as UnityEngine from 'UnityEngine';
import { Player, State, Vector } from 'ZEPETO.Multiplay.Schema';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World'

export default class ClientStarter extends ZepetoScriptBehaviour {

    public multiPlay : ZepetoWorldMultiplay;
    private  room : Room;

    private  currentPlayer: Map<string, Player> = new Map<string, Player>()

    Start()
    {
       this.multiPlay.RoomCreated += (_room :Room) =>
       {
            this.room = _room;
       };

       this.multiPlay.RoomJoined += (_room :Room) =>
       {
            _room.OnStateChange += this.onStateChange;
       };
    }


    private onStateChange(state  :State, isFirst : boolean)
    {
        console.log("onStateChange");

        if(isFirst)
        {
            ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(()=>{
                const myPlayer = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;

                myPlayer.character.OnChangedState.AddListener((cur, prev) => {
                    this.SendState(cur);

                });
            });
        }

        let join = new Map<string, Player>();
        state.players.ForEach((sessionId: string, player:Player) => {
            if(!this.currentPlayer.has(sessionId))
            {
                join.set(sessionId, player);

            }
        });

        join.forEach((player:Player, sessionId: string) => this.OnJoinPlayer(player, sessionId));

    }

    private SendState(state : CharacterState)
    {
        const data = new RoomData();
        data.Add("state", state);
        this.room.Send("onChangedState", data.GetObject)
    }

    private OnJoinPlayer(player:Player, sessionId: string)
    {
        console.log("OnJoinPlayer :" + player + "sessionId : " + sessionId);
        this.currentPlayer.set(sessionId, player);

        const spawnInfo = new SpawnInfo();
        const pos = new UnityEngine.Vector3(0,0,0);
        const rot = new UnityEngine.Vector3(0,0,0);

        spawnInfo.position = pos;
        spawnInfo.rotation = UnityEngine.Quaternion.Euler(rot);



        const isLocal = this.room.SessionId === player.id;
        ZepetoPlayers.instance.CreatePlayerWithUserId(sessionId, player.id, spawnInfo, isLocal);
    }
}