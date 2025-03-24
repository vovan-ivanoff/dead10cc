# how to start this container without compose
```bash
docker build ./ -t model
docker run --rm -p 8080:8080 -v /some/absolute/path:/app/model model
```
where `/some/absolute/path` is somewhere in filesystem? where downloaded files from container like pretrained model should be saved
