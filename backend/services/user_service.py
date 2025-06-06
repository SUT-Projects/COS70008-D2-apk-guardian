from factory import get_database_instance
from flask import request, jsonify
from schemas import User
from hashlib import sha256
from bson.timestamp import Timestamp
from datetime import datetime
import traceback


class UserService:    
    def __init__(self):
        self.db = get_database_instance()
        self.collection_name = "users"
        
    def find_user_by_email(self, email, **kwagrs) -> None:
        filter_dict: dict = {
            "email": email
        }
        
        if "password" in kwagrs:
            filter_dict["password"] = sha256(kwagrs["password"].encode()).hexdigest()

        fetched_document = self.db.get_collection(self.collection_name).find_one(filter_dict)
        return fetched_document if fetched_document is not None else None
    
    
    def get_user_by_id(self, user_id):
        pass

    def get_user_by_filters(self, filters: dict):
        if len(filters) == 0:
            return jsonify({
                "error": True,
                "message": "No filters provided to search for user",
            }), 200
        
        try:
            fetched_documents = list(self.db.get_collection(self.collection_name).find(filters))
            fetched_users = [User.to_object(user_doc).to_json() for user_doc in fetched_documents]
            
            return jsonify({
                "error": False,
                "total_users": len(fetched_users),
                "data": fetched_users,
            }), 200

        except Exception as ex:
            print(ex)
            return jsonify({
                "error": True,
                "message": str(ex),
                "status": 500
            }), 500
    
    def find_all(self):
        """
        Retrieves all documents from the specified collection, sorted by the "name" field.

        This method fetches all documents from the collection and returns them as a list.
        The documents are sorted alphabetically by their "name" field before returning.

        **Returns:**
        - On success: A list of dictionaries representing the retrieved user documents, sorted by "name".
        - On error: A JSON object with error details, including:
            - `error`: A boolean flag indicating an error (True).
            - `message`: A description of the error that occurred.
            - `status`: An HTTP status code representing the error type (e.g., 500 for internal server error).

        **Raises:**
        - Exception: Any unexpected exceptions during the retrieval process.
        """

        try:
            fetched_documents = list(self.db.get_collection(self.collection_name).find())
            fethed_user_documents = [User.to_object(user_doc).to_json() for user_doc in fetched_documents]
            return jsonify({
                "data": fethed_user_documents,
                "total_users": len(fethed_user_documents),
                "status": 200,
            }), 200
        except Exception as ex:
            print(ex)
            return {
                "error": True,
                "message": str(ex),
                "status": 500
            }

    def create_user(self):
        """
        Creates a new user document in the specified collection based on the provided JSON request.

        This method expects a JSON request body containing the user information.
        It validates for existing users with the same email address before creating a new document.

        **Request Body:**
        - `name` (str): The name of the user. (Required)
        - `email` (str): The unique email address of the user. (Required)
        - `password` (str): The user's password. (Required)
        - `userType` (int, optional): An integer representing the user type. Defaults to 0.
        - `department` (str, optional): The user's department.

        **Returns:**
        - On success: A JSON object containing the newly created user document with `_id` converted to a string.
        - On duplicate email error: A JSON object with a message indicating the email already exists.
            This response has an `error` flag set to `False` and an HTTP status code of 200.
        - On error: A JSON object with error details, including:
            - `message`: A description of the error that occurred.
            - `error`: A boolean flag indicating an error (True).
            - `status`: An HTTP status code representing the error type (e.g., 500 for internal server error).

        **Raises:**
        - Exception: Any unexpected exceptions during the creation process.
        """
        try:
            request_json = request.get_json()
            fetched_document = self.db.get_collection(self.collection_name).find_one({
                "email": request_json["email"]
            })

            if fetched_document is not None:
                return {
                    "message": f"user already exists with {request_json['email']}. Please use different email address",
                    "status": 200,
                    "error": False,
                }

            user: User = User(
                name=request_json["name"],
                email=request_json["email"],
                password=sha256(request_json["password"].encode()).hexdigest(),
                user_type=0 if request_json["userType"] is None else request_json["userType"],
                account_status=1,
                created_date=Timestamp(datetime.now(), 1),
                updated_date=Timestamp(datetime.now(), 1)
            )

            inserted_document = self.db.create_one(self.collection_name, user.to_bson())
            if inserted_document is str:
                return inserted_document

            inserted_document["_id"] = str(inserted_document["_id"])
            inserted_document["created_date"] = inserted_document["created_date"].as_datetime()
            inserted_document["updated_date"] = inserted_document["updated_date"].as_datetime()
            return jsonify(inserted_document)
        except Exception as ex:
            print(ex)
            return {
                "error": True,
                "message": str(ex),
                "status": 500
            }


    def update_user(self, user_id, user_data):
        try:
            user_data["updated_date"] = Timestamp(datetime.now(), 1)
            updated_result = self.db.update_one(self.collection_name, user_id, user_data)

            if isinstance(updated_result, str):
                # If the result is an error message string
                return {"error": True, "message": updated_result}

            # 3b) PyMongo UpdateResult
            if hasattr(updated_result, "modified_count"):
                if updated_result.modified_count == 0:
                    return {
                        "error": True,
                        "message": "No changes made or user not found."
                    }
                return {
                    "error": False,
                    "message": "User updated successfully."
                }

            # 3c) wrapper returned the updated document as a dict
            updated_result = User.to_object(updated_result).to_json()
            if isinstance(updated_result, dict):
                return {
                    "error": False,
                    "message": "User updated successfully.",
                    "data": updated_result
                }

            # 3d) unexpected return type
            return {
                "error": True,
                "message": f"Unexpected update result type: {type(updated_result)}"
            }

        except Exception as e:
            print(e)
            traceback.print_exc()
            return {"error": True, "message": f"An error occurred: {str(e)}"}

    def delete_user(self, user_id):
        pass