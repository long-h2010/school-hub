import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import Gender from 'enums/gender.enum';
import Role from 'enums/role.enum';
import UserStatus from 'enums/user-status.enum';

@Schema({ timestamps: true })
export class User {
    @Prop({ unique: true })
    studentId: string;

    @Prop({ select: false })
    password: string;

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop({ default: '/default-avatar.png' })
    avatar: string;

    @Prop()
    coverPhoto: string;

    @Prop({ enum: Gender })
    gender: string;

    @Prop()
    birthday: Date;

    @Prop()
    bio: string;

    @Prop({ enum: Role, default: Role.user })
    role: string;

    @Prop({ enum: UserStatus, default: UserStatus.active })
    status: string;

    @Prop()
    statusExpiry: Date

    @Prop({ select: false })
    otp: string;

    @Prop({ select: false })
    otpExpiry: Date;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
