import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Route {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    dept: string;

    @Column()
    dest: string;

    @Column()
    acft: string;

    @Column()
    route: string;

    @Column()
    notes: string;
}