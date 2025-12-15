const UserRepository = require('../../../../domain/repositories/user.repository.interface');
const UserModel = require('./models/user.model');
const User = require('../../../../domain/entities/user.entity');

class UserMongoRepository extends UserRepository {
    async getAll() {
        const users = await UserModel.find().populate('roles');
        return users.map(u => new User(u._id.toString(), u.name, u.email, null, u.roles.map(r => r.name))); // password is not returned
    }

    async getById(id) {
        const user = await UserModel.findById(id).populate('roles');
        if (!user) return null;
        return new User(user._id.toString(), user.name, user.email, null, user.roles.map(r => r.name));
    }

    async getByEmail(email) {
        const user = await UserModel.findOne({ email: email }).populate('roles');
        if (!user) return null;
        // for internal use (e.g., login), we might need the password, so we include it here
        return new User(user._id.toString(), user.name, user.email, user.password, user.roles);
    }

    async create(userEntity) {
        const newUser = new UserModel({
            name: userEntity.name,
            email: userEntity.email,
            password: userEntity.password,
            roles: userEntity.roles
        });
        const savedUser = await newUser.save();
        return new User(savedUser._id.toString(), savedUser.name, savedUser.email, null, savedUser.roles);
    }

    async update(id, userEntity) {
        const updateData = {};
        if (userEntity.name) updateData.name = userEntity.name;
        if (userEntity.email) updateData.email = userEntity.email;
        if (userEntity.password) updateData.password = userEntity.password;
        if (userEntity.roles) updateData.roles = userEntity.roles;

        const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, { new: true }).populate('roles');

        if (!updatedUser) return null;
        return new User(updatedUser._id.toString(), updatedUser.name, updatedUser.email, null, updatedUser.roles.map(r => r.name));
    }

    async delete(id) {
        await UserModel.findByIdAndDelete(id);
    }
}

module.exports = UserMongoRepository;
