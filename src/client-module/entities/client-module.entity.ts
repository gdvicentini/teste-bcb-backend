import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Message } from '../../message/entities/message.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ unique: true })
  cnpj: string;

  @Column()
  companyName: string;

  @Column({ default: 'pre-pago' })
  planType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  creditLimit: number;

  @OneToMany(() => Message, (message) => message.client)
  messages: Message[];
}
