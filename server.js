const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    if (pathname === '/files') {
        const folderPath = 'src/assets/audio';
        loadMP3Files(folderPath, res);
    } else if (pathname === '/') {
        pathname = 'index.html';
    } else if (pathname === '/mp3-list') {
        const folderPath = 'src/assets/audio';
        loadMP3Files(folderPath, res);
    } else {
        // fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
        //     if (err) {
        //         res.writeHead(500);
        //         res.end('Internal Server Error');
        //     } else {
        //         res.writeHead(200, { 'Content-Type': 'text/html' });
        //         res.end(data);
        //     }
        // });
    }

    // Construct the path to the requested file
    const filePath = path.join(__dirname, 'public', pathname);

    // Read the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // If file not found, return 404
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                // For other errors, return 500
                res.writeHead(500);
                res.end('Internal Server Error');
            }
        } else {
            // If file found, set appropriate Content-Type header and send file contents
            const contentType = getContentType(filePath);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });

// Function to get content type based on file extension
function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        case '.json':
            return 'application/json';
        case '.png':
            return 'image/png';
        case '.jpg':
            return 'image/jpg';
        default:
            return 'text/plain';
    }
}

});

function loadMP3Files(folderPath, res) {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.statusCode = 500;
            res.end('Internal Server Error');
            return;
        }

        const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');
        let mp3ListHtml = '<h2>MP3 List</h2><url>';
        mp3Files.forEach(file=> {
            mp3ListHtml += '<li>${file}</li>';
        })

        mp3ListHtml += '</ul>';

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(mp3ListHtml);
    });
}

function createPlaylist(folderPath, mp3Files) {
    mp3Files.forEach(file => {
        const li = document.createElement('li');
        li.textContent = file;
        li.addEventListener('click', () => {
            const filePath = `${folderPath}/${file}`;
            audioPlayer.src = filePath;
            audioPlayer.play();
        });
        playlistElement.appendChild(li);
    });
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});