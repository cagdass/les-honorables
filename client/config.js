let config = {
    local: {
        baseURL: "http://cgds.me:4000",
        apiPath: "http://cgds.me:4000/"
    },
    "pre-prod": {
        baseURL: "/",
        apiPath: "/users/"
    }
};

export default config.local;
