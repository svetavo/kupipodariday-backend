import { BaseEntity } from '../../../utils/base.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { IsNumber, IsPositive, IsUrl, Length } from 'class-validator';
import { Offer } from 'src/modules/offers/entities/offer.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsNumber()
  @IsPositive()
  price: number;

  @Column({ default: 0 })
  @IsNumber()
  @IsPositive()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  @IsNumber()
  copied: number;
}
