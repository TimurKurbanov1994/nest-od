## Стек:
DB: PostgresSQL

Framework: NestJS 

## Описание

Реализован CRUD для сущностей User и Tags.
1) Пароли не хранятся в открытом виде
2) Реализована валидация полей на api запросы с кодами ответов и сообщениями об ошибке в теле ответа.
3) JWT bearer token авторизации живет 30 минут
4) Реализован endpoint для обновления токена
5) Использованы DTO
6) Добавлена генерация swagger документации для api методов.


### **User:**

| field         | type        |
| ------------- |:-----------:|
| uid           | uuid        |
| email         | string(100) |
| password      | string(100) | 
| nickname      | string(30)  |

**password**: должен содержать как минимум одну цифру, одну заглавную и одну строчную буквы.

**password**: минимальная длинна 8 символов

### **Tag**

| field         | type           |
| ------------- |:--------------:|
| id            | int            |
| creator       | uuid           |
| name          | string(40)     |
| sortOrder     | int default(0) |

**creator** uid пользователя создавшего тэг, только он может его менять и удалять из базы


## Список API endpoint

- POST /signin

```json
{
  "email": "example@exe.com",
  "password": "example",
  "nickname": "nickname"
}
```
RETURN:

```json
{
  "token": "token",
  "expire": "1800"
}
```

---
- POST /login

```json
{
  "email": "example@exe.com",
  "password": "example"
}
```

RETURN:
```json
{
  "token": "token",
  "expire": "1800"
}
```

---
- POST /logout
  
  HEADER: ```Authorization: Bearer {token}```

**Ниже идущие api закрыты под авторизацией**

---
- GET /user

  HEADER: ```Authorization: Bearer {token}```

RETURN:
```json
{
  "email": "example@exe.com",
  "nickname": "example",
  "tags": [
    {
      "id": "id",
      "name": "example",
      "sortOrder": "0"
    }
  ]
}
```

---
- PUT /user
  
  HEADER: ```Authorization: Bearer {token}```

```json
{
  "email": "example@exe.com",
  "password": "example",
  "nickname": "example"
}
```
RETURN :

```json
{
  "email": "example@exe.com",
  "nickname": "example"
}
```

---
- DELETE /user

  HEADER: ```Authorization: Bearer {token}```

---
- POST /tag
  
  HEADER: ```Authorization: Bearer {token}```

```json
{
  "name": "example",
  "sortOrder": "0"
}
```

**sortOrder** опционально по default 0

RETURN :

```json
{
  "id": "id",
  "name": "example",
  "sortOrder": "0"
}
```

---
- GET /tag/{id}

  HEADER: ```Authorization: Bearer {token}```


RETURN :
```json
{
  "creator": {
    "nickname": "example",
    "uid": "exam-pl-eUID"
  },
  "name": "example",
  "sortOrder": "0"
}
```


---
- GET /tag?sortByOrder&sortByName&offset=10&length=10

  HEADER: ```Authorization: Bearer {token}```

**sortByOrder**, **offset** **SortByName**, **length** опциональны

**length** количество элементов в выборке

RETURN :

```json
{
  "data": [
    {
      "creator": {
        "nickname": "example",
        "uid": "exam-pl-eUID"
      },
      "name": "example",
      "sortOrder": "0"
    },
    {
      "creator": {
        "nickname": "example",
        "uid": "exam-pl-eUID"
      },
      "name": "example",
      "sortOrder": "0"
    }
  ],
  "meta": {
    "offset": 10,
    "length": 10,
    "quantity": 100
  }
}
```

**quantity** общее количество элементов в выборке

---
- PUT /tag/{id}

  HEADER: ```Authorization: Bearer {token}```

Тэг может менять только владелец

```json
{
  "name": "example",
  "sortOrder": "0"
}
```

**name** или **sortOrder** опциональны

RETURN :
```json
{
  "creator": {
    "nickname": "example",
    "uid": "exam-pl-eUID"
  },
  "name": "example",
  "sortOrder": "0"
}
```

---

- DELETE /tag/{id}

HEADER: ```Authorization: Bearer {token}```


Тэг может удалить только владелец

---

---
- POST /user/tag

  HEADER: ```Authorization: Bearer {token}```

```json
{
  "tags": [1, 2]
}
```

Проверяем тэги на наличие в базе и добавляем к пользователю пачкой (атомарной операцией)

RETURN :

```json
{
  "tags": [
    {
      "id": 1,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 2,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 3,
      "name": "example",
      "sortOrder": "0"
    }
  ]
}
```

---
- DELETE /user/tag/{id}

  HEADER: ```Authorization: Bearer {token}```

RETURN :

```json
{
  "tags": [
    {
      "id": 1,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 2,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 3,
      "name": "example",
      "sortOrder": "0"
    }
  ]
}
```

---
- GET /user/tag/my

  HEADER: ```Authorization: Bearer {token}```

Отдаем список тэгов в которых пользователь является создателем

RETURN :

```json
{
  "tags": [
    {
      "id": 1,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 2,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 3,
      "name": "example",
      "sortOrder": "0"
    }
  ]
}
```

