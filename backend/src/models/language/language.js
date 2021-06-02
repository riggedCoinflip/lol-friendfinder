const mongoose = require("mongoose");
const {composeMongoose} = require("graphql-compose-mongoose");

const LanguageSchema = new mongoose.Schema({
    _id: {
        //uses the ISO639_1 alpha-2 code (de, en, fr, es, ...) as a unique identifier
        type: String,
        alias: "alpha2",
    },
    name: {
        //eg. German
        type: String,
        required: true,
    },
    nativeName: {
        //eg. Deutsch
        type: String,
        required: true,
    },
})

const Language = mongoose.model("Language", LanguageSchema)
const LanguageTC = composeMongoose(Language, {})

module.exports = {
    Language,
    LanguageTC,
}