import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Credit } from './credit.entity';

@Entity('collaborators')
export class Collaborator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string;

  @Column('text', { unique: true })
  dni: string;

  @Column('text', { nullable: true })
  phone: string;

  @Column('text', { nullable: true })
  address: string;

  @ManyToOne(() => User, (user) => user.collaborators)
  admin: User;

  @OneToMany(() => Credit, (credit) => credit.collaborator)
  credits: Credit[];
}
