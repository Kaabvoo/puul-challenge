import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    hoursEstimated: number;

    @Column({ type: "date" })
    dueDate: string;

    @ManyToMany(() => User, user => user.task)
    @JoinTable({ name: "user_task", inverseJoinColumn: { name: "user", referencedColumnName: "id" }, joinColumn: { name: "task", referencedColumnName: "id" } })
    user: User[];
}