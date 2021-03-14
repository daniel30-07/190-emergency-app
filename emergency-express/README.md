# 190 Emergency App - Express Backend
A React-Native App that links people that are needing police help straight with the nearest police car available.

Backend server for managing the database (Mongodb) and auth of the app.

## Installation

From terminal install dependencies

```
$ cd emergency-express 
```

```
yarn
```

Create a MongoDB Atlas database on https://www.mongodb.com/ 

Connect to your application and copy de connection string:
```
mongodb+srv://<username>:<password>@your-db.d9con.mongodb.net/<dbname>?retryWrites=true&w=majority
```

Create a file named mongodb.js inside the config folder.

Add the Mongodb string with your personal db's information.
```
const mongodb = "mongodb+srv://<username>:<password>@your-db.d9con.mongodb.net/<dbname>?retryWrites=true&w=majority";

module.exports = mongodb;
```

## Running

```
$ node index.js
```



## Contributing

You can send how many PR's do you want, I'll be glad to analyse and accept them! And if you have any question about the project...

Email-me: danielborgesdecarvalho@gmail.com

Connect with me at [LinkedIn](https://www.linkedin.com/in/daniel-carvalho-0a4916122/)

Thank you!
