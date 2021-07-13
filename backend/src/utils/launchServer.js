module.exports = function (app, apollo, port=5000) {
    return app.listen({port}, () => {
        console.log(`🚀 Apollo Server ready on http://localhost:${port}${apollo.graphqlPath}`);
    })
}