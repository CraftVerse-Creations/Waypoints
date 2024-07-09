ModAPI.registerAPI("Waypoints", {
    Waypoints: Waypoints,
    WaypointsUI: WaypointsUI,
    
    requireGlobal(cmd: string){
        return eval(cmd);
    }
});