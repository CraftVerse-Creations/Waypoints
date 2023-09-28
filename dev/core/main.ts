/// <reference path="../utils.ts" />

class Waypoints {
    private static waypointsMap: java.util.HashMap<string, IWaypoints> = new java.util.HashMap()

    public static add(name: string, color: string): void {
        const playerPosition = Player.getPosition();

        if(this.get(name)) return;
        let dimension = Player.getDimension();

        this.waypointsMap.put(name,  {
            color: color,
            dimension: dimension,
            coords: {
                x: playerPosition.x || 0,
                y: playerPosition.y || 80,
                z: playerPosition.z || 0
            }
        });
    }

    public static get(name: string): IWaypoints {
        if(!this.waypointsMap.get(name)) return

        return this.waypointsMap.get(name)
    }

    public static update(name: string, newName: string, params: IWaypoints): void {
        switch(newName) {
            case name: 
            this.waypointsMap.replace(newName, params)
                break
            default:
                this.remove(name)
                this.waypointsMap.put(newName, params)
                break
        }
    }

    public static remove(name: string): void { 
        this.waypointsMap.remove(name);
    }

    public static getMap(): java.util.HashMap<string, IWaypoints> {
        return this.waypointsMap
    }
    
    public static setMap(scope): void {
        for(let key in scope) {
            this.waypointsMap.put(key, scope[key]);
        }
    }

    public static teleport(name: string) {
        const waypoint: IWaypoints = this.waypointsMap.get(name);

        if(!waypoint) return;

        let dimension = waypoint.dimension || 0;

        if(Player.getDimension() != dimension)
            Dimensions.transfer(Player.get(), dimension);
        if(LocalMode){
            Network.sendToServer("waypoints.full_teleprt", waypoint);
        }else{
            Player.setPosition(waypoint.coords.x, waypoint.coords.y, waypoint.coords.z);
            Network.sendToServer("waypoints.teleport", waypoint);
        }
    }
}

Network.addServerPacket("waypoints.teleport", (client, data: IWaypoints) => 
    Entity.setPosition(client.getPlayerUid(), data.coords.x, data.coords.y, data.coords.z));
    
Network.addServerPacket("waypoints.full_teleprt", (client, data: IWaypoints) => { 
    Entity.setPosition(client.getPlayerUid(), data.coords.x, data.coords.y, data.coords.z);
    client.send("waypoints.client_teleport", data);
});

Network.addClientPacket("waypoints.client_teleport", (data: IWaypoints) => 
    Player.setPosition(data.coords.x, data.coords.y, data.coords.z));

Saver.addSavesScope("waypointsMap",
    function read(scope) {
        try{
            if(!scope) return

            Waypoints.setMap(scope)
        } catch(e) {
            alert(`Read scope error: ${e}`)
        }
    },
    function save() {
        try {
            const iterationArray = Waypoints.getMap().entrySet().toArray()
            const obj = {}

            for (let i = 0; i < iterationArray.length; i++) {
                const key = iterationArray[i].key
                const value = Waypoints.get(key)

                obj[key] = value
            }

            return obj
        } catch(e) {
            alert(`Save scope error: ${e}`)
            return {}
        }
    },
)

Callback.addCallback("LevelLeft", () => Waypoints.setMap({}));

interface IWaypoints {
    color: string
    dimension: number
    coords: {
        x: number
        y: number,
        z: number,
    },
}