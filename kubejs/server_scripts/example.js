// priority: 0

// Visit the wiki for more info - https://kubejs.com/

console.info('Hello, World! (Loaded server scripts)')

let Create = Java.loadClass("com.simibubi.create.Create")

PlayerEvents.loggedIn(event => {
    const pd = event.player.persistentData;
    // Si jamais défini, on initialise à zéro
    if (pd.money === undefined) {
        pd.money = 0;
        event.player.tell(`§6[Serveur]§r Bienvenue ! Votre solde a été initialisé à ${pd.money} pièces.`);
    } else {
        event.player.tell(`§6[Serveur]§r Rebonjour ! Votre solde est de ${pd.money} pièces.`);
    }
});

ServerEvents.commandRegistry(event => {
    event.register(event.commands.literal("money").executes(c => {
        c.source.player.tell(`§aVotre solde : §e${c.source.player.persistentData.money} pièces.`);
        return 1
    }))
});
ServerEvents.commandRegistry(event => {
  const { commands: Commands, arguments: Arguments } = event
    event.register(Commands.literal("login")
        .then(Commands.argument("password", Arguments.STRING.create(event))
            .executes(c => {
                if (global["login_command"]) {
                    return global["login_command"](c, Arguments.STRING.getResult(c, 'password'))
                } else {
                    c.source.player.tell("Erreur")
                }
            })
        )
    )
});

let $SimpleMenuProvider = Java.loadClass("net.minecraft.world.MenuProvider");
let $CraftingMenu = Java.loadClass("net.minecraft.world.inventory.CraftingMenu");
let $ChestMenu = Java.loadClass("net.minecraft.world.inventory.ChestMenu");
let $Optional = Java.loadClass("java.util.Optional");

NetworkEvents.dataReceived("server", (event) => {
    const { data, player, level } = event;

    if (data.open_menu == "crafting_table") {
        /** @type {Internal.Train} */
        let train = Create.RAILWAYS.trains.values().toArray().find((t) => t.id.toString().startsWith("359e"))
        player.tell("o: " + train.owner)
    }

    if (data.open_menu == "enderchest") {
        player.openInventoryGUI(player.enderChestInventory, Component.translatable("container.enderchest"));
    }

    if (data.open_menu == "trashcan") {
        player.openMenu(
            new $SimpleMenuProvider(
                (i, inv, p) => $ChestMenu.sixRows(i, inv),
                Component.translatable("container.trashcan")
            )
        );
    }
});

BlockEvents.placed("kubejs:sussy_dynamo", event => {
    const player = event.player;
    const world = event.block.level;
    const pos = event.block.pos;

    if (!player) return;
    if (!player.persistentData.city) {
        world.destroyBlock(pos, !player.isCreative())
        player.tell("§cVous n'avez pas de ville ! La Dynamo Suspecte a été cassée.");
    }
    const be = world.getBlockEntity(pos);
    if (be) {
        be.persistentData.putString("owner", player.uuid)
    }
})

/**
 * @param {Internal.EntityJoinLevelEvent} event 
 */
global["net.minecraftforge.event.entity.EntityJoinLevelEvent"] = (event) => {
    /** @type {Internal.CarriageContraptionEntity} */
    const ent = event.getEntity();
    if (event.level.isClientSide() || ent.getType() != 'create:carriage_contraption') return;
    event.level.server.tell(ent.getType())


    /** @type {Internal.Train} */
    let train = Create.RAILWAYS.trains.values().toArray().find(t => t.id && t.id.toString().equals(ent.trainId))
    let cont = ent.getContraption()
    return
    event.level.server.tell("X: " + cont.bounds.getXsize().toString())
    event.level.server.tell("Y: " + cont.bounds.getYsize().toString())
    event.level.server.tell("Z: " + cont.bounds.getZsize().toString())
    event.level.server.tell("uuid: " + ent.uuid.toString())
    event.level.server.tell("id: " + ent.trainId.toString())
    // event.level.server.tell("t: " + Object.keys(Create.RAILWAYS.trains.values().stream()))
    if (train.owner) {
        event.level.server.tell("player: " + train.owner)
    } else {
        event.level.server.tell("player: null")
    }
}