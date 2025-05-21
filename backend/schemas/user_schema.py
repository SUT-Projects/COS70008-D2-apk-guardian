
from datetime import datetime
from bson.timestamp import Timestamp


class User:
    # account status: 0 -> Pending | 1 -> Active | 2 -> Suspended | 3 -> Inactive
    def __init__(self, name, email, password, user_type, department,
                 _id=None,
                 created_date=Timestamp(datetime.now(), 1),
                 updated_date=Timestamp(datetime.now(), 1),
                 account_status=1
                 ):
        self._id = _id
        self.name = name
        self.email = email
        self.password = password
        self.user_type = user_type
        self.department = department
        self.created_date = created_date
        self.updated_date = updated_date
        self.account_status = account_status

    def to_json(self):
        return {
            "_id": None if self._id is None else self._id,
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "user_type": self.user_type,
            "department": self.department,
            "account_status": self.account_status,
            "created_date": Timestamp(datetime.now(), 1).as_datetime() if self.created_date is None
            else self.created_date.as_datetime(),
            "updated_date": Timestamp(datetime.now(), 1).as_datetime() if self.updated_date is None
            else self.updated_date.as_datetime()
        }

    def to_bson(self):
        return {
            "_id": None if self._id is None else self._id,
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "user_type": self.user_type,
            "department": self.department,
            "account_status": self.account_status,
            "created_date": Timestamp(datetime.now(), 1) if self.created_date is None else self.created_date,
            "updated_date": Timestamp(datetime.now(), 1) if self.updated_date is None else self.updated_date
        }

    @staticmethod
    def to_object(bson_document):
        created_date = bson_document["created_date"] if bson_document["created_date"] is not str else (
            Timestamp(datetime.strptime(bson_document["created_date"], "%a, %d %b %Y %H:%M:%S %Z"), 1))
        updated_date = bson_document["updated_date"] if bson_document["updated_date"] is not str else (
            Timestamp(datetime.strptime(bson_document["updated_date"], "%a, %d %b %Y %H:%M:%S %Z"), 1))

        return User(
            _id=None if bson_document["_id"] is None else str(
                bson_document["_id"]),
            name=bson_document["name"],
            email=bson_document["email"],
            password=bson_document["password"],
            department=bson_document["department"],
            user_type=bson_document["user_type"],
            account_status=bson_document["account_status"],
            created_date=Timestamp(datetime.now(), 1) if bson_document["created_date"] is None else
            created_date,
            updated_date=Timestamp(datetime.now(), 1) if bson_document["updated_date"] is None else
            updated_date
        )
