import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GridFSBucket, MongoClient, ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Readable } from 'stream';
import { Media, MediaResponse } from './schemas/media.schema';
import { Query } from 'express-serve-static-core';

@Injectable()
export class MediaService {
    private bucket: GridFSBucket;

    constructor(
        @InjectModel('Media') private readonly mediaModel: Model<Media>
    ) {
        const client = new MongoClient(process.env.DB_URI);// Adjust connection string as needed
        const db = client.db('media'); // Adjust database name
        this.bucket = new GridFSBucket(db);
    }

    async findAll(query: Query): Promise<Media[]> {
        const resPerPage = Number(query.limit)|| 20
        const currentPage = Number(query.page) || 1
        const skip = (currentPage - 1) * resPerPage;
        
        const medias = await this.mediaModel
        .find({})
        .select('-_id -__v -encoding')
        .limit(resPerPage)
        .skip(skip)
        .exec();
        return medias;
    }

    async createMedia(file: Express.Multer.File): Promise<MediaResponse> {
        const readableStream = Readable.from(file.buffer); // Create a readable stream from the file buffer

        const uploadStream = this.bucket.openUploadStream(file.originalname, {
            contentType: file.mimetype,
            metadata: {
                encoding: file.encoding,
            },
        });

        // Pipe the file buffer to GridFS
        readableStream.pipe(uploadStream);
        
        return new Promise((resolve, reject) => {
            uploadStream.on('finish', async () => {
                const newMedia = new this.mediaModel({
                    media_id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
                    file_name: file.originalname,
                    mime_type: file.mimetype,
                    size: file.size,
                    encoding: file.encoding,
                    url: uploadStream.id.toString(), // Store the GridFS file ID as the URL
                });
                
                await newMedia.save();
                
                const mediaResponse = {
                    media_id: newMedia.media_id,
                    url: newMedia.url,
                };

                resolve(mediaResponse);
            });

            uploadStream.on('error', (error) => {
                reject(error);
            });
        });
    }

    async findMediaByUrl(url: string) {
        return this.mediaModel.findOne({ url }).exec();
    }


    async getFileById(id: string) {
        const objectId = new ObjectId(id);
        return this.bucket.openDownloadStream(objectId);
    }
}
