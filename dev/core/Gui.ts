type TActions = "create" | "edit" | "remove" | "teleport" | "menu"

interface IData {
  currentWaypoint: string;
  waypointData: IWaypoints;
  anotherData: any;
}

class WaypointsUI {
  private static readonly offset: number = Math.floor((UI.getScreenHeight() - 440) / 2)
  private static action: TActions = "menu"
  public static data: IData = {
    currentWaypoint: "Name",
    waypointData: {
      color: "",
      dimension: 0,
      coords: {
        x: 0,
        y: 0,
        z: 0
      }
    },
    anotherData: {}
  }

  private static readonly updateWaypoints = ((mainText: string) => {
    const window = this.UIGroup.getWindow("waypointsUI")
    const waypoints = UIHelper.updateWaypoints(this.action)

    window.setContent({
      elements: Utils.merge(waypoints.elements, { waypointsText: { type: "text", x: 490, y: this.offset - 4, z: 1, text: mainText, font: { color: Color.WHITE, size: 45, alignment: 1 } } } ),
      drawing: [{ type: "background", color: Color.argb(0, 0, 0, 0) }],
      location: { x: 298, y: this.offset + 30, width: 430, height: 380, scrollY: new UI.WindowLocation(window.getContent().location).windowToGlobal(waypoints.offset + 105) }
    })

    this.UIGroup.close()
    this.UIGroup.getWindow("mainUI").open(); 

    window.open()
  })

