from core.serializers.user_model import UserDetailsSerializer


def jwt_response_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': UserDetailsSerializer(user, context={'request': request}).data
    }
