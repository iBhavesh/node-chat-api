db.createUser(
    {
        user: "pingUser",
        pwd: "pingUser",
        roles: [
            {
                role: "readWrite",
                db: "ping"
            }
        ]
    }
);