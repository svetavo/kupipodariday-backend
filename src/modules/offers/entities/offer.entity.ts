import { BaseEntity } from '../../../utils/base.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Wish } from 'src/modules/wishes/entities/wish.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({ default: 0 })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
