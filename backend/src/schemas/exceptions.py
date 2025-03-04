from fastapi import HTTPException, status


class BException(HTTPException):
    status_code = 500
    detail = ""

    def __init__(self):
        super().__init__(status_code=self.status_code, detail=self.detail)


class UserAlreadyExistException(BException):
    status_code = status.HTTP_409_CONFLICT
    detail = "Пользователь уже существует"


class UnauthorizedException(BException):
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = "Не авторизован"


class IncorrectEmailOrPasswordException(BException):
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = "Неверная почта или пароль"


class TokenExpiredException(BException):
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = "Токен истек"


class TokenAbsentException(BException):
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = "Токен отсутствует"


class IncorrectTokenFormatExcepetion(BException):
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = "Неверный формат токена"


class UserIsNotPresentException(BException):
    status_code = status.HTTP_401_UNAUTHORIZED


class AccessForbiddenException(BException):
    status_code = status.HTTP_403_FORBIDDEN
    detail = "Доступ запрещён"


class EventAlreadyStartedException(BException):
    status_code = status.HTTP_418_IM_A_TEAPOT
    detail = "Мероприятие уже началось"


class RefundDeclinedException(BException):
    status_code = status.HTTP_418_IM_A_TEAPOT
    detail = "Время возврата билета истекло"


class PaymentExpiredException(BException):
    status_code = status.HTTP_418_IM_A_TEAPOT
    detail = "Время оплаты брони истекло"


class BadFileException(BException):
    status_code = status.HTTP_418_IM_A_TEAPOT
    detail = "Это не .jpeg"


class CheckIsAlreadyPayedException(BException):
    status_code = status.HTTP_418_IM_A_TEAPOT
    detail = "Билет уже оплачен"


class CheckIsNotPayedException(BException):
    status_code = status.HTTP_418_IM_A_TEAPOT
    detail = "Билет не был оплачен"


class PaymentDeclinedException(BException):
    status_code = status.HTTP_418_IM_A_TEAPOT
    detail = "Ошибка обработки платежа"


class NotEnoughPlacesLeftException(BException):
    status_code = status.HTTP_418_IM_A_TEAPOT
    detail = "Недостаточно мест на мероприятие"


class NotValidBookingException(BException):
    status_code = status.HTTP_418_IM_A_TEAPOT
    detail = "Бронь недействительна"


class BadRequestException(BException):
    status_code = status.HTTP_400_BAD_REQUEST
    detail = "Bad Request"


class UserIsAlreadyModeratorException(BException):
    status_code = status.HTTP_400_BAD_REQUEST
    detail = "Пользователь уже обладает правами модератора"
