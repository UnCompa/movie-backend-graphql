import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Genre } from 'src/genres/entities/genre.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity()
@ObjectType()
export class Movie {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;
  
  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => Int)
  year: number;

  @Column()
  @Field(() => String)
  posterUrl: string;

  @Field(() => Genre)
  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[];

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}