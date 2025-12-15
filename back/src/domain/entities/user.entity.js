class User {
    constructor(id, name, email, password, roles) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password; // The password will be hashed
        this.roles = roles; // Array of role names or IDs
    }
}

module.exports = User;
