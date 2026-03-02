import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { ChatSchema } from 'src/entity-schemas/chat.schema';
import { CommentSchema } from 'src/entity-schemas/comment.schema';
import { FollowingSchema } from 'src/entity-schemas/following.schema';
import { MessageSchema } from 'src/entity-schemas/message.schema';
import { PostSchema } from 'src/entity-schemas/post.schema';
import { UserSchema } from 'src/entity-schemas/user.schema';

config();

const models = [
    { name: 'User', schema: UserSchema },
    { name: 'Following', schema: FollowingSchema },
    { name: 'Post', schema: PostSchema },
    { name: 'Comment', schema: CommentSchema },
    { name: 'Chat', schema: ChatSchema },
    { name: 'Message', schema: MessageSchema }
]
    
@Global()
@Module({
    imports: [
        MongooseModule.forRoot(process.env.DB_URI),
        MongooseModule.forFeature(models),
    ],
    exports: [MongooseModule]
})
export class DatabaseModule {}
