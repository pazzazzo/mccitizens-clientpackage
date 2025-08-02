// priority: 0

// Visit the wiki for more info - https://kubejs.com/
console.info('Hello, World! (Loaded client scripts)')

let $Button = Java.loadClass("net.minecraft.client.gui.components.Button");
let $InventoryScreen = Java.loadClass("net.minecraft.client.gui.screens.inventory.InventoryScreen");


ClientEvents.tick((event) => {
    let screen = Client.screen
    let player = event.player

    if (screen instanceof $InventoryScreen) {
        screen.addRenderableWidget(
            $Button
                .builder(Text.of("Banque"), (button) =>
                    player.sendData("server", { open_menu: "crafting_table" })
                )
                .bounds(screen.guiLeft - 80, screen.guiTop + 60, 60, 15)
                .build()
        );
    }
})

