import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/task/entities/task.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) { }

  async create(createUserDto: CreateUserDto) {
    try {
      if (Object.keys(createUserDto).length < 1) {
        throw new Error("object can't be null");
      }

      var user = this.userRepo.create(createUserDto);
      await this.userRepo.save(user);
    } catch (error) {
      return error;
    }
    return user;
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id: id }, relations: ["task"] });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    var updateUser = await this.findOne(id);

    if (updateUser === undefined) {
      throw new NotFoundException();
    }

    Object.assign(updateUser, updateUserDto);

    return this.userRepo.save(updateUser);
  }

  async remove(id: number) {
    var deleteUser = await this.findOne(id);

    if (deleteUser === undefined) {
      throw new NotFoundException();
    }

    return this.userRepo.remove(deleteUser);
  }

  async getFilter(name: string = undefined, email: string = undefined, roleId: number = undefined) {
    var users = this.userRepo.find({ relations: ["task"], where: { name: name !== undefined ? name : null, email: email !== undefined ? email : null, roleId: roleId !== undefined ? roleId : null } });

    var userTasks = (await users).map(x => {
      var donetasks = x.task.filter(x => x.status === 2);
      var tasksDone = 0;
      var estimatedHoursOfTasks = 0;
      if (donetasks.length > 0) {
        tasksDone = donetasks.length;
        estimatedHoursOfTasks = donetasks.map(x => x.hoursEstimated).reduce((a, c) => a + c);
      }
      return {
        name: x.name,
        doneTasks: tasksDone,
        acumulatedEffort: estimatedHoursOfTasks
      }
    });

    var replyObject = {
      users: await users,
      userTasks: userTasks
    }
    return replyObject;
  }
}
