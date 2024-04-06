import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class User {
  @Prop()
  restaurantname: string;

  @Prop()
  ownername: string;

  @Prop()
  emailid: string;

  @Prop()
  password: string;

  @Prop()
  address: string;

  @Prop()
  confirmpassword: string;
  @Prop({
    default:
      'https://as1.ftcdn.net/v2/jpg/06/33/54/78/1000_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg',
  })
  image: string;

  @Prop({
    default:
      'https://as1.ftcdn.net/v2/jpg/06/33/54/78/1000_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg',
  })
  resimage: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: Date.now })
  date: Date;

  @Prop()
  isActive:boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
