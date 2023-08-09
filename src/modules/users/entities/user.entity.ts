import { BaseEntity } from '../../../utils/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Wish } from 'src/modules/wishes/entities/wish.entity';
import { Offer } from 'src/modules/offers/entities/offer.entity';
import { Wishlist } from 'src/modules/wishlists/entities/wishlist.entity';

@Entity()
export class User extends BaseEntity {
  @Column({
    length: 30,
    unique: true,
    nullable: true,
  })
  username: string;

  @Column({
    length: 200,
    default: 'Пока ничего не рассказал о себе',
  })
  about: string;

  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
