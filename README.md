## Node Version
v18.17.1

## Setup Instructions
Install Required Packages: 
    Run 'npm install' to install all required packages.
Start the Project: 
    Run 'npm start' to start the project on port 5555.


## Preformance Testing
- AutoCannon has been used for API testing due to its efficiency in handling HTTP/1.1 benchmarking.

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