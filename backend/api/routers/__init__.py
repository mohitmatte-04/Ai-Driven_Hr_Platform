"""
API Routers Package
"""

from .jd import router as jd_router
from .resume import router as resume_router
from .ranking import router as ranking_router
from .communication import router as communication_router
from .chat import router as chat_router

__all__ = [
    "jd_router",
    "resume_router",
    "ranking_router",
    "communication_router",
    "chat_router"
]
