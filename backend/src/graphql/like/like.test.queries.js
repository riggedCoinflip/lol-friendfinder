const SWIPE = `
    mutation swipe($requester: MongoID!, $recipient: MongoID!, $status: String!) {
        swipe (
            record: {
                requester: $requester
                recipient:  $recipient
                status: $status
            }
        ) {
            record{
                requester
                recipient
                status
            }
        }
    }
`

module.exports = {
    SWIPE
}