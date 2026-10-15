from django.middleware.csrf import get_token

from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class SessionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        csrf_token = get_token(request)

        if not request.user.is_authenticated:
            return Response({
                "authenticated": False,
                "user": None,
                "csrfToken": csrf_token,
            })

        user = request.user

        if user.is_staff:
            role = "admin"
        else:
            profile = getattr(user, "profile", None)
            role = profile.role if profile else None

        return Response({
            "authenticated": True,
            "user": {
                "id": user.id,
                "name": user.get_full_name() or user.username,
                "email": user.email,
                "role": role,
            },
            "csrfToken": csrf_token,
        })