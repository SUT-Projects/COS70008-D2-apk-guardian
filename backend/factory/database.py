from pymongo import MongoClient
from pymongo.errors import PyMongoError
import config
from bson.objectid import ObjectId


class Database:
    def __init__(self, database_name="quiz_database") -> None:
        self.client = MongoClient(config.MONGODB_URI)
        self.db_instance = self.client[database_name]

    def get_collection(self, collection_name):
        return self.db_instance.get_collection(collection_name)

    def check_id_existence(self, collection_name, element_id):
        if not ObjectId.is_valid(element_id):
            raise ValueError("Invalid Id")

        fetched_document_count = self.db_instance.get_collection(collection_name).count_documents({
            "_id": ObjectId(element_id)
        })
        return fetched_document_count > 0

    def find_all(self, collection_name):
        """
        Finds all elements from a specified collection.

        Args:
            collection_name: The name of the MongoDB collection to query.

        Returns:
            A list containing all elements from the specified collection.

        Raises:
            NotImplementedError: If the subclass does not implement this method.
        """

        pass

    def find_by_id(self, collection_name, id):
        """
        Finds an element by its ID from a specified collection.

        Args:
            collection_name: The name of the MongoDB collection to query.
            id: The ID of the element to find.

        Returns:
            The element matching the provided ID, or None if not found.

        Raises:
            NotImplementedError: If the subclass does not implement this method.
        """

        pass

    def create_one(self, collection_name, element):
        """Inserts a single document into the specified collection and returns the inserted document.

            Args:
                collection_name (str): The name of the collection to insert into.
                element (dict): The document to insert.

            Returns:
                dict or str: The inserted document on success, or an error message on failure.

            Raises:
                PyMongoError: If a MongoDB-specific error occurs during insertion.
        """
        try:
            if "_id" in element:
                del element["_id"]
            # Insert the element into the collection
            inserted_result = self.db_instance.get_collection(collection_name).insert_one(element)

            # Retrieve the inserted document for verification (optional)
            return self.get_collection(collection_name).find_one({'_id': inserted_result.inserted_id})
        except PyMongoError as pyError:
            # Handle MongoDB-specific errors gracefully (e.g., logging, detailed error messages)
            print(f">>> insertion_error for {collection_name}: {str(pyError)}")
            return str(pyError)
        except Exception as exe:
            # Catch more general exceptions for unexpected situations
            print(f">>> unknown error occur: ${exe}")
            return f"Unknown Error: {str(exe)}"

    def update_one(self, collection_name, element_id, element):
        """
        Updates an existing element in a specified MongoDB collection by its ID.

        Args:
            collection_name (str): The name of the MongoDB collection to update in.
            element_id (str or ObjectId): The ID of the element to update.
            element (dict): A dictionary containing the updated data for the element.
                It should not contain an "_id" key as this field is used internally by MongoDB.

        Returns:
            The updated element object (optional). This section is currently commented out.
            If an error occurs, a string representing the error message is returned.

        Raises:
            PyMongoError: If a MongoDB-specific error occurs during the update operation.
            Exception: If an unexpected error occurs during the update operation.
        """

        try:
            # _id cannot be update so removing from object
            if "_id" in element:
                del element["_id"]

            self.db_instance.get_collection(collection_name).update_one({
                "_id": ObjectId(element_id)
            }, {
                "$set": element
            })

            # Retrieve the updated document for verification (optional)
            return self.get_collection(collection_name).find_one({'_id': ObjectId(element_id)})
        except PyMongoError as pyError:
            # Handle MongoDB-specific errors gracefully (e.g., logging, detailed error messages)
            print(f">>> updation_error for {collection_name}: {str(pyError)}")
            return str(pyError)
        except Exception as exe:
            # Catch more general exceptions for unexpected situations
            print(f">>> unknown error occur: ${exe}")
            return f"Unknown Error: {str(exe)}"

    def delete_one(self, collection_name, element_id):
        """
        Deletes an element from a specified collection by its ID.

        Args:
            collection_name: The name of the MongoDB collection to delete from.
            element_id: The ID of the element to delete.

        Returns:
            None

        Raises:
            NotImplementedError: If the subclass does not implement this method.
        """

        pass
