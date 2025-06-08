from pydantic import BaseModel

from schemas.exceptions import InvalidData


def validate(data: dict, schema: BaseModel):
    valid = False
    for key in data.keys():
        if not hasattr(schema, key):

            break
    else:
        if len(data) > 0:
            valid = True

    if not valid:
        raise InvalidData
