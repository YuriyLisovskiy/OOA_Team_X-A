from rest_framework import generics, permissions

from artwork.models import Artwork, Comment
from artwork.serializers import ReadOnlyArtworkSerializer, ReadOnlyCommentSerializer, VoteForArtworkSerializer, \
	VoteForCommentSerializer


# /api/v1/artworks
# methods:
#   - get
class ArtworksAPIView(generics.ListAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = Artwork.objects.all()
	serializer_class = ReadOnlyArtworkSerializer


# /api/v1/artworks/<pk>
# methods:
#   - get
class ArtworkAPIView(generics.RetrieveAPIView):
	permission_classes = (permissions.AllowAny,)
	queryset = Artwork.objects.all()
	serializer_class = ReadOnlyArtworkSerializer


# /api/v1/artworks/<pk>/vote
# methods:
#   - put
class VoteForArtworkAPIView(generics.UpdateAPIView):
	queryset = Artwork.objects.all()
	serializer_class = VoteForArtworkSerializer


# /api/v1/artworks/comments
# methods:
#   - get
class CommentsAPIView(generics.ListAPIView):
	serializer_class = ReadOnlyCommentSerializer

	def get_queryset(self):
		artwork_id = self.request.GET.get('artwork_id', None)
		return Comment.objects.filter(artwork_id=artwork_id)


# /api/v1/artworks/comments/<pk>
# methods:
#   - get
class CommentAPIView(generics.RetrieveAPIView):
	queryset = Comment.objects.all()
	serializer_class = ReadOnlyCommentSerializer


# /api/v1/artworks/comments/<pk>/vote
# methods:
#   - put
class VoteForCommentAPIView(generics.UpdateAPIView):
	queryset = Comment.objects.all()
	serializer_class = VoteForCommentSerializer
