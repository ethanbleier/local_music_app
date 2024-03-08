import { readdir } from 'fs';
import { extname } from 'path';
import { createServer } from 'http';
import { parse } from 'url';

const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/get-mp3-files') {
        const folderPath = 'src/assets/audio';
        loadMP3Files(folderPath, res);
    } else {
        // Serve other static files or routes
    }
});

function loadMP3Files(folderPath, res) {
    readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.statusCode = 500;
            res.end('Internal Server Error');
            return;
        }

        const mp3Files = files.filter(file => extname(file).toLowerCase() === '.mp3');

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(mp3Files));
    });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});