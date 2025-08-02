// priority: 0

// Visit the wiki for more info - https://kubejs.com/

console.info('Hello, World! (Loaded startup scripts)')
const $Player = Java.loadClass('net.minecraft.world.entity.player.Player')
let Create = Java.loadClass("com.simibubi.create.Create")

StartupEvents.registry("block", event => {
    event.create("sussy_dynamo")
        .blockEntity(info => {
            info.attachCapability(CapabilityBuilder.ENERGY.customBlockEntity()
                .canExtract(i => true)
                .canReceive(i => true)
                .extractEnergy((be, amount, simulate) => {
                    let energy = be.persistentData.getInt("energy") || 0
                    let extracted = Math.min(energy, amount)
                    if (!simulate) {
                        be.persistentData.putInt("energy", energy - extracted)
                    }
                    return extracted
                })
                .receiveEnergy((be, amount, simulate) => {
                    let energy = be.persistentData.getInt("energy") || 0
                    let received = Math.min(1919810 - energy, amount)
                    if (!simulate) {
                        be.persistentData.putInt("energy", energy + received)
                    }
                    return received

                })
                .getEnergyStored(be => {
                    return be.persistentData.getInt("energy") || 0
                })
                .getMaxEnergyStored(() => 1919810)
            )
        })
})

StartupEvents.registry("block", event => {
    event.create("schedule_fetcher", "cardinal")
        .blockEntity(info => {
            info.inventory(9, 4)
            info.rightClickOpensInventory()
            info.clientTick(20, 0, e => {
                e.level.addParticle('minecraft:campfire_cosy_smoke', true, e.x + .5, e.y + 1.05, e.z + .5, 0, .3, 0)
            })
            info.serverTick(20, 0, e => {
                e.inventory.insertItem(
                Item["of(net.minecraft.world.item.ItemStack,net.minecraft.nbt.CompoundTag)"]('create:schedule', '{Schedule:{Cyclic:1b,Entries:[' +
                      '{Instruction:{Data:{Text:"Vault97_TrainMaker"},Id:"create:destination"},' +
                      'Conditions:[[{Data:{Value:5,TimeUnit:1},Id:"create:delay"}]]}' +
                    ']}}'),
                    false
                )
                
            })
        })
})

// ForgeEvents.onEvent("net.minecraftforge.event.entity.EntityMountEvent", event => {
//     const { entityMounting, entityBeingMounted, level, mounting } = event
//     entityMounting.tell((level.isClientSide() ? "Client" : "Server") + " " + entityBeingMounted.getType(), " | " + mounting)
//     if (!level.isClientSide() && mounting) {
//         let riderIsPlayer = entityMounting instanceof $Player
//         let vehicleIsTrain = entityBeingMounted.getType() == 'create:carriage_contraption'

//         if (riderIsPlayer && vehicleIsTrain) {
//             let player = entityMounting

//             let startingPosition = new Vec3(player.x, player.y, player.z)
//             let startingDimension = level.dimension

//             entityMounting.tell("Tu viens de monter dans un train dans " + startingDimension.namespace)
//         }
//     }
// })




ForgeEvents.onEvent("net.minecraftforge.event.entity.EntityJoinLevelEvent", event => {
    if (global["net.minecraftforge.event.entity.EntityJoinLevelEvent"]) {
        global["net.minecraftforge.event.entity.EntityJoinLevelEvent"](event)
    }
})

ForgeEvents.onEvent("com.simibubi.create.api.event.TrackGraphMergeEvent", (e) => {
    console.info(e.toString())
})