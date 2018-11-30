# Database creation
```
CREATE DATABASE `sacmlogs` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
```

# Connection problems with mySQL >= 8.0
```
SequelizeConnectionError: Client does not support authentication protocol requested by server; consider upgrading MySQL client:
```
https://github.com/mysqljs/mysql/issues/1507#issuecomment-242885003
```
ALTER USER 'testuser' IDENTIFIED WITH mysql_native_password BY 'test123';
```

