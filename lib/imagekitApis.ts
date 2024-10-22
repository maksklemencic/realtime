export async function uploadPicture(folder: string, file: File) {
    const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('folder', folder);

        try {
            const response = await fetch('/api/imagekit/upload', {
                method: 'POST',
                body: formData,
            });

            return response;
            
        } catch (error) {
            throw error;
        }
}