import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksRepository extends Repository<Task> {
    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager());
    }

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { search, status } = filterDto;
        const query = this.createQueryBuilder('task');

        if (status) {
            query.andWhere('tasks.status = :status', { status })
        }

        if (search) {
            query.andWhere('task.title LIKE LOWER(:search) OR task.description LIKE LOWER(:search)', { search: `%${search}%` })
        }

        const tasks = await query.getMany();

        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN
        });
        await this.save(task);
        return task;
    }

    async deleteTask(id: string): Promise<void> {
        const found = await this.findOneBy({ id });
        if (!found) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        await this.delete(id);
    }
}