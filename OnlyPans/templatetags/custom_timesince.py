from django import template
from django.utils.timesince import timesince
from django.utils.timezone import now, make_aware, is_aware
from django.utils.dateparse import parse_datetime
from datetime import timedelta
from zoneinfo import ZoneInfo

register = template.Library()

@register.filter
def custom_timesince(value):
    if value is None:
        return "YAWA"
    if isinstance(value, str):
        value = parse_datetime(value)
        if value is None:
            return 'YAWA NAPUD'

    # Ensure value is in the local timezone
    if is_aware(value):
        value = value.astimezone(ZoneInfo("Asia/Manila"))
    else:
        value = make_aware(value, timezone=ZoneInfo("Asia/Manila"))

    # Calculate time difference relative to the current local time
    delta = now() - value

    # If the time difference is less than a minute, return "Just now"
    if delta < timedelta(minutes=1):
        return "Just now"

    # Get the number of seconds, minutes, hours, etc.
    seconds = delta.total_seconds()
    minutes = seconds // 60
    hours = minutes // 60
    days = hours // 24
    months = days // 30  # Approximate
    years = days // 365  # Approximate

    # Return the most appropriate unit of time
    if years > 0:
        return f"{int(years)} year{'s' if years > 1 else ''} ago"
    if months > 0:
        return f"{int(months)} month{'s' if months > 1 else ''} ago"
    if days > 0:
        return f"{int(days)} day{'s' if days > 1 else ''} ago"
    if hours > 0:
        return f"{int(hours)} hour{'s' if hours > 1 else ''} ago"
    if minutes > 0:
        return f"{int(minutes)} minute{'s' if minutes > 1 else ''} ago"

    return "Just now"  # Should not reach here
