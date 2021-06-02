const {LanguageTC} = require("../models/language/language")

const LanguageQuery = {
    languageOne: LanguageTC.mongooseResolvers.findOne(),
    languageMany: LanguageTC.mongooseResolvers.findMany(),
}

module.exports = {
    LanguageQuery,
}