const jwt = require("jsonwebtoken")
const util = require("../../graphql/user/user.test.queries")
const {createTestClient} = require("apollo-server-integration-testing")
const createExpressApp = require("../createExpressApp")
const createApollo = require("../createApolloServer")
const {query, mutate, setOptions} = createTestClient({apolloServer: createApollo(createExpressApp())})

/**
 * Unfortunately we cannot use the *isAuth* middleware to properly authorize ourself
 * This function mimics *isAuth* and uses *setOptions* to mimic a valid JWT auth token
 * @param {String} email
 * @param {String} password
 */
async function login(email, password) {
    const loginResult = await mutate(
        util.LOGIN, {
            variables: {
                email,
                password
            }
        }
    )
    const token = loginResult.data.login
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    setOptions({
        request: {
            user: {
                isAuth: true,
                _id: decodedToken._id,
                name: decodedToken.username,
                role: decodedToken.role,
            }
        }
    });
}

/**
 * Log in as SKTT1Faker
 */
async function loginUser() {
    await login("faker@skt-t1.gg", "BetterNerfBr0cc0li")
}

/**
 * Log in as Admin
 */
async function loginAdmin() {
    await login("admin@email.com", "AdminPW1")
}

function failLogin() {
    setOptions({
        request: {
            user: {
                isAuth: false,
            }
        }
    });
}

/**
 * reset req and res to an empty object to keep tests atomic
 * if we dont do this we might carry over a valid login to the next test if
 * we don't define other *setOptions* in that specific test case
 */
function resetOptions() {
    setOptions({
        request: {},
        response: {},
    })
}

module.exports = {
    query,
    mutate,
    login,
    loginUser,
    loginAdmin,
    failLogin,
    resetOptions,
}