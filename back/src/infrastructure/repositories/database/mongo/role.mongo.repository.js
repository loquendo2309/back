const RoleRepository = require('../../../../domain/repositories/role.repository.interface');
const RoleModel = require('./models/role.model');
const Role = require('../../../../domain/entities/role.entity');

class RoleMongoRepository extends RoleRepository {
    async getAll() {
        const roles = await RoleModel.find();
        return roles.map(r => new Role(r._id.toString(), r.name));
    }

    async getById(id) {
        const role = await RoleModel.findById(id);
        if (!role) return null;
        return new Role(role._id.toString(), role.name);
    }

    async getByName(name) {
        const role = await RoleModel.findOne({ name: name });
        if (!role) return null;
        return new Role(role._id.toString(), role.name);
    }

    async create(roleEntity) {
        const newRole = new RoleModel({
            name: roleEntity.name,
        });
        const savedRole = await newRole.save();
        return new Role(savedRole._id.toString(), savedRole.name);
    }

    async update(id, roleEntity) {
        const updatedRole = await RoleModel.findByIdAndUpdate(id, {
            name: roleEntity.name,
        }, { new: true });

        if (!updatedRole) return null;
        return new Role(updatedRole._id.toString(), updatedRole.name);
    }

    async delete(id) {
        await RoleModel.findByIdAndDelete(id);
    }
}

module.exports = RoleMongoRepository;
