from pydantic import BaseModel

from schemas.exceptions import InvalidData


def validate(data: dict, schema: BaseModel):
    schema_fields = set(schema.__annotations__.keys())
    data_fields = set(data.keys())
    # Лишние поля, которых нет в схеме
    extra_fields = data_fields - schema_fields
    # Отсутствующие обязательные поля (без дефолта и None)
    required_fields = {k for k, v in schema.__annotations__.items() if not (k == 'id' or k == 'description' or k == 'tags' or k == 'seller')}
    missing_fields = required_fields - data_fields
    if extra_fields or missing_fields:
        detail = f"invalid data. Extra fields: {list(extra_fields)}. Missing fields: {list(missing_fields)}"
        raise InvalidData(detail=detail)
    if len(data) == 0:
        raise InvalidData(detail="invalid data. No fields provided")
