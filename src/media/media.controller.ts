import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors, Query, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ResponseData } from '../response-data';
import { Media, MediaResponse } from './schemas/media.schema';
import { MediaService } from './media.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('medias')
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Get()
    async findAllMedia(@Query() query: ExpressQuery): Promise<Media[]> {
        return await this.mediaService.findAll(query);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<ResponseData<MediaResponse | string>> {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        try {
            return new ResponseData<MediaResponse>(await this.mediaService.createMedia(file), HttpStatus.OK, 'Uploaded Successfully');
        } catch (error) {
            return new ResponseData<string>('Failed to upload avatar', HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
        }
    }
    @Get('load/:id')
    async getImage(@Param('id') url: string, @Res() res: Response) {
        try {
            const media = await this.mediaService.findMediaByUrl(url);
            const downloadStream = await this.mediaService.getFileById(media.url);
            if (!downloadStream) {
                return res.status(HttpStatus.NOT_FOUND).send('media not found');
            }
            res.setHeader('Content-Type', media.mime_type); // Set the correct MIME type
            downloadStream.on('data', (chunk) => {
                res.write(chunk);
            });

            downloadStream.on('end', () => {
                res.end();
            });

            downloadStream.on('error', (err) => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error retrieving image');
            });

        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error retrieving image');
        }
    }
}
