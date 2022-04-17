import { Report } from "../reports/report.entity";
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[]

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @AfterInsert()
  logInsert() {
    console.log('User created successfully: ', this.id)
  }

  @AfterUpdate()
  logUpdate() {
    console.log('User updated successfully: ', this.id)
  }

  @AfterRemove()
  logRemove() {
    console.log('User removed successfully: ', this.id)
  }
}