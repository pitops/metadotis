# metadotis

## Run the server
```npm start```

## To test
```npm test```

## API

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
