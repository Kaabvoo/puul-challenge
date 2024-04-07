import { Task } from "src/task/entities/task.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    email: string;

    // Deseable: Crear una tabla tipo "catalogo" que contenga los Roles
    @Column({ type: 'int' })
    roleId: number;

    @ManyToMany(() => Task, task => task.user)
    @JoinTable({ name: "user_task", joinColumn: { name: "user", referencedColumnName: "id" }, inverseJoinColumn: { name: "task", referencedColumnName: "id" } })
    task: Task[];
}