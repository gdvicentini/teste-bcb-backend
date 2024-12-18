import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from '../../client-module/entities/client-module.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column({ default: false })
  isWhatsApp: boolean;

  @Column()
  text: string;

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => Client, (client) => client.id, { eager: true })
  client: Client;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
