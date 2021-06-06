const isoLanguages = require("./ISO-639-1_2-languages.json");
const {Language} = require("../../models/language/language");

function mongoosifyLanguages() {
    const languages = []
    Object.keys(isoLanguages).forEach((key) => {
        const current = isoLanguages[key]
        languages.push({
            _id: current["639-1"],
            name: current["name"],
            nativeName: current["nativeName"],
            emoji: current["emoji"],
        })
    })

    return languages
}

async function createLanguages() {
    //add languages once on new DB
    if (await Language.countDocuments() === 0) {
        console.debug("Language collection is empty.")
        console.debug("Add ISO-639-1/2 compliant Languages")
        await Language.create(mongoosifyLanguages())
        console.debug(`Languages added: ${await Language.countDocuments()}`)
    } else {
        console.debug("Languages exist already; no data added")
    }
}

module.exports = createLanguages

