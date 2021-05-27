const isoLanguages = require("../models/language/ISO-639-1_2-languages.json")
const {Language} = require("../models/language/language");

//TODO better name
function mongooseLanguages() {
    const languages = []
    Object.keys(isoLanguages).forEach((key) => {
        const current = isoLanguages[key]
        languages.push({
            _id: current["639-1"],
            name: current["name"],
            nativeName: current["nativeName"],
        })
    })

    return languages
}

async function createLanguages() {
    //add languages once on new DB
    if (await Language.countDocuments() === 0) {
        console.log("Language collection is empty.")
        console.log("Add ISO-639-1/2 compliant Languages ")
        await Language.insertMany(mongooseLanguages())
        console.log(`Languages added: ${await Language.countDocuments()}`)
    } else {
        console.log("Languages exist already; no data added")
    }
}

module.exports = {
    mongooseLanguages,
    createLanguages,
}