  private static readonly buttonUI: UI.Window = (() => {
    const location: UI.WindowLocationParams = { x: 0, y: 100, width: 64, height: 64 }
    const drawing: UI.DrawingElements[] = [{ type: "background", color: Color.argb(0, 0, 0, 0) }]
    const elements: UI.ElementSet = {
      textOnButton: { type: "text", x: 210, y: 155, z: 1, text: "W", font: { color: Color.WHITE, size: 600, shadow: 0.1 } },
      openButton: { type: "button", bitmap: "default_button_up", bitmap2: "default_button_down", scale: 50, x: 0, y: 100, clicker: {
          onClick: () => { 
            this.UIGroup.getWindow("mainUI").open(); 
            this.UIGroup.getWindow("mainUIButtons").open() 
          }
      }}
    }

    const window = new UI.Window({
      location: location,
      drawing: drawing,
      elements: elements
    })

    window.setAsGameOverlay(true)

    return window
  })()
  private static readonly mainUI: UI.Window = (() => {
    const location: UI.WindowLocationParams = { x: 0, y: 0, width: 1000, height: UI.getScreenHeight() }
    const drawing: UI.DrawingElements[] = [{ type: "background", color: Color.argb(0, 0, 0, 0) }, { 
        type: "frame", 
        x: 255, 
        y: this.offset + 20, 
        width: 450, 
        height: 400, 
        bitmap: "classic_frame_bg_dark", 
        scale: 1.3, 
        color: Color.argb(70, 0, 0, 0) 
      }
    ]
    const elements: UI.ElementSet = { 
      closeButton: { type: "closeButton", bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 4, x: 702, y: this.offset - 12 } 
    }

    const window = new UI.Window({
      location: location,
      drawing: drawing,
      elements: elements
    })

    window.setCloseOnBackPressed(true)

    return window
  })()
  private static readonly mainUIButtons: UI.Window = (() => {
    const location: UI.WindowLocationParams = { x: 298, y: this.offset + 30, width: 430, height: 380, scrollY: 480 }
    const drawing: UI.DrawingElements[] = [{ type: "background", color: Color.argb(0, 0, 0, 0) }]
    const elements: UI.ElementSet = {
      addButton: { type: "button", bitmap: "button_borderless_light", bitmap2: "button_borderless_lightpressed", scale: 14, x: 80, y: this.offset + 80, clicker: {
        onClick: () => {
          this.action = "create"
          WaypointsUI.UIGroup.close()
          WaypointsUI.UIGroup.getWindow("mainUI").open(); WaypointsUI.UIGroup.getWindow("createUI").open()
        }
      }},
      editButton: { type: "button", bitmap: "button_borderless_light", bitmap2: "button_borderless_lightpressed", scale: 14, x: 80, y: this.offset + 340, clicker: {
        onClick: () => {
          this.action = "edit"
          this.updateWaypoints("Edit")
        }
      }},
      removeButton: { type: "button", bitmap: "button_borderless_light", bitmap2: "button_borderless_lightpressed", scale: 14, x: 80, y: this.offset + 600, clicker: {
        onClick: () => {
          this.action = "remove"
          this.updateWaypoints("Remove")
        }
      }},
      waypointsButton: { type: "button", bitmap: "button_borderless_light", bitmap2: "button_borderless_lightpressed", scale: 14, x: 80, y: this.offset + 860, clicker: {
        onClick: () => {
          this.action = "teleport"
          this.updateWaypoints("Teleport")
        }
      }},
      addText: { type: "text", x: 435, y: this.offset + 140, z: 1, text: "Add", font: { color: Color.GRAY, size: 65 } },
      editText: { type: "text", x: 438, y: this.offset + 400, z: 1, text: "Edit", font: { color: Color.GRAY, size: 65 } },
      removeText: { type: "text", x: 360, y: this.offset + 660, z: 1, text: "Remove", font: { color: Color.GRAY, size: 65 } },
      waypointsText: { type: "text", x: 320, y: this.offset + 920, z: 1, text: "Waypoints", font: { color: Color.GRAY, size: 65 } },
      mainText: { type: "text", x: 188, y: this.offset, z: 1, text: "Waypoints: Rebedrocked", font: { color: Color.WHITE, size: 45 } },
    }

    const window = new UI.Window({
      location: location,
      drawing: drawing,
      elements: elements
    })

    window.setCloseOnBackPressed(true)

    return window
  })()
  private static readonly createUI: UI.Window = (() => {
    const location: UI.WindowLocationParams = { x: 298, y: this.offset + 30, width: 430, height: 380 }
    const drawing: UI.DrawingElements[] = [{ type: "background", color: Color.argb(0, 0, 0, 0) }]
    const elements: UI.ElementSet = {
      nameInputButton: { type: "button", bitmap: "text_label_box", scale: 14, x: 80, y: this.offset + 80, clicker: {
        onClick: () => {
          const Context = UI.getContext();
          const text = new android.widget.EditText(Context); text.setHint("Name");
          new android.app.AlertDialog.Builder(Context)
              .setTitle("Please, enter a waypoint name")
              .setView(text)
              .setPositiveButton("Sumbit", new android.content.DialogInterface.OnClickListener({
                  onClick: () => {
                      const elements = this.createUI.getElements();

                      this.data.currentWaypoint = text.getText() + "";

                      elements.get("nameInputText").setBinding("text", this.data.currentWaypoint.length ? Utils.cutText(this.data.currentWaypoint, 15) : "Name");
                  }
                })).show()
        }
      }},
      addButton: { type: "button", bitmap: "button_borderless_light", bitmap2: "button_borderless_lightpressed", scale: 14, x: 80, y: this.offset + 340, clicker: {
        onClick: () => {
          if(this.data.currentWaypoint === "Name" || this.data.currentWaypoint.trim().length <= 0) return alert("Please, enter a waypoint name")
          if(Waypoints.get(this.data.currentWaypoint)) return alert("Please, enter another waypoint name or edit waypoint with this name")

          Waypoints.add(this.data.currentWaypoint, "")

          const waypoint = Waypoints.get(this.data.currentWaypoint)

          Game.message(`Waypoint ${this.data.currentWaypoint} created.\n\nPostion: ${Math.round(waypoint.coords.x)}, ${Math.round(waypoint.coords.y)}, ${Math.round(waypoint.coords.z)}`)

          this.UIGroup.close()
        }
      }},
      cancelButton: { type: "button", bitmap: "button_borderless_light", bitmap2: "button_borderless_lightpressed", scale: 14, x: 80, y: this.offset + 600, clicker: {
        onClick: () => {
          this.UIGroup.close()
          this.UIGroup.getWindow("mainUI").open(); this.UIGroup.getWindow("mainUIButtons").open()
        }
      }},
      nameInputText: { type: "text", x: + 155, y: this.offset + 150, z: 1, text: "Name", font: { color: Color.LTGRAY, size: 60 } },
      addText: { type: "text", x: + 500, y: this.offset + 380, z: 1, text: "Sumbit", font: { color: Color.GRAY, size: 60, alignment: 1 } },
      cancelText: { type: "text", x: + 508, y: this.offset + 630, z: 1, text: "Chancel", font: { color: Color.GRAY, size: 60, alignment: 1 } },
      mainText: { type: "text", x: 490, y: this.offset - 10, z: 1, text: "Add new Waypoint", font: { color: Color.WHITE, size: 45, alignment: 1 } },
    }

    const window = new UI.Window({
      location: location,
      drawing: drawing,
      elements: elements
    })

    window.setCloseOnBackPressed(true)

    return window
  })()
  private static readonly editUI: UI.Window = (() => {
    const location: UI.WindowLocationParams = { x: 298, y: this.offset + 30, width: 430, height: 380, scrollY: 465 }
    const drawing: UI.DrawingElements[] = [{ type: "background", color: Color.argb(0, 0, 0, 0) }]
    const elements: UI.ElementSet = {
      nameInputButton: { type: "button", bitmap: "text_label_box", scale: 14, x: 80, y: this.offset + 80, clicker: {
        onClick: () => {
          const Context = UI.getContext();
          const text = new android.widget.EditText(Context); text.setHint("Name");
          new android.app.AlertDialog.Builder(Context)
              .setTitle("Please, enter a waypoint name")
              .setView(text)
              .setPositiveButton("Sumbit", new android.content.DialogInterface.OnClickListener({
                  onClick: () => {
                      const elements = this.createUI.getElements();
                      this.data.currentWaypoint = text.getText() + "";
                      elements.get("nameInputText").setBinding("text", this.data.currentWaypoint.length ? Utils.cutText(this.data.currentWaypoint, 15) : "Name");
                  }
                })).show()
        }
      }},
      updateCoordsButton: { type: "button", bitmap: "button_borderless_light", bitmap2: "button_borderless_lightpressed", scale: 14, x: 80, y: this.offset + 330, clicker: {
        onClick: () => {
          const playerPosition = Player.getPosition()

          this.data.waypointData.coords.x = playerPosition.x
          this.data.waypointData.coords.y = playerPosition.y
          this.data.waypointData.coords.z = playerPosition.z

          alert("Position updated to current")
        }
      }},
      editButton: { type: "button", bitmap: "button_borderless_light", bitmap2: "button_borderless_lightpressed", scale: 14, x: 80, y: this.offset + 580, clicker: {
        onClick: () => {
          const merge: IWaypoints = Utils.merge<IWaypoints>(Waypoints.get(this.data.anotherData.oldName), this.data.waypointData)

          Waypoints.update(this.data.anotherData.oldName, this.data.currentWaypoint, merge)

          Game.message(`Waypoint ${this.data.anotherData.oldName} | ${this.data.currentWaypoint} edited.`)

          this.UIGroup.close()
        }
      }},
      cancelButton: { type: "button", bitmap: "button_borderless_light", bitmap2: "button_borderless_lightpressed", scale: 14, x: 80, y: this.offset + 830, clicker: {
        onClick: () => {
          this.UIGroup.close()
          this.UIGroup.getWindow("mainUI").open(); this.UIGroup.getWindow("mainUIButtons").open()
        }
      }},
      nameInputText: { type: "text", x: + 155, y: this.offset + 150, z: 1, text: this.data.currentWaypoint, font: { color: Color.LTGRAY, size: 60 } },
      updateCoordtext: { type: "text", x: + 500, y: this.offset + 360, z: 1, text: "Update coordinates", font: { color: Color.GRAY, size: 60, alignment: 1 } },
      editText: { type: "text", x: + 502, y: this.offset + 605, z: 1, text: "Sumbit changes", font: { color: Color.GRAY, size: 60, alignment: 1 } },
      cancelText: { type: "text", x: + 508, y: this.offset + 870, z: 1, text: "Chancel", font: { color: Color.GRAY, size: 60, alignment: 1 } },
      mainText: { type: "text", x: 480, y: this.offset - 10, z: 1, text: "Edit Waypoint", font: { color: Color.WHITE, size: 45, alignment: 1 } },
    }

    const window = new UI.Window({
      location: location,
      drawing: drawing,
      elements: elements
    })

    window.setCloseOnBackPressed(true)

    return window
  })()
  private static readonly removeUI: UI.Window = (() => {
    const location: UI.WindowLocationParams = { x: 298, y: this.offset + 30, width: 430, height: 380 }
    const drawing: UI.DrawingElements[] = [{ type: "background", color: Color.argb(0, 0, 0, 0) }]
    const elements: UI.ElementSet = {
      consentButton: { type: "button", bitmap: "button_borderless_light", bitmap2: "button_borderless_lightpressed", scale: 14, x: 80, y: this.offset + 200, clicker: {
        onClick: () => {
          Waypoints.remove(this.data.currentWaypoint)
          this.UIGroup.close()
          Game.message(`Waypoint "${this.data.currentWaypoint}" has been removed`)
        }
      }},
      rejectButton: { type: "button", bitmap: "button_borderless_light", bitmap2: "button_borderless_lightpressed", scale: 14, x: 80, y: this.offset + 460, clicker: {
        onClick: () => {
          this.UIGroup.close()
          this.UIGroup.getWindow("mainUI").open(); 
          this.UIGroup.getWindow("mainUIButtons").open(); 
        }
      }},
      consentText: { type: "text", x: 510, y: this.offset + 230, z: 1, text: "Yes", font: { color: Color.RED, size: 65, alignment: 1 } },
      rejectText: { type: "text", x: 515, y: this.offset + 490, z: 1, text: "No", font: { color: Color.rgb(50, 205, 50), size: 65, alignment: 1 }},
      mainText: { type: "text", x: 490, y: this.offset, z: 1, text: "Are you sure?", font: { color: Color.WHITE, size: 45, alignment: 1 } },
    }

    const window = new UI.Window({
      location: location,
      drawing: drawing,
      elements: elements
    })

    window.setCloseOnBackPressed(true)

    return window
  })()
  private static readonly waypointsUI: UI.Window = (() => {
    const location: UI.WindowLocationParams = { x: 298, y: this.offset + 30, width: 430, height: 380, scrollY: 0 }
    const drawing: UI.DrawingElements[] = [ { type: "background", color: Color.argb(0, 0, 0, 0) } ]
    const elements: UI.ElementSet = {}

    const window = new UI.Window({
      location: location,
      drawing: drawing,
      elements: elements
    })

    window.setCloseOnBackPressed(true);

    return window
  })()

  public static UIGroup = (() => {
    const UIGroup = new UI.WindowGroup()

    UIGroup.addWindowInstance("mainUI", this.mainUI)
    UIGroup.addWindowInstance("mainUIButtons", this.mainUIButtons)
    UIGroup.addWindowInstance("createUI", this.createUI)
    UIGroup.addWindowInstance("editUI", this.editUI)
    UIGroup.addWindowInstance("removeUI", this.removeUI)
    UIGroup.addWindowInstance("waypointsUI", this.waypointsUI)

    return UIGroup
  })()

  static nativeGuiChanged(screen: string): void {
    const showUIConditions = {
      in_game_play_screen: true
    } as const

    showUIConditions[screen] ? this.buttonUI.open() : this.buttonUI.close()
  }
}

Callback.addCallback("NativeGuiChanged", (screen: string) => {
  WaypointsUI.nativeGuiChanged(screen)
})