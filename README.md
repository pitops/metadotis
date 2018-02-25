# metadotis

enter description

### Setup

First you need to have NodeJS v8+ installed and PM2 installed globally by running `npm install -g pm2`

and then run
```npm setup```

### Run the server
```npm start```

### To test
```npm test```

### Note

Only .mp4 files are supported at the moment

### API

```
POST /api/magnet
BODY {magnet: <magnet link>}
```

```
GET /api/files?hash=<magnet hash>
response {files: [<file name>, ...]}
```

```
GET /api/file?hash=<magnet hash>&name=<file name>
response mp4 binary
```
