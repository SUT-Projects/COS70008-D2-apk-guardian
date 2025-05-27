
from datetime import datetime, timezone
from bson.timestamp import Timestamp


class User:
    # account status: 0 -> Pending | 1 -> Active | 2 -> Suspended | 3 -> Inactive
    # user_type: 0 -> Admin | 1 -> User | 2 -> Guest
    def __init__(self, name, email, password, user_type,
                 _id=None,
                 created_date=Timestamp(datetime.now(), 1),
                 updated_date=Timestamp(datetime.now(), 1),
                 last_login_date=None,
                 account_status=1
                 ):
        self._id = _id
        self.name = name
        self.email = email
        self.password = password
        self.user_type = user_type
        self.created_date = created_date
        self.updated_date = updated_date
        self.last_login_date = last_login_date
        self.account_status = account_status

    def to_json(self):
        def fmt(ts) -> str:
            # ts may be a BSON Timestamp or a datetime.datetime
            if isinstance(ts, Timestamp):
                dt = ts.as_datetime()
            elif isinstance(ts, datetime):
                dt = ts
            else:
                raise TypeError(f"Unexpected type for timestamp: {type(ts)}")
            # force UTC and format as ISO-8601
            return dt.replace(tzinfo=timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")

        now_utc = datetime.now(timezone.utc)

        created = self.created_date.as_datetime() if self.created_date else now_utc
        updated = self.updated_date.as_datetime() if self.updated_date else now_utc
        last_login = self.last_login_date.as_datetime() if self.last_login_date else None

        return {
            "_id": str(self._id) if self._id else None,
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "user_type": self.user_type,
            "account_status": self.account_status,
            "created_date": fmt(created),
            "updated_date": fmt(updated),
            "last_login_date": fmt(last_login) if last_login else None,
        }

    def to_bson(self):
        return {
            "_id": None if self._id is None else self._id,
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "user_type": self.user_type,
            "account_status": self.account_status,
            "created_date": Timestamp(datetime.now(), 1) if self.created_date is None else self.created_date,
            "updated_date": Timestamp(datetime.now(), 1) if self.updated_date is None else self.updated_date,
            "last_login_date": None if self.last_login_date is None else self.last_login_date
        }

    @staticmethod
    def to_object(bson_document):
        created_date = bson_document["created_date"] if bson_document["created_date"] is not str else (
            Timestamp(datetime.strptime(bson_document["created_date"], "%a, %d %b %Y %H:%M:%S %Z"), 1))
        updated_date = bson_document["updated_date"] if bson_document["updated_date"] is not str else (
            Timestamp(datetime.strptime(bson_document["updated_date"], "%a, %d %b %Y %H:%M:%S %Z"), 1))
        
        last_login_date = None
        if "last_login_date" in bson_document and bson_document["last_login_date"] is not None:
            last_login_date = None if bson_document["updated_date"] is not str \
            else (Timestamp(datetime.strptime(bson_document["last_login_date"], "%a, %d %b %Y %H:%M:%S %Z"), 1))

        return User(
            _id=None if bson_document["_id"] is None else str(
                bson_document["_id"]),
            name=bson_document["name"],
            email=bson_document["email"],
            password=bson_document["password"],
            user_type=bson_document["user_type"],
            account_status=bson_document["account_status"],
            created_date=Timestamp(datetime.now(), 1) if bson_document["created_date"] is None else
            created_date,
            updated_date=Timestamp(datetime.now(), 1) if bson_document["updated_date"] is None else
            updated_date,
            last_login_date=None if "last_login_date" not in bson_document or bson_document["last_login_date"] is None else
            last_login_date
        )
