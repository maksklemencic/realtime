import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import * as formidable from 'formidable'
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import { json } from 'stream/consumers';

var imagekit = new ImageKit({
    publicKey: "public_PvckIWac1mGZclUiJnDqK/H+vjc=",
    privateKey: "private_Zg84JpJ+QdTXvX/yazAaACcD65Y=",
    urlEndpoint: "https://ik.imagekit.io/97nojs2ng"
});

export async function POST(request: NextRequest) {
    try {
        if (request.method !== 'POST') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const formData = await request.formData();
        const fileBlob = formData.get('file') as Blob;
        const fileName = formData.get('fileName') as string;
        const userId = formData.get('userId') as string;

        if (!fileBlob) {
            return new NextResponse('File is required', { status: 400 });
        }

        const fileBuffer: Buffer = Buffer.from(await fileBlob.arrayBuffer());
        if (!fileBuffer) {
            return new NextResponse('File is required', { status: 400 });
        }

        const response = await new Promise((resolve, reject) => {
            imagekit.upload(
                {
                    file: fileBuffer,
                    fileName: fileName,
                    folder: '/users/' + userId  + '/profile-pictures',
                },
                function (error, result) {
                    if (error) {
                        reject(error);
                    } else if (result) {
                        // console.log(result);
                        resolve(result.url);
                    }
                }
            );
        });

        return new NextResponse(JSON.stringify({ url: response }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }
    catch (error) {
        return new NextResponse(JSON.stringify({ error: error }), { status: 500 });
    }
}
