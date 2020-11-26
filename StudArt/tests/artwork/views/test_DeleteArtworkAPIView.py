from artwork.views.artwork import DeleteArtworkAPIView
from tests.common import APIFactoryTestCase


class DeleteArtworkTestCase(APIFactoryTestCase):
	def setUp(self) -> None:
		super(DeleteArtworkTestCase, self).setUp()
		self.view = DeleteArtworkAPIView.as_view()