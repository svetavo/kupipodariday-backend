import { BaseEntity } from 'src/utils/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsUrl, Length } from 'class-validator';
import { Wish } from 'src/modules/wishes/entities/wish.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @Length(1, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @OneToMany(() => Wish, (wish) => wish.link)
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
