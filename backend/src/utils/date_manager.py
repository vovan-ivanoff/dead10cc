import datetime
import datetime as dt


class DateManager:
    format = "%d.%m.%Y %H:%M"  # DD.MM.YYYY HH:MM

    @classmethod
    def date_to_string(cls, date: dt.datetime):
        return dt.datetime.strftime(date, cls.format)

    @classmethod
    def string_to_date(cls, string: str):
        return dt.datetime.strptime(string, cls.format)

    @classmethod
    def now(cls):
        return cls.string_to_date(cls.date_to_string(dt.datetime.now()))

    @classmethod
    def add(cls, date: dt.datetime, **kwargs):
        return date + datetime.timedelta(**kwargs)
