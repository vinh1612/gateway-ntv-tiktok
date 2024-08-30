import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
})

export class Media {
    @Prop()
    media_id: string;
    
    @Prop()
    file_name: string;

    @Prop()
    mime_type: string;

    @Prop()
    size: number;

    @Prop()
    encoding: string;

    @Prop()
    url: string;
};

export class MediaResponse {
    @Prop()
    media_id: string;

    @Prop()
    url: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);