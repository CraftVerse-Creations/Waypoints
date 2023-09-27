/// <reference path="../utils.ts" />

class Waypoints {
    private static waypointsMap: java.util.HashMap<string, IWaypoints> = new java.util.HashMap()

    static add(name: string, color: string): void {
        const playerPosition = Player.getPosition()

        if(this.get(name)) return

        this.waypointsMap.put(name,  {
            color: color,
            dimension: Player.getDimension(),
            coords: {
                x: playerPosition.x || 0,
                y: playerPosition.y || 80,
                z: playerPosition.z || 0
            }
        })
    }

    static get(name: string): IWaypoints {
        if(!this.waypointsMap.get(name)) return

        return this.waypointsMap.get(name)
    }

    static update(name: string, newName: string, params: IWaypoints): void {
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

    static remove(name: string): void { 
        this.waypointsMap.remove(name) 
    }

    static getMap(): java.util.HashMap<string, IWaypoints> {
        return this.waypointsMap
    }
    
    static setMap(scope): void {
        for(let key in scope) {
            this.waypointsMap.put(key, scope[key])
        }
    }

    static teleport(name: string) {
        const waypoint: IWaypoints = this.waypointsMap.get(name)

        if(!waypoint) return

        Dimensions.transfer(Player.get(), waypoint.dimension || 0)
        Player.setPosition(waypoint.coords.x, waypoint.coords.y, waypoint.coords.z)
    }
}

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

interface IWaypoints {
    color: string
    dimension: number
    coords: {
        x: number
        y: number,
        z: number,
    },
}