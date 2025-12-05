class RoleController {
    constructor(roleService) {
        this.roleService = roleService;
    }
    
    getAll = async (req, res) => {
        const roles = await this.roleService.getAllRoles();
        res.status(200).json(roles);
    }

    getById = async (req, res) => {
        const { id } = req.params;
        const role = await this.roleService.getRoleById(id);
        res.status(200).json(role);
    }

    create = async (req, res) => {
        const role = await this.roleService.createRole(req.body);
        res.status(201).json(role);
    }

    update = async (req, res) => {
        const { id } = req.params;
        const role = await this.roleService.updateRole(id, req.body);
        res.status(200).json(role);
    }

    delete = async (req, res) => {
        const { id } = req.params;
        await this.roleService.deleteRole(id);
        res.status(204).send();
    }
}
module.exports = RoleController;
