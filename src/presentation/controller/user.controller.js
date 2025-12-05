class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    
    getAll = async (req, res) => {
        const users = await this.userService.getAllUsers();
        res.status(200).json(users);
    }

    getById = async (req, res) => {
        const { id } = req.params;
        const user = await this.userService.getUserById(id);
        res.status(200).json(user);
    }

    create = async (req, res) => {
        const user = await this.userService.createUser(req.body);
        res.status(201).json(user);
    }

    update = async (req, res) => {
        const { id } = req.params;
        const user = await this.userService.updateUser(id, req.body);
        res.status(200).json(user);
    }

    delete = async (req, res) => {
        const { id } = req.params;
        await this.userService.deleteUser(id);
        res.status(204).send();
    }
}
module.exports = UserController;
