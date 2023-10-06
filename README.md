## Node Version
v18.17.1

## Setup Instructions
Install Required Packages: 
```
npm install
```
Start the Project: 
```
npm start
```


## Preformance Testing
Instructions to run the test
Install autocannon
```
npm install -g autocannon
```

Run the following command to test the read API
```
autocannon -c 100 -d 30 -p 1 http://127.0.0.1:5555/api/population/state/Florida/city/Orlando
```

Run the following command to test the write API
```
autocannon -c 100 -d 30 -p 1 -m PUT --body "5000" --headers "Content-Type: text/plain" http://127.0.0.1:5555/api/population/state/Florida/city/Orlando
```