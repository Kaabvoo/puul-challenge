import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, LessThan, MoreThan, Repository } from 'typeorm';
import { getFilterTask } from './dto/get-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) { }

  async create(createTaskDto: CreateTaskDto) {
    try {
      if (Object.keys(createTaskDto).length < 1) {
        throw new Error("object can't be null");
      }

      var user = this.taskRepo.create(createTaskDto);
      await this.taskRepo.save(user);
    } catch (error) {
      return error;
    }
    return user;
  }

  getFilterTask(query: getFilterTask) {
    var tasks = this.taskRepo.find({
      relations: ["user"],
      order:
      {
        id: {
          direction: query.sortAsc ? "ASC" : "DESC"
        }
      },
      where: {
        dueDate: query.beforeDate !== undefined ? query.beforeDate ? LessThan(query.dueDate) : MoreThan(query.dueDate) : null,
        title: query.taskName !== undefined ? query.taskName : null,
        user: {
          id: query.userAssignedId.length > 0 ? ArrayContains(query.userAssignedId) : null,
          name: query.nameAsignee !== undefined ? query.nameAsignee : null,
          email: query.emailAsignee !== undefined ? query.nameAsignee : null
        }
      }
    });

    return tasks;
  }

  findAll() {
    return this.taskRepo.find();
  }

  findOne(id: number) {
    return this.taskRepo.findOne({ where: { id: id } });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    var updateUser = await this.findOne(id);

    if (updateUser === undefined) {
      throw new NotFoundException();
    }

    Object.assign(updateUser, updateTaskDto);

    return this.taskRepo.save(updateUser);
  }

  async remove(id: number) {
    var deleteUser = await this.findOne(id);

    if (deleteUser === undefined) {
      throw new NotFoundException();
    }

    return this.taskRepo.remove(deleteUser);
  }
}
