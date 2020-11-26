from django.http import QueryDict
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

from artwork.models import CommentModel
from artwork.permissions import ModifyCommentPermission
from artwork.serializers.comment_model import (
	CommentDetailsSerializer, CreateCommentSerializer, CreateCommentReplySerializer,
	VoteForCommentSerializer, EditCommentSerializer
)


# /api/v1/artworks/<pk>/comments
# path args:
#   - pk: primary key of parent artwork
# methods:
#   - get
# returns (success status - 200):
#   {
#       "count": <int (total pages quantity)>,
#       "next": <string (link to load next page)>,
#       "previous": <string (link to load previous page)>,
#       "results": [
# 	        {
# 	            "id": <int>,
# 	            "text": <string>,
# 	            "points": <int>,
# 	            "author": {
# 	                "id": <int>,
# 	                "username": <string>,
# 	                "avatar": <string (full link)>
# 	            },
# 	            "creation_date": <string>,
# 	            "creation_time": <string>,
# 	            "answers": <array of primary keys of answers>
# 	        },
#           ...
#       ]
#   }
class CommentsAPIView(generics.ListAPIView):
	serializer_class = CommentDetailsSerializer
	pagination_class = PageNumberPagination
	queryset = CommentModel.objects.all()

	def get_queryset(self):
		return self.queryset.filter(artwork_id=self.kwargs['pk'])


# /api/v1/artworks/comments/<pk>
# path args:
#   - pk: primary key of comment
# methods:
#   - get
# returns (success status - 200):
#   {
#       "id": <int>,
# 	    "text": <string>,
# 	    "points": <int>,
# 	    "author": {
# 	        "id": <int>,
# 	        "username": <string>,
# 	        "avatar": <string (full link)>
# 	    },
# 	    "creation_date": <string>,
# 	    "creation_time": <string>,
# 	    "answers": <array of primary keys of answers>
#   }
class CommentAPIView(generics.RetrieveAPIView):
	queryset = CommentModel.objects.all()
	serializer_class = CommentDetailsSerializer


# /api/v1/artworks/<pk>/comments/create
# path args:
#   - pk: primary key of parent artwork
# methods:
#   - post:
#       - text: string
# returns (success status - 201):
#   {
#       "id": <int>,
#       "author_details": {
# 	        "id": <int>,
# 	        "username": <string>,
# 	        "avatar": <string (full link)>
#       }
#   }
class CreateCommentAPIView(generics.CreateAPIView):
	queryset = CommentModel.objects.all()
	serializer_class = CreateCommentSerializer

	def create(self, request, *args, **kwargs):
		data = request.data.dict()
		data['artwork'] = self.kwargs['pk']
		data['author'] = request.user.pk
		full_data = QueryDict(mutable=True)
		full_data.update(**data)
		request._full_data = full_data
		return super(CreateCommentAPIView, self).create(request, *args, **kwargs)


# /api/v1/artworks/comments/<pk>/edit
# path args:
#   - pk: primary key of comment to edit
# methods:
#   - put:
#       - text: string
# returns (success status - 200):
#   {}
class EditCommentAPIView(generics.UpdateAPIView):
	permission_classes = [IsAuthenticated & ModifyCommentPermission]
	queryset = CommentModel.objects.all()
	serializer_class = EditCommentSerializer


# /api/v1/artworks/comments/<pk>/delete
# path args:
#   - pk: primary key of comment to delete
# methods:
#   - delete
# returns (success status - 204):
#   {}
class DeleteCommentAPIView(generics.DestroyAPIView):
	queryset = CommentModel.objects.all()
	permission_classes = (
		IsAuthenticated & ModifyCommentPermission,
	)


# /api/v1/artworks/comments/<pk>/reply
# path args:
#   - pk: primary key of parent comment
# methods:
#   - post:
#       - text: string
# returns (success status - 201):
#   {
#       "id": <int>,
#       "author_details": {
# 	        "id": <int>,
# 	        "username": <string>,
# 	        "avatar": <string (full link)>
#       }
#   }
class ReplyToCommentAPIView(generics.CreateAPIView):
	queryset = CommentModel.objects.all()
	serializer_class = CreateCommentReplySerializer

	def create(self, request, *args, **kwargs):
		data = request.data.dict()
		data['comment'] = self.kwargs['pk']
		full_data = QueryDict(mutable=True)
		full_data.update(**data)
		request._full_data = full_data
		return super(ReplyToCommentAPIView, self).create(request, *args, **kwargs)


# /api/v1/artworks/comments/<pk>/vote
# methods:
#   - put:
#       - mark: int (value from -10 to 10)
# returns (success status - 200):
#   {
#       "points": <float>
#   }
class VoteForCommentAPIView(generics.UpdateAPIView):
	queryset = CommentModel.objects.all()
	serializer_class = VoteForCommentSerializer
