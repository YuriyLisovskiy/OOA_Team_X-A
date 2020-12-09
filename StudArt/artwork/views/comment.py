from django.db.models import Q
from django.http import QueryDict
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from artwork.models import CommentModel
from artwork.pagination import CommentSetPagination
from artwork.permissions import ModifyCommentPermission
from artwork.serializers.comment_model import (
	CommentDetailsSerializer, CreateCommentSerializer, CreateCommentReplySerializer,
	VoteForCommentSerializer, EditCommentSerializer, CancelVoteForCommentSerializer
)


# /api/v1/artworks/<pk>/comments
# path args:
#   - pk: primary key of parent artwork (or comment)
# methods:
#   - get:
#       - answers: bool (set to true to search for answers; then pk - primary key if parent comment)
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
#               "up_voted": <bool>,
#               "down_voted": <bool>,
# 	            "author": {
# 	                "id": <int>,
# 	                "username": <string>,
# 	                "avatar": <string (full link)>
# 	            },
# 	            "creation_date": <string>,
# 	            "creation_time": <string>,
# 	            "can_vote": <bool>,
# 	            "can_be_edited": <bool>,
# 	            "can_be_deleted": <bool>
# 	        },
#           ...
#       ]
#   }
class CommentsAPIView(generics.ListAPIView):
	permission_classes = (AllowAny,)
	serializer_class = CommentDetailsSerializer
	pagination_class = CommentSetPagination
	queryset = CommentModel.objects.all()

	def get_queryset(self):
		get_answers = self.request.query_params.get('answers', 'false').lower() == 'true'
		reverse = ''
		if get_answers:
			q = Q(comment_id=self.kwargs['pk'])
		else:
			reverse = '-'
			q = Q(artwork_id=self.kwargs['pk'])

		return self.queryset.filter(q).order_by('{}creation_date_time'.format(reverse))


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
#       "up_voted": <bool>,
#       "down_voted": <bool>,
# 	    "author": {
# 	        "id": <int>,
# 	        "username": <string>,
# 	        "avatar": <string (full link)>
# 	    },
# 	    "creation_date": <string>,
# 	    "creation_time": <string>,
# 	    "can_vote": <bool>,
# 	    "can_be_edited": <bool>,
# 	    "can_be_deleted": <bool>
#   }
class CommentAPIView(generics.RetrieveAPIView):
	permission_classes = (AllowAny,)
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
		data['author'] = request.user.pk
		# full_data = QueryDict(mutable=True)
		# full_data.update(**data)
		request._full_data = data
		return super(ReplyToCommentAPIView, self).create(request, *args, **kwargs)


# /api/v1/artworks/comments/<pk>/vote
# methods:
#   - put:
#       - mark: int (value from -10 to 10)
# returns (success status - 200):
#   {
#       "points": <int>
#   }
class VoteForCommentAPIView(generics.UpdateAPIView):
	queryset = CommentModel.objects.all()
	serializer_class = VoteForCommentSerializer


# /api/v1/artworks/comments/<pk>/vote/cancel
# methods:
#   - put
# returns (success status - 200):
#   {
#       "points": <int>
#   }
class CancelVoteForCommentAPIView(generics.UpdateAPIView):
	queryset = CommentModel.objects.all()
	serializer_class = CancelVoteForCommentSerializer
