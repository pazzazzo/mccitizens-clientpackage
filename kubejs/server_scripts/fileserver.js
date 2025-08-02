let login = JsonIO.readJson("kubejs/data/login.json").asJsonObject

/**
 * 
 * @param {Internal.CommandContext<Internal.CommandSourceStack>} c 
 */

global["login_command"] = (c, psw) => {
    let p = c.source.player
    if (login.has(p.getName().getString()) && equals(login.get(p.getName().getString()).get("password"), psw)) {
        p.tell("yes")
    } else {
        console.log(Object.keys(psw.toString()));
        p.tell("no")
    }
    return 1
}

let a = 0
let telled = []

ServerEvents.tick(t => {
    if (a === 0) {
        login = JsonIO.readJson("kubejs/data/login.json").asJsonObject
        t.server.playerList.getPlayers().forEach(p => {
            if (login.has(p.getName().getString()) && telled.indexOf(p.getName().getString()) === -1) {
                p.tell("Pour vous connecter à votre compte, tapez /login <mot de passe>")
                telled.push(p.getName().getString())
            }
        })
    }
    a = (a + 1) % 20
})

function equals(a, b) {
    console.log(a.toString().length(), b.toString().length());
    console.log(a.toString(), b.toString());
    
    return a.toString().contains(b.toString()) && a.toString().length() - 2 === b.toString().length()
}