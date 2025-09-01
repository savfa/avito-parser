import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AvitoKeywordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  keyword: string;

  @Column({ default: true })
  active: boolean;
}