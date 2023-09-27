class Utils {
    static merge<T>(arg1: T, arg2: T): T {
        for(let merge in arg2) { arg1[merge] = arg2[merge] }
        
        return arg1
    }
    static cutText(text: string, count: number): string {
        return (text.trim().length > count) ? text.substring(0, count - 3).trim() + "..." : text.trim()
    }
}

class UIHelper {
    static updateWaypoints(action: TActions) {
        let offset: number = Math.floor((UI.getScreenHeight() - 440) / 2);

        const iterationArray = Waypoints.getMap().entrySet().toArray()
        const elements: UI.ElementSet = {}

        for(let i = 0; i < iterationArray.length; i++) {
            const element = iterationArray[i].key
            const value = Waypoints.get(element)

            elements[`waypoint` + element] = {
                type: "button",
                bitmap: "button_borderless_light",
                bitmap2: "button_borderless_lightpressed",
                scale: 14,
                x: 80,
                y: offset + 80,
                clicker: {
                    onClick: () => {
                        switch(action) {
                            case "edit":
                                WaypointsUI.data.currentWaypoint = element
                                WaypointsUI.data.waypointData = Waypoints.get(WaypointsUI.data.currentWaypoint)
                                WaypointsUI.data.anotherData.oldName = WaypointsUI.data.currentWaypoint

                                WaypointsUI.UIGroup.close()
                                WaypointsUI.UIGroup.getWindow("mainUI").open(); WaypointsUI.UIGroup.getWindow("editUI").open()
                                break
                            case "remove":
                                WaypointsUI.data.currentWaypoint = element

                                WaypointsUI.UIGroup.close()
                                WaypointsUI.UIGroup.getWindow("mainUI").open(); WaypointsUI.UIGroup.getWindow("removeUI").open()
                                break
                            case "teleport":
                                WaypointsUI.UIGroup.close()

                                Waypoints.teleport(element)

                                Game.message(`You are teleported to ${element} waypoint`)
                                break
                        }
                    }
                }
            }

            elements[`text` + element] = {
                type: "text",
                x: 500,
                y: offset + 120,
                z: 1,
                text: `${Utils.cutText(String(element), 25)}`,
                font: {
                    color: Color.GRAY,
                    bold: true,
                    size: 40,
                    alignment: 1
                },
            }

            elements[`coords` + element] = {
                type: "text",
                x: 500,
                y: offset + 180,
                z: 1,
                text: `${Utils.cutText(String(Math.round(value.coords.x)), 8)}`
                +` ${Utils.cutText(String(Math.round(value.coords.y)), 8)}` 
                +` ${Utils.cutText(String(Math.round(value.coords.z)), 8)}`,
                font: {
                    color: Color.BLACK,
                    size: 35,
                    alignment: 1
                },
            }

            offset += 250
        }

        return {
            elements: elements, 
            offset: offset
        }
    }
}